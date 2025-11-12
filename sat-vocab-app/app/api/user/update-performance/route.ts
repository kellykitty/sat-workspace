import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateUserWordPerformance } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { wordId, isCorrect } = await request.json();

    if (typeof wordId !== 'number' || typeof isCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    updateUserWordPerformance(user.userId, wordId, isCorrect);

    return NextResponse.json({
      success: true,
      message: 'Performance updated successfully'
    });
  } catch (error) {
    console.error('Update performance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
