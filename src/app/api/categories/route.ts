import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/categories - Get all categories with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const parentId = searchParams.get('parentId');

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (parentId) {
      where.parentId = parentId;
    } else if (parentId === null) {
      where.parentId = null; // Root categories
    }

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          parent: {
            select: { id: true, name: true }
          },
          children: {
            select: { id: true, name: true }
          },
          _count: {
            select: { parts: true }
          }
        },
        skip: offset,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.category.count({ where })
    ]);

    return NextResponse.json({
      categories,
      total: totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, parentId } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentId
      },
      include: {
        parent: {
          select: { id: true, name: true }
        },
        _count: {
          select: { parts: true }
        }
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}