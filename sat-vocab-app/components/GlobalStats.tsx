'use client';

import { useState, useEffect } from 'react';

interface TopMissedWord {
  id: number;
  word: string;
  definition: string;
  synonym: string;
  totalAttempts: number;
  correct: number;
  incorrect: number;
  errorPercentage: number;
  difficultyScore: number;
}

export default function GlobalStats() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [words, setWords] = useState<TopMissedWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalTrackedWords, setTotalTrackedWords] = useState(0);

  useEffect(() => {
    if (isExpanded && words.length === 0) {
      fetchTopMissedWords();
    }
  }, [isExpanded]);

  const fetchTopMissedWords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stats/top-missed?limit=20');
      const data = await response.json();
      if (data.success) {
        setWords(data.words);
        setTotalTrackedWords(data.totalTrackedWords);
      }
    } catch (error) {
      console.error('Failed to fetch top missed words:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-8 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Most Challenging Words
            </h3>
            <p className="text-gray-600">
              See which words students struggle with most
            </p>
          </div>
          <div className="flex items-center gap-4">
            {totalTrackedWords > 0 && (
              <div className="text-right mr-4">
                <div className="text-sm text-gray-500">Words Tracked</div>
                <div className="text-2xl font-bold text-indigo-600">{totalTrackedWords}</div>
              </div>
            )}
            <svg
              className={`w-8 h-8 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading statistics...</p>
            </div>
          ) : words.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg">No data available yet.</p>
              <p className="text-sm mt-2">Complete some quizzes to start tracking difficult words!</p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <div className="p-6 space-y-4">
                {words.map((wordData, index) => (
                  <div
                    key={wordData.id}
                    className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {wordData.word}
                          </h4>
                          {wordData.synonym && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              Synonym: {wordData.synonym}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">
                          {wordData.errorPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          error rate
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {wordData.definition}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Incorrect</span>
                        <span>Correct</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-red-500 h-3 rounded-full transition-all"
                          style={{ width: `${wordData.errorPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold text-gray-700">
                          {wordData.totalAttempts}
                        </span>{' '}
                        total attempts
                      </div>
                      <div>
                        <span className="font-semibold text-green-700">
                          {wordData.correct}
                        </span>{' '}
                        correct
                      </div>
                      <div>
                        <span className="font-semibold text-red-700">
                          {wordData.incorrect}
                        </span>{' '}
                        incorrect
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
