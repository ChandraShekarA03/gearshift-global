import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/orders - Get all orders with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = supabase
      .from('Order')
      .select(`
        *,
        user:User(name, email),
        items:OrderItem(
          id,
          quantity,
          price,
          part:Part(name, sku)
        )
      `)
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    // Apply filters
    if (userId) {
      query = query.eq('userId', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({
      orders,
      total: count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, currency, shippingRoute, ecoShipping, carbonSaved } = body;

    // Validate required fields
    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, items' },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      if (!item.partId || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: 'Each item must have partId, quantity, and price' },
          { status: 400 }
        );
      }
      totalAmount += item.quantity * item.price;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        userId,
        currency: currency || 'USD',
        totalAmount,
        shippingRoute,
        ecoShipping: ecoShipping || false,
        carbonSaved: carbonSaved || 0
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      orderId: order.id,
      partId: item.partId,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('OrderItem')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order if items creation fails
      await supabase.from('Order').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    // Fetch complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('Order')
      .select(`
        *,
        user:User(name, email),
        items:OrderItem(
          id,
          quantity,
          price,
          part:Part(name, sku)
        )
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete order:', fetchError);
      return NextResponse.json(completeOrder, { status: 201 }); // Still return success
    }

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}