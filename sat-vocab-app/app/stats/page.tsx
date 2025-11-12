'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WordStat {
  wordId: number;
  word: string;
  definition: string;
  synonym: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
}

interface UserStats {
  overview: {
    totalWordsStudied: number;
    totalAttempts: number;
    totalCorrect: number;
    totalIncorrect: number;
    overallAccuracy: number;
  };
  strongestWords: WordStat[];
  weakestWords: WordStat[];
  mostPracticed: WordStat[];
  mostMissed: WordStat[];
  recentWords: WordStat[];
}

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats');

      if (response.status === 401) {
        router.push('/signin');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load statistics');
        setLoading(false);
        return;
      }

      setStats(data.stats);
    } catch (err) {
      setError('An error occurred loading your statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-lg text-gray-700">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Failed to load statistics'}</p>
          <Link href="/">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (stats.overview.totalWordsStudied === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Statistics Yet</h2>
          <p className="text-gray-600 mb-6">
            Start taking quizzes to track your progress and see your statistics here!
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
              Start Learning
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Your Statistics</h1>
          <Link href="/">
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg shadow transition-colors">
              ← Back to Home
            </button>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Words Studied</div>
            <div className="text-3xl font-bold text-indigo-600">{stats.overview.totalWordsStudied}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Total Attempts</div>
            <div className="text-3xl font-bold text-blue-600">{stats.overview.totalAttempts}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Overall Accuracy</div>
            <div className="text-3xl font-bold text-green-600">{stats.overview.overallAccuracy}%</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Correct Answers</div>
            <div className="text-3xl font-bold text-emerald-600">{stats.overview.totalCorrect}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-900">Vocabulary Mastery</h3>
            <span className="text-sm text-gray-600">
              {stats.overview.totalWordsStudied} / 1796 words ({Math.round((stats.overview.totalWordsStudied / 1796) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.overview.totalWordsStudied / 1796) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Strongest Words */}
        {stats.strongestWords.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💪</span>
              Your Strongest Words
            </h3>
            <div className="space-y-3">
              {stats.strongestWords.map((word, index) => (
                <div key={word.wordId} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{word.word}</div>
                      <div className="text-sm text-gray-600">{word.definition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{word.accuracy}%</div>
                    <div className="text-xs text-gray-500">{word.correct}/{word.total} correct</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weakest Words */}
        {stats.weakestWords.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Words to Practice
            </h3>
            <div className="space-y-3">
              {stats.weakestWords.map((word, index) => (
                <div key={word.wordId} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{word.word}</div>
                      <div className="text-sm text-gray-600">{word.definition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{word.accuracy}%</div>
                    <div className="text-xs text-gray-500">{word.correct}/{word.total} correct</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Missed Words */}
        {stats.mostMissed.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">❌</span>
              Most Missed Words
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Words you've gotten wrong the most times
            </p>
            <div className="space-y-3">
              {stats.mostMissed.map((word, index) => (
                <div key={word.wordId} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{word.word}</div>
                      <div className="text-sm text-gray-600">{word.definition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{word.incorrect}</div>
                    <div className="text-xs text-gray-500">times wrong</div>
                    <div className="text-xs text-gray-400 mt-1">{word.accuracy}% accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Practiced */}
        {stats.mostPracticed.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Most Practiced Words
            </h3>
            <div className="space-y-3">
              {stats.mostPracticed.map((word, index) => (
                <div key={word.wordId} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{word.word}</div>
                      <div className="text-sm text-gray-600">{word.definition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{word.total}</div>
                    <div className="text-xs text-gray-500">attempts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
