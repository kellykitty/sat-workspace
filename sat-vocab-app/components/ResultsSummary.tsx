'use client';

import Link from 'next/link';
import { Answer } from '@/types';
import wordsData from '@/data/words.json';

interface ResultsSummaryProps {
  answers: Answer[];
  duration: number;
}

export default function ResultsSummary({ answers, duration }: ResultsSummaryProps) {
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Get missed words
  const missedWordIds = answers.filter((a) => !a.isCorrect).map((a) => a.wordId);
  const missedWords = wordsData.filter((w) => missedWordIds.includes(w.id));

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Session Complete!</h1>
          <p className="text-xl text-gray-600">Great work on completing your practice session</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600">{totalQuestions}</div>
            <div className="text-sm text-gray-600 mt-1">Total Questions</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
            <div className="text-sm text-gray-600 mt-1">Correct</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{incorrectAnswers}</div>
            <div className="text-sm text-gray-600 mt-1">Incorrect</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-gray-600 mt-1">Accuracy</div>
          </div>
        </div>

        {/* Performance Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Performance Details</h2>
            <div className="text-gray-600">Duration: {formatDuration(duration)}</div>
          </div>

          {/* Accuracy bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Accuracy</span>
              <span>{accuracy}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  accuracy >= 80 ? 'bg-green-500' : accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          {/* Performance message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            {accuracy >= 90 && (
              <p className="text-blue-900">
                Excellent work! You're mastering these words. Keep up the great studying!
              </p>
            )}
            {accuracy >= 70 && accuracy < 90 && (
              <p className="text-blue-900">
                Good job! You're making solid progress. Review the missed words below to improve further.
              </p>
            )}
            {accuracy >= 50 && accuracy < 70 && (
              <p className="text-blue-900">
                You're on the right track! Focus on the words you missed and try another practice session.
              </p>
            )}
            {accuracy < 50 && (
              <p className="text-blue-900">
                Keep practicing! Review the missed words carefully and try again. Consistent practice leads to improvement.
              </p>
            )}
          </div>
        </div>

        {/* Missed Words */}
        {missedWords.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Words to Review ({missedWords.length})
            </h2>
            <p className="text-gray-600 mb-6">
              These words will appear more frequently in your next practice session.
            </p>
            <div className="space-y-4">
              {missedWords.map((word) => (
                <div
                  key={word.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{word.word}</h3>
                    <span className="text-sm text-gray-500 italic">{word.synonym}</span>
                  </div>
                  <p className="text-gray-700">{word.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {missedWords.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect Score!</h2>
            <p className="text-gray-600">You got every question correct. Outstanding work!</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <button className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">
              Back to Home
            </button>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-4 px-6 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-lg border-2 border-indigo-600 transition-colors"
          >
            Practice Again
          </button>
        </div>
      </div>
    </div>
  );
}
