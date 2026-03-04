import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/reviews - Get all reviews with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const partId = searchParams.get('partId');
    const userId = searchParams.get('userId');
    const verified = searchParams.get('verified');

    let query = supabase
      .from('Review')
      .select(`
        *,
        user:User(name, email),
        part:Part(name, sku)
      `)
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false });

    if (partId) {
      query = query.eq('partId', partId);
    }

    if (userId) {
      query = query.eq('userId', userId);
    }

    if (verified !== null) {
      query = query.eq('verified', verified === 'true');
    }

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({
      reviews,
      total: count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partId, userId, rating, title, comment, verified } = body;

    if (!partId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: partId, userId, rating' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const { data: review, error } = await supabase
      .from('Review')
      .insert({
        partId,
        userId,
        rating: parseInt(rating),
        title,
        comment,
        verified: verified || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}