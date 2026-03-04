import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/manufacturers/[id] - Get a specific manufacturer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: manufacturer, error } = await supabase
      .from('Manufacturer')
      .select(`
        *,
        parts:Part(
          id,
          name,
          sku,
          price
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
      }
      console.error('Error fetching manufacturer:', error);
      return NextResponse.json({ error: 'Failed to fetch manufacturer' }, { status: 500 });
    }

    return NextResponse.json(manufacturer);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/manufacturers/[id] - Update a specific manufacturer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, website, logo } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (logo !== undefined) updateData.logo = logo;

    const { data: manufacturer, error } = await supabase
      .from('Manufacturer')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
      }
      console.error('Error updating manufacturer:', error);
      return NextResponse.json({ error: 'Failed to update manufacturer' }, { status: 500 });
    }

    return NextResponse.json(manufacturer);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/manufacturers/[id] - Delete a specific manufacturer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('Manufacturer')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting manufacturer:', error);
      return NextResponse.json({ error: 'Failed to delete manufacturer' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Manufacturer deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}