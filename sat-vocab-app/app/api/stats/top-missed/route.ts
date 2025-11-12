import { NextRequest, NextResponse } from 'next/server';
import { loadGlobalStats } from '@/lib/globalStats';
import wordsData from '@/data/words.json';
import { Word } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const minAttempts = parseInt(searchParams.get('minAttempts') || '5');

    const globalStats = loadGlobalStats();

    // Create a map of word IDs to word data for quick lookup
    const wordMap = new Map<number, Word>();
    wordsData.forEach(word => {
      wordMap.set(word.id, word);
    });

    // Filter and sort words by difficulty
    const rankedWords = Object.entries(globalStats)
      .filter(([_, stats]) => stats.totalAttempts >= minAttempts)
      .map(([wordId, stats]) => {
        const word = wordMap.get(parseInt(wordId));
        if (!word) return null;

        const errorPercentage = Math.round(stats.difficultyScore * 100);

        return {
          id: word.id,
          word: word.word,
          definition: word.definition,
          synonym: word.synonym,
          totalAttempts: stats.totalAttempts,
          correct: stats.correct,
          incorrect: stats.incorrect,
          errorPercentage,
          difficultyScore: stats.difficultyScore
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.difficultyScore - a!.difficultyScore)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      words: rankedWords,
      totalTrackedWords: Object.keys(globalStats).length
    });
  } catch (error) {
    console.error('Error fetching top missed words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top missed words' },
      { status: 500 }
    );
  }
}

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';
