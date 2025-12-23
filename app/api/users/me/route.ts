// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

   

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullNameFr: true,
        fullNameAr: true,
        email: true,
        role: true,
        approved: true,
        phoneNumber: true,
        preferredLocale: true,
        emailVerifiedAt: true,
        club: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}