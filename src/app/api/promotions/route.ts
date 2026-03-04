import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/promotions - Get all promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const active = searchParams.get('active');

    let query = supabase
      .from('Promotion')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (active === 'true') {
      query = query.eq('isActive', true).gte('endDate', new Date().toISOString());
    }

    const { data: promotions, error, count } = await query;

    if (error) {
      console.error('Error fetching promotions:', error);
      return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
    }

    return NextResponse.json({
      promotions,
      total: count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/promotions - Create a new promotion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, description, type, value, minOrder, maxDiscount, startDate, endDate, usageLimit } = body;

    if (!code || !description || !type || !value || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: code, description, type, value, startDate, endDate' },
        { status: 400 }
      );
    }

    if (!['Percentage', 'Fixed Amount'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "Percentage" or "Fixed Amount"' },
        { status: 400 }
      );
    }

    const { data: promotion, error } = await supabase
      .from('Promotion')
      .insert({
        code,
        description,
        type,
        value: parseFloat(value),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        startDate,
        endDate,
        usageLimit: usageLimit ? parseInt(usageLimit) : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating promotion:', error);
      return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
    }

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}