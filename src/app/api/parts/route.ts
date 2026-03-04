import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/parts - Get all parts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const vendorId = searchParams.get('vendorId');

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            name: { contains: category, mode: 'insensitive' }
          }
        }
      };
    }

    const [parts, totalCount] = await Promise.all([
      prisma.part.findMany({
        where,
        include: {
          manufacturer: { select: { name: true } },
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
          reviews: { select: { rating: true, verified: true } },
          _count: { select: { reviews: true } }
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.part.count({ where })
    ]);

    // Calculate average ratings
    const partsWithRatings = parts.map((part: any) => ({
      ...part,
      averageRating: part.reviews.length > 0 
        ? part.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / part.reviews.length 
        : 0,
      reviewCount: part._count.reviews
    }));

    return NextResponse.json({
      parts: partsWithRatings,
      total: totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}

// POST /api/parts - Create a new part
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sku, 
      name, 
      description, 
      price, 
      condition, 
      weight,
      dimensions,
      carbonFootprint,
      warrantyPeriod,
      vendorId,
      manufacturerId,
      supplierId,
      categories,
      initialStock,
      location
    } = body;

    // Validate required fields
    if (!sku || !name || !description || !price || !vendorId) {
      return NextResponse.json(
        { error: 'Missing required fields: sku, name, description, price, vendorId' },
        { status: 400 }
      );
    }

    // Create part with inventory and categories in a transaction
    const part = await prisma.$transaction(async (tx) => {
      // Create the part
      const newPart = await (tx as any).part.create({
        data: {
          sku,
          name,
          description,
          price: parseFloat(price),
          condition: condition || 'New',
          weight: weight ? parseFloat(weight) : null,
          dimensions,
          carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
          warrantyPeriod,
          vendorId,
          manufacturerId,
          supplierId
        }
      });

      // Create inventory record if initial stock provided
      if (initialStock !== undefined) {
        await (tx as any).inventory.create({
          data: {
            partId: newPart.id,
            quantity: parseInt(initialStock),
            location: location || 'Warehouse'
          }
        });
      }

      // Link categories if provided
      if (categories && categories.length > 0) {
        await (tx as any).partCategory.createMany({
          data: categories.map((categoryId: string, index: number) => ({
            partId: newPart.id,
            categoryId,
            isPrimary: index === 0
          }))
        });
      }

      return newPart;
    });

    return NextResponse.json(part, { status: 201 });
  } catch (error: any) {
    console.error('Error creating part:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Part with this SKU already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create part' }, { status: 500 });
  }
}