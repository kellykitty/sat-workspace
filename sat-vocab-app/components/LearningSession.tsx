'use client';

import { useState, useEffect } from 'react';
import { Word, GlobalWordStats } from '@/types';
import Link from 'next/link';
import wordsData from '@/data/words.json';

interface LearningSessionProps {
  wordCount: number;
}

export default function LearningSession({ wordCount }: LearningSessionProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [globalStatsLoaded, setGlobalStatsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch global stats and select words
  useEffect(() => {
    async function loadWordsWithGlobalStats() {
      try {
        // Fetch global stats
        const response = await fetch('/api/stats/global');
        const data = await response.json();
        const globalStats: GlobalWordStats = data.success ? data.stats : {};

        // Select words based on global difficulty
        const selectedWords = selectWeightedWords(wordsData, globalStats, wordCount);
        setWords(selectedWords);
      } catch (error) {
        console.error('Failed to fetch global stats:', error);
        // Fallback to random selection
        const shuffled = [...wordsData].sort(() => Math.random() - 0.5);
        setWords(shuffled.slice(0, wordCount));
      } finally {
        setGlobalStatsLoaded(true);
      }
    }

    loadWordsWithGlobalStats();
  }, [wordCount]);

  // Select words with weighted probability based on global difficulty
  function selectWeightedWords(allWords: Word[], globalStats: GlobalWordStats, count: number): Word[] {
    const selected: Word[] = [];
    const availableWords = [...allWords];

    for (let i = 0; i < count && availableWords.length > 0; i++) {
      // Calculate weights for remaining words
      const weights = availableWords.map(word => {
        let weight = 1; // Base weight

        const globalStat = globalStats[word.id];
        if (globalStat && globalStat.totalAttempts >= 5) {
          // Add weight based on global difficulty (slightly favor difficult words)
          // difficultyScore is 0-1, where higher = more difficult
          weight += globalStat.difficultyScore * 2; // Max 3x weight
        }

        return weight;
      });

      // Weighted random selection
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;

      let selectedIndex = 0;
      for (let j = 0; j < availableWords.length; j++) {
        random -= weights[j];
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }

      // Add selected word and remove from available
      selected.push(availableWords[selectedIndex]);
      availableWords.splice(selectedIndex, 1);
    }

    return selected;
  }

  // Timer for auto-advancing
  useEffect(() => {
    if (!globalStatsLoaded || isComplete || isPaused || words.length === 0) return;

    if (timeRemaining <= 0) {
      // Move to next word
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setTimeRemaining(5);
      } else {
        setIsComplete(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [globalStatsLoaded, currentIndex, isComplete, timeRemaining, words.length, isPaused]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeRemaining(5);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimeRemaining(5);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!globalStatsLoaded || words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading words...</div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Learning Session Complete!
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            You've learned {words.length} words. Ready to test your knowledge?
          </p>

          <div className="space-y-3">
            <Link href="/quiz">
              <button className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">
                Take a Quiz
              </button>
            </Link>
            <Link href="/learning">
              <button className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
                Learn More Words
              </button>
            </Link>
            <Link href="/">
              <button className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header with progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-600">Word Progress</div>
              <div className="text-2xl font-bold text-gray-900">
                {currentIndex + 1} / {words.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Next in</div>
              <div className={`text-2xl font-bold ${isPaused ? 'text-gray-400' : 'text-emerald-600'}`}>
                {isPaused ? 'Paused' : `${timeRemaining}s`}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Word Card */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-6 min-h-[400px] flex flex-col justify-center items-center">
          <div className="text-center w-full">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              {currentWord.word}
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />
            <p className="text-2xl text-gray-700 leading-relaxed mb-6">
              {currentWord.definition}
            </p>
            {currentWord.synonym && (
              <div className="mt-8 inline-block px-6 py-3 bg-emerald-50 rounded-full">
                <span className="text-sm font-semibold text-emerald-700">Synonym: </span>
                <span className="text-sm text-emerald-900">{currentWord.synonym}</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`py-3 px-6 rounded-lg font-semibold transition-all ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={togglePause}
            className="py-3 px-8 bg-white text-gray-700 hover:bg-gray-50 rounded-lg font-semibold shadow-md transition-all"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            onClick={handleNext}
            className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md transition-all"
          >
            Next →
          </button>
        </div>

        {/* Exit button */}
        <div className="mt-4 text-center">
          <Link href="/">
            <button className="text-gray-600 hover:text-gray-800 font-medium">
              Exit Learning Mode
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
