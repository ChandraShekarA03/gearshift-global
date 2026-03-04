import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, metadata } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 });
    }

    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!dbUser) {
      // Create new user in database
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email,
          name: metadata?.name || null,
          role: metadata?.role || 'Customer',
          phone: metadata?.phone || null,
          avatar: metadata?.avatar_url || null,
        },
      });
    } else {
      // Update existing user
      dbUser = await prisma.user.update({
        where: { email },
        data: {
          name: metadata?.name || dbUser.name,
          role: metadata?.role || dbUser.role,
          phone: metadata?.phone || dbUser.phone,
          avatar: metadata?.avatar_url || dbUser.avatar,
        },
      });
    }

    return NextResponse.json({ user: dbUser });
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