import { NextResponse } from 'next/server';
import { loadGlobalStats } from '@/lib/globalStats';

export async function GET() {
  try {
    const globalStats = loadGlobalStats();

    return NextResponse.json({
      success: true,
      stats: globalStats,
      totalWords: Object.keys(globalStats).length
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global statistics' },
      { status: 500 }
    );
  }
}

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';
