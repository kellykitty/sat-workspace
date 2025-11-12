'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuizSetupProps {
  onStart: (count: number) => void;
}

export default function QuizSetup({ onStart }: QuizSetupProps) {
  const [count, setCount] = useState(20);

  const presetCounts = [10, 20, 30, 50];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Choose Number of Questions
        </h2>

        <div className="space-y-6">
          {/* Preset buttons */}
          <div className="grid grid-cols-2 gap-3">
            {presetCounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setCount(preset)}
                className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                  count === preset
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset} Questions
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter custom amount:
            </label>
            <input
              type="number"
              min="1"
              max="1796"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(1796, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Start button */}
          <button
            onClick={() => onStart(count)}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-lg"
          >
            Start Practice
          </button>

          {/* Back button */}
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
