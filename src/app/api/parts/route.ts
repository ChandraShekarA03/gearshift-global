import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    let query = supabase
      .from('Part')
      .select('*')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.ilike('name', `%${category}%`);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    const { data: parts, error, count } = await query;

    if (error) {
      console.error('Error fetching parts:', error);
      return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
    }

    return NextResponse.json({
      parts,
      total: count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/parts - Create a new part
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, name, description, price, condition, compatibility, carbonFootprint, vendorId } = body;

    // Validate required fields
    if (!sku || !name || !price || !vendorId) {
      return NextResponse.json(
        { error: 'Missing required fields: sku, name, price, vendorId' },
        { status: 400 }
      );
    }

    const { data: part, error } = await supabase
      .from('Part')
      .insert({
        sku,
        name,
        description,
        price: parseFloat(price),
        condition: condition || 'New',
        compatibility: JSON.stringify(compatibility || []),
        carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
        vendorId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating part:', error);
      return NextResponse.json({ error: 'Failed to create part' }, { status: 500 });
    }

    return NextResponse.json(part, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}