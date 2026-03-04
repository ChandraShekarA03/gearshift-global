import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, metadata } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 });
    }

    // Upsert user to avoid race conditions
    try {
      const dbUser = await prisma.user.upsert({
        where: { email },
        update: {
          name: metadata?.name || undefined,
          role: metadata?.role || undefined,
          phone: metadata?.phone || undefined,
          avatar: metadata?.avatar_url || undefined,
        },
        create: {
          id: userId,
          email,
          name: metadata?.name || null,
          role: metadata?.role || 'Customer',
          phone: metadata?.phone || null,
          avatar: metadata?.avatar_url || null,
        },
      });

      return NextResponse.json({ user: dbUser });
    } catch (error: any) {
      // If there's still a unique constraint error, fetch the existing user
      if (error.code === 'P2002') {
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });
        return NextResponse.json({ user: existingUser });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user with database' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email }
    });

    return NextResponse.json({ user: dbUser });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user from database' }, 
      { status: 500 }
    );
  }
}