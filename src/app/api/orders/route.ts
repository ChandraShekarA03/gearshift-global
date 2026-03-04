import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Build where clause for filtering
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true }
          },
          promotion: {
            select: { code: true, description: true }
          },
          shippingAddress: {
            select: { street: true, city: true, state: true, zipCode: true, country: true }
          },
          billingAddress: {
            select: { street: true, city: true, state: true, zipCode: true, country: true }
          },
          paymentMethod: {
            select: { type: true, lastFour: true }
          },
          items: {
            include: {
              part: {
                select: { name: true, sku: true }
              }
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      orders,
      total: totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
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
      subtotal += item.price * item.quantity;
    }

    // Apply promotion if provided
    let promotionId = null;
    if (promotionCode) {
      const promotion = await prisma.promotion.findUnique({
        where: { code: promotionCode }
      });

      if (promotion && promotion.isActive && 
          new Date() >= promotion.startDate && 
          new Date() <= promotion.endDate) {
        promotionId = promotion.id;
        
        if (promotion.type === 'Percentage') {
          discount = subtotal * (promotion.value / 100);
        } else {
          discount = promotion.value;
        }

        if (promotion.maxDiscount && discount > promotion.maxDiscount) {
          discount = promotion.maxDiscount;
        }
      }
    }

    const taxAmount = subtotal * 0.08; // 8% tax rate
    const shippingAmount = ecoShipping ? 5.99 : 9.99;
    const totalAmount = subtotal + taxAmount + shippingAmount - discount;

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await (tx as any).order.create({
        data: {
          userId,
          status: 'Pending',
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
        }
      });

      // Create order items
      await (tx as any).orderItem.createMany({
        data: items.map((item: OrderItemInput) => ({
          orderId: newOrder.id,
          partId: item.partId,
          quantity: item.quantity,
          price: item.price
        }))
      });

      // Update promotion usage count if used
      if (promotionId) {
        await (tx as any).promotion.update({
          where: { id: promotionId },
          data: {
            usageCount: { increment: 1 }
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}