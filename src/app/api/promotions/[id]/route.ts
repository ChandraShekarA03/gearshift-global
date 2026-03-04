import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/promotions/[id] - Get a specific promotion
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: promotion, error } = await supabase
      .from('Promotion')
      .select(`
        *,
        orders:Order(
          id,
          totalAmount,
          createdAt
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
      }
      console.error('Error fetching promotion:', error);
      return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/promotions/[id] - Update a specific promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, description, type, value, minOrder, maxDiscount, startDate, endDate, usageLimit, isActive } = body;

    const updateData: Record<string, unknown> = {};
    if (code !== undefined) updateData.code = code;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) {
      if (!['Percentage', 'Fixed Amount'].includes(type)) {
        return NextResponse.json(
          { error: 'Type must be either "Percentage" or "Fixed Amount"' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }
    if (value !== undefined) updateData.value = parseFloat(value);
    if (minOrder !== undefined) updateData.minOrder = minOrder ? parseFloat(minOrder) : null;
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? parseFloat(maxDiscount) : null;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit ? parseInt(usageLimit) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const { data: promotion, error } = await supabase
      .from('Promotion')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
      }
      console.error('Error updating promotion:', error);
      return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/promotions/[id] - Delete a specific promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('Promotion')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promotion:', error);
      return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}