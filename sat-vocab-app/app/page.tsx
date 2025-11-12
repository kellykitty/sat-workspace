import Link from "next/link";
import GlobalStats from "@/components/GlobalStats";
import AuthHeader from "@/components/AuthHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Auth Header */}
          <div className="flex justify-end mb-8">
            <AuthHeader />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              SAT Vocabulary Practice
            </h1>
            <p className="text-xl text-gray-600">
              Master 1,796 high-frequency SAT words with adaptive learning
            </p>
          </div>

          {/* Study Mode Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Learning Mode Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Mode</h2>
                <p className="text-gray-600 mb-6">
                  Study words in a slideshow format. Each word shown for 5 seconds with its definition.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/learning">
                  <button className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
                    Start Learning
                  </button>
                </Link>
              </div>
            </div>

            {/* Timed Mode Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Timed Practice</h2>
                <p className="text-gray-600 mb-6">
                  5-minute quick review session. Answer as many questions as you can within the time limit.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/quiz?mode=timed&type=definition_to_word">
                  <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    Definition → Word
                  </button>
                </Link>
                <Link href="/quiz?mode=timed&type=word_to_definition">
                  <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    Word → Definition
                  </button>
                </Link>
              </div>
            </div>

            {/* Word Count Mode Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Word Count Practice</h2>
                <p className="text-gray-600 mb-6">
                  Choose a specific number of questions to complete at your own pace.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/quiz?mode=word_count&type=definition_to_word">
                  <button className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
                    Definition → Word
                  </button>
                </Link>
                <Link href="/quiz?mode=word_count&type=word_to_definition">
                  <button className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
                    Word → Definition
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Features</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-900 mb-1">Adaptive Learning</h4>
                <p className="text-sm text-gray-600">Words you miss appear more frequently</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-900 mb-1">Track Progress</h4>
                <p className="text-sm text-gray-600">Monitor your accuracy for each word</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💾</div>
                <h4 className="font-semibold text-gray-900 mb-1">No Login Required</h4>
                <p className="text-sm text-gray-600">All data stored locally in your browser</p>
              </div>
            </div>
          </div>

          {/* Global Statistics */}
          <GlobalStats />
        </div>
      </div>
    </div>
  );
}
