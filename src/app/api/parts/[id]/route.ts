import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/parts/[id] - Get a specific part by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        manufacturer: { select: { name: true } },
        vendor: { select: { name: true, email: true } },
        categories: {
          include: {
            category: { select: { name: true } }
          }
        },
        fitments: {
          include: {
            vehicle: {
              select: { make: true, model: true, year: true }
            }
          }
        },
        inventory: { select: { quantity: true, location: true } },
        reviews: {
          include: {
            user: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { reviews: true } }
      }
    });

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    // Calculate average rating
    const averageRating = part.reviews.length > 0 
      ? part.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / part.reviews.length 
      : 0;

    const partWithRating = {
      ...part,
      averageRating,
      reviewCount: part._count.reviews
    };

    return NextResponse.json(partWithRating);
  } catch (error) {
    console.error('Error fetching part:', error);
    return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 });
  }
}

// DELETE /api/parts/[id] - Delete a specific part
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete part and all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related records first (due to foreign key constraints)
      await (tx as any).partCategory.deleteMany({ where: { partId: id } });
      await (tx as any).fitment.deleteMany({ where: { partId: id } });
      await (tx as any).inventory.deleteMany({ where: { partId: id } });
      await (tx as any).review.deleteMany({ where: { partId: id } });
      await (tx as any).orderItem.deleteMany({ where: { partId: id } });
      await (tx as any).warranty.deleteMany({ where: { partId: id } });

      // Finally delete the part
      await (tx as any).part.delete({ where: { id } });
    });

    return NextResponse.json({ message: 'Part deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting part:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 });
  }
}