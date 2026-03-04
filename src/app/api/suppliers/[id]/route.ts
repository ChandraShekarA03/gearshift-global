import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/suppliers/[id] - Get a specific supplier
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: supplier, error } = await supabase
      .from('Supplier')
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
        return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
      }
      console.error('Error fetching supplier:', error);
      return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/suppliers/[id] - Update a specific supplier
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, contactEmail, contactPhone, address, rating } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (address !== undefined) updateData.address = address;
    if (rating !== undefined) updateData.rating = parseFloat(rating);

    const { data: supplier, error } = await supabase
      .from('Supplier')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
      }
      console.error('Error updating supplier:', error);
      return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/suppliers/[id] - Delete a specific supplier
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('Supplier')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting supplier:', error);
      return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}