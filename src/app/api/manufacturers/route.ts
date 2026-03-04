import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/manufacturers - Get all manufacturers with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [manufacturers, totalCount] = await Promise.all([
      prisma.manufacturer.findMany({
        where,
        include: {
          _count: {
            select: { parts: true }
          }
        },
        skip: offset,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.manufacturer.count({ where })
    ]);

    return NextResponse.json({
      manufacturers,
      total: totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
  }
}

// POST /api/manufacturers - Create a new manufacturer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, website, logo } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Manufacturer name is required' },
        { status: 400 }
      );
    }

    const manufacturer = await prisma.manufacturer.create({
      data: {
        name,
        description,
        website,
        logo
      },
      include: {
        _count: {
          select: { parts: true }
        }
      }
    });

    return NextResponse.json(manufacturer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating manufacturer:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Manufacturer with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create manufacturer' }, { status: 500 });
  }
}