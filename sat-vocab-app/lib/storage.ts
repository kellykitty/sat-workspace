import { UserPerformance } from '@/types';

const PERFORMANCE_KEY = 'sat_vocab_performance';
const USER_CACHE_KEY = 'sat_vocab_user';

// Cache user info in localStorage to avoid repeated API calls
let userCache: { id: number; username: string } | null = null;
let userCacheChecked = false;

async function getCurrentUser(): Promise<{ id: number; username: string } | null> {
  if (typeof window === 'undefined') return null;

  // Check cache first
  if (userCacheChecked && userCache !== undefined) {
    return userCache;
  }

  // Try to get from localStorage cache
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      userCache = parsed;
      userCacheChecked = true;
      return parsed;
    }
  } catch (e) {
    // Ignore cache errors
  }

  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      const data = await response.json();
      userCache = data.user;
      userCacheChecked = true;
      // Cache in localStorage
      try {
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
      } catch (e) {
        // Ignore storage errors
      }
      return data.user;
    }
  } catch (error) {
    // Not authenticated or error
  }

  userCache = null;
  userCacheChecked = true;
  return null;
}

export function clearUserCache(): void {
  userCache = null;
  userCacheChecked = false;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_CACHE_KEY);
  }
}

export const storage = {
  // Get user performance data
  getPerformance: (): UserPerformance => {
    if (typeof window === 'undefined') return {};

    // For guest users, use localStorage
    try {
      const data = localStorage.getItem(PERFORMANCE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading performance data:', error);
      return {};
    }
  },

  // Get performance from API (for authenticated users)
  getPerformanceFromAPI: async (): Promise<UserPerformance> => {
    try {
      const response = await fetch('/api/user/performance');
      if (response.ok) {
        const data = await response.json();
        return data.performance || {};
      }
    } catch (error) {
      console.error('Error fetching performance from API:', error);
    }
    return {};
  },

  // Save user performance data (guest only)
  savePerformance: (performance: UserPerformance): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(performance));
    } catch (error) {
      console.error('Error saving performance data:', error);
    }
  },

  // Update performance for a specific word
  updateWordPerformance: async (wordId: number, isCorrect: boolean): Promise<void> => {
    const user = await getCurrentUser();

    if (user) {
      // Authenticated user - save to database via API
      try {
        await fetch('/api/user/update-performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wordId, isCorrect }),
        });
      } catch (error) {
        console.error('Error updating performance via API:', error);
      }
    } else {
      // Guest user - save to localStorage
      const performance = storage.getPerformance();

      if (!performance[wordId]) {
        performance[wordId] = { correct: 0, incorrect: 0 };
      }

      if (isCorrect) {
        performance[wordId].correct += 1;
      } else {
        performance[wordId].incorrect += 1;
      }

      storage.savePerformance(performance);
    }
  },

  // Get accuracy for a specific word
  getWordAccuracy: (wordId: number): number => {
    const performance = storage.getPerformance();
    const wordPerf = performance[wordId];

    if (!wordPerf) return 0;

    const total = wordPerf.correct + wordPerf.incorrect;
    if (total === 0) return 0;

    return wordPerf.correct / total;
  },

  // Reset all performance data
  clearPerformance: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PERFORMANCE_KEY);
  },
};
