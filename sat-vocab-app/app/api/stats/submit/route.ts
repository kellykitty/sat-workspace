import { NextRequest, NextResponse } from 'next/server';
import { updateGlobalStats } from '@/lib/globalStats';
import { AnswerSubmission } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: AnswerSubmission[] = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Expected array of answer submissions' },
        { status: 400 }
      );
    }

    // Update stats for each answer
    const results = body.map(({ wordId, isCorrect }) => {
      return updateGlobalStats(wordId, isCorrect);
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} word statistics`,
      stats: results
    });
  } catch (error) {
    console.error('Error submitting stats:', error);
    return NextResponse.json(
      { error: 'Failed to submit statistics' },
      { status: 500 }
    );
  }
}
