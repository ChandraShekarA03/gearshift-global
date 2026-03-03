import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/parts/[id] - Get a specific part
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: part, error } = await supabase
      .from('Part')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 });
      }
      console.error('Error fetching part:', error);
      return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 });
    }

    return NextResponse.json(part);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/parts/[id] - Update a specific part
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sku, name, description, price, condition, compatibility, carbonFootprint, vendorId } = body;

    const updateData: any = {};
    if (sku !== undefined) updateData.sku = sku;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (condition !== undefined) updateData.condition = condition;
    if (compatibility !== undefined) updateData.compatibility = JSON.stringify(compatibility);
    if (carbonFootprint !== undefined) updateData.carbonFootprint = parseFloat(carbonFootprint);
    if (vendorId !== undefined) updateData.vendorId = vendorId;

    const { data: part, error } = await supabase
      .from('Part')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 });
      }
      console.error('Error updating part:', error);
      return NextResponse.json({ error: 'Failed to update part' }, { status: 500 });
    }

    return NextResponse.json(part);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/parts/[id] - Delete a specific part
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('Part')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting part:', error);
      return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}