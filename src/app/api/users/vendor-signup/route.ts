import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json();

    if (!email || !name || role !== 'Vendor') {
      return NextResponse.json(
        { error: 'Invalid vendor signup data' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Update existing user to vendor role
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          role: 'Vendor'
        }
      });
      return NextResponse.json(updatedUser);
    } else {
      // Create new vendor user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          role: 'Vendor'
        }
      });
      return NextResponse.json(newUser);
    }
  } catch (error) {
    console.error('Error in vendor signup:', error);
    return NextResponse.json(
      { error: 'Failed to process vendor signup' },
      { status: 500 }
    );
  }
}