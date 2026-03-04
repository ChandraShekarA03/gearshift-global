import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: order, error } = await supabase
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
          part:Part(name, sku, description)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Update a specific order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      status, 
      shippingRoute, 
      ecoShipping, 
      carbonSaved,
      shippingAddressId,
      billingAddressId,
      paymentMethodId,
      trackingNumber,
      notes
    } = body;

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (shippingRoute !== undefined) updateData.shippingRoute = shippingRoute;
    if (ecoShipping !== undefined) updateData.ecoShipping = ecoShipping;
    if (carbonSaved !== undefined) updateData.carbonSaved = parseFloat(carbonSaved);
    if (shippingAddressId !== undefined) updateData.shippingAddressId = shippingAddressId;
    if (billingAddressId !== undefined) updateData.billingAddressId = billingAddressId;
    if (paymentMethodId !== undefined) updateData.paymentMethodId = paymentMethodId;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (notes !== undefined) updateData.notes = notes;

    const { data: order, error } = await supabase
      .from('Order')
      .update(updateData)
      .eq('id', id)
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
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      console.error('Error updating order:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete a specific order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // First delete order items (cascade should handle this, but let's be explicit)
    const { error: itemsError } = await supabase
      .from('OrderItem')
      .delete()
      .eq('orderId', id);

    if (itemsError) {
      console.error('Error deleting order items:', itemsError);
      return NextResponse.json({ error: 'Failed to delete order items' }, { status: 500 });
    }

    // Then delete the order
    const { error } = await supabase
      .from('Order')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}