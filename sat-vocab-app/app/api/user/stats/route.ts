import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserPerformance } from '@/lib/db';
import wordsData from '@/data/words.json';

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

    // Calculate statistics
    const stats = calculateUserStats(performance);

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateUserStats(performance: Record<number, { correct: number; incorrect: number }>) {
  const wordMap = new Map(wordsData.map(word => [word.id, word]));

  let totalWordsStudied = 0;
  let totalAttempts = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;

  const wordStats = Object.entries(performance).map(([wordIdStr, perf]) => {
    const wordId = parseInt(wordIdStr);
    const word = wordMap.get(wordId);
    const total = perf.correct + perf.incorrect;
    const accuracy = total > 0 ? (perf.correct / total) * 100 : 0;

    totalWordsStudied++;
    totalAttempts += total;
    totalCorrect += perf.correct;
    totalIncorrect += perf.incorrect;

    return {
      wordId,
      word: word?.word || 'Unknown',
      definition: word?.definition || '',
      synonym: word?.synonym || '',
      correct: perf.correct,
      incorrect: perf.incorrect,
      total,
      accuracy: Math.round(accuracy)
    };
  });

  // Sort by accuracy
  const sortedByAccuracy = [...wordStats].sort((a, b) => a.accuracy - b.accuracy);

  // Get strongest words (top 10 by accuracy, min 3 attempts)
  const strongestWords = [...wordStats]
    .filter(w => w.total >= 3)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 10);

  // Get weakest words (bottom 10 by accuracy, min 3 attempts)
  const weakestWords = [...wordStats]
    .filter(w => w.total >= 3)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 10);

  // Get most practiced words
  const mostPracticed = [...wordStats]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Get most missed words (by total incorrect count)
  const mostMissed = [...wordStats]
    .filter(w => w.incorrect > 0)
    .sort((a, b) => b.incorrect - a.incorrect)
    .slice(0, 10);

  const overallAccuracy = totalAttempts > 0
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0;

  return {
    overview: {
      totalWordsStudied,
      totalAttempts,
      totalCorrect,
      totalIncorrect,
      overallAccuracy
    },
    strongestWords,
    weakestWords,
    mostPracticed,
    mostMissed,
    recentWords: wordStats.slice(-10).reverse() // Last 10 words studied
  };
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic';
