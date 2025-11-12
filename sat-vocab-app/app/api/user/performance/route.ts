import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserPerformance } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const performance = getUserPerformance(user.userId);

    return NextResponse.json({
      success: true,
      performance
    });
  } catch (error) {
    console.error('Get performance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic';
