import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/vehicles - Get all vehicles with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');

    let query = supabase
      .from('Vehicle')
      .select('*, user:User(name, email)')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (userId) {
      query = query.eq('userId', userId);
    }

    if (make) {
      query = query.ilike('make', `%${make}%`);
    }

    if (model) {
      query = query.ilike('model', `%${model}%`);
    }

    if (year) {
      query = query.eq('year', parseInt(year));
    }

    const { data: vehicles, error, count } = await query;

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }

    return NextResponse.json({
      vehicles,
      total: count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { make, model, year, vin, userId } = body;

    // Validate required fields
    if (!make || !model || !year || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: make, model, year, userId' },
        { status: 400 }
      );
    }

    const { data: vehicle, error } = await supabase
      .from('Vehicle')
      .insert({
        make,
        model,
        year: parseInt(year),
        vin,
        userId
      })
      .select('*, user:User(name, email)')
      .single();

    if (error) {
      console.error('Error creating vehicle:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Vehicle with this VIN already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
    }

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}