import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface OrderItemInput {
  partId: string;
  quantity: number;
  price: number;
}

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
        promotion:Promotion(code, description),
        shippingAddress:Address(street, city, state, zipCode, country),
        billingAddress:Address(street, city, state, zipCode, country),
        paymentMethod:PaymentMethod(type, lastFour),
        items:OrderItem(
          id,
          quantity,
          price,
          discount,
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
    const { 
      userId, 
      items, 
      currency, 
      shippingRoute, 
      ecoShipping, 
      carbonSaved,
      promotionCode,
      shippingAddressId,
      billingAddressId,
      paymentMethodId,
      notes
    } = body;

    // Validate required fields
    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, items' },
        { status: 400 }
      );
    }

    // Calculate amounts
    let subtotal = 0;
    let discount = 0;
    for (const item of items) {
      if (!item.partId || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: 'Each item must have partId, quantity, and price' },
          { status: 400 }
        );
      }
      subtotal += item.quantity * item.price;
    }

    // Check promotion if provided
    let promotionId = null;
    if (promotionCode) {
      const { data: promotion } = await supabase
        .from('Promotion')
        .select('*')
        .eq('code', promotionCode)
        .eq('isActive', true)
        .gte('endDate', new Date().toISOString())
        .single();

      if (promotion) {
        promotionId = promotion.id;
        if (promotion.type === 'Percentage') {
          discount = subtotal * (promotion.value / 100);
        } else {
          discount = Math.min(promotion.value, subtotal);
        }
        if (promotion.maxDiscount) {
          discount = Math.min(discount, promotion.maxDiscount);
        }
      }
    }

    const taxAmount = 0; // Calculate tax based on location
    const shippingAmount = 0; // Calculate shipping
    const totalAmount = subtotal - discount + taxAmount + shippingAmount;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        userId,
        currency: currency || 'USD',
        subtotal,
        taxAmount,
        shippingAmount,
        totalAmount,
        shippingRoute,
        ecoShipping: ecoShipping || false,
        carbonSaved: carbonSaved || 0,
        promotionId,
        shippingAddressId,
        billingAddressId,
        paymentMethodId,
        notes
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: OrderItemInput) => ({
      orderId: order.id,
      partId: item.partId,
      quantity: item.quantity,
      price: item.price,
      discount: discount * (item.quantity * item.price / subtotal) // Pro-rate discount
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

    // Update promotion usage
    if (promotionId) {
      // Get current usage count
      const { data: currentPromotion } = await supabase
        .from('Promotion')
        .select('usageCount')
        .eq('id', promotionId)
        .single();

      if (currentPromotion) {
        await supabase
          .from('Promotion')
          .update({ usageCount: currentPromotion.usageCount + 1 })
          .eq('id', promotionId);
      }
    }

    // Fetch complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('Order')
      .select(`
        *,
        user:User(name, email),
        promotion:Promotion(code, description),
        shippingAddress:Address(street, city, state, zipCode, country),
        billingAddress:Address(street, city, state, zipCode, country),
        paymentMethod:PaymentMethod(type, lastFour),
        items:OrderItem(
          id,
          quantity,
          price,
          discount,
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