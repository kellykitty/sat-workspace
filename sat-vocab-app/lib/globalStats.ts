import fs from 'fs';
import path from 'path';
import { GlobalWordStats } from '@/types';

const STATS_FILE = path.join(process.cwd(), 'data', 'global-stats.json');

// Ensure the stats file exists
function ensureStatsFile() {
  if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify({}), 'utf-8');
  }
}

// Load global stats from file
export function loadGlobalStats(): GlobalWordStats {
  ensureStatsFile();
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading global stats:', error);
    return {};
  }
}

// Save global stats to file
function saveGlobalStats(stats: GlobalWordStats) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving global stats:', error);
  }
}

// Update stats when a user answers a question
export function updateGlobalStats(wordId: number, isCorrect: boolean) {
  const stats = loadGlobalStats();

  if (!stats[wordId]) {
    stats[wordId] = {
      correct: 0,
      incorrect: 0,
      totalAttempts: 0,
      difficultyScore: 0
    };
  }

  // Update counts
  stats[wordId].totalAttempts += 1;
  if (isCorrect) {
    stats[wordId].correct += 1;
  } else {
    stats[wordId].incorrect += 1;
  }

  // Calculate difficulty score (0-1, higher = more difficult)
  // This is the error rate: incorrect / total
  const errorRate = stats[wordId].incorrect / stats[wordId].totalAttempts;
  stats[wordId].difficultyScore = errorRate;

  saveGlobalStats(stats);
  return stats[wordId];
}

// Get difficulty weight for question generation
// Returns a value >= 1, where higher = more difficult = should appear more often
export function getGlobalDifficultyWeight(wordId: number): number {
  const stats = loadGlobalStats();

  if (!stats[wordId] || stats[wordId].totalAttempts < 5) {
    // Not enough data, return base weight
    return 1;
  }

  // Scale difficulty: words with 0-20% error rate get weight 1
  // Words with 80-100% error rate get weight 5
  const difficultyScore = stats[wordId].difficultyScore;
  return 1 + (difficultyScore * 4);
}
