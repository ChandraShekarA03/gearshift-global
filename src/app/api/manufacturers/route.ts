import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/manufacturers - Get all manufacturers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = supabase
      .from('Manufacturer')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('name', { ascending: true });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: manufacturers, error, count } = await query;

    if (error) {
      console.error('Error fetching manufacturers:', error);
      return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
    }

    return NextResponse.json({
      manufacturers,
      total: count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/manufacturers - Create a new manufacturer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, website, logo } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const { data: manufacturer, error } = await supabase
      .from('Manufacturer')
      .insert({
        name,
        description,
        website,
        logo
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating manufacturer:', error);
      return NextResponse.json({ error: 'Failed to create manufacturer' }, { status: 500 });
    }

    return NextResponse.json(manufacturer, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}