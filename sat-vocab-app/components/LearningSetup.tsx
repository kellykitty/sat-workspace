'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LearningSetupProps {
  onStart: (count: number) => void;
}

export default function LearningSetup({ onStart }: LearningSetupProps) {
  const [count, setCount] = useState(20);

  const presetCounts = [10, 20, 30, 50];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Choose Number of Words to Learn
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Words will be shown one at a time for 5 seconds each
        </p>

        <div className="space-y-6">
          {/* Preset buttons */}
          <div className="grid grid-cols-2 gap-3">
            {presetCounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setCount(preset)}
                className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                  count === preset
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset} Words
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Start button */}
          <button
            onClick={() => onStart(count)}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-lg"
          >
            Start Learning
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
