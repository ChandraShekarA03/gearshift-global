import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/vehicles/[id] - Get a specific vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: vehicle, error } = await supabase
      .from('Vehicle')
      .select('*, user:User(name, email)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
      }
      console.error('Error fetching vehicle:', error);
      return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/vehicles/[id] - Update a specific vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { make, model, year, vin, userId } = body;

    const updateData: Record<string, unknown> = {};
    if (make !== undefined) updateData.make = make;
    if (model !== undefined) updateData.model = model;
    if (year !== undefined) updateData.year = parseInt(year);
    if (vin !== undefined) updateData.vin = vin;
    if (userId !== undefined) updateData.userId = userId;

    const { data: vehicle, error } = await supabase
      .from('Vehicle')
      .update(updateData)
      .eq('id', id)
      .select('*, user:User(name, email)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
      }
      console.error('Error updating vehicle:', error);
      return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/vehicles/[id] - Delete a specific vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('Vehicle')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}