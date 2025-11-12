'use client';

import { useState, useEffect } from 'react';
import { QuestionType, StudyMode, Question, Answer, GlobalWordStats, AnswerSubmission } from '@/types';
import { QuestionGenerator } from '@/lib/questionGenerator';
import { storage } from '@/lib/storage';
import { soundPlayer } from '@/lib/sounds';
import wordsData from '@/data/words.json';
import QuestionCard from './QuestionCard';
import ResultsSummary from './ResultsSummary';

interface QuizSessionProps {
  mode: StudyMode;
  questionType: QuestionType;
  questionCount?: number;
}

export default function QuizSession({ mode, questionType, questionCount }: QuizSessionProps) {
  const [generator] = useState(() => new QuestionGenerator(wordsData));
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(mode === StudyMode.TIMED ? 300 : null); // 5 minutes = 300 seconds
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());
  const [globalStatsLoaded, setGlobalStatsLoaded] = useState(false);

  // Fetch global stats and user performance on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch global stats
        const globalResponse = await fetch('/api/stats/global');
        const globalData = await globalResponse.json();
        if (globalData.success) {
          generator.setGlobalStats(globalData.stats);
        }

        // Try to fetch user-specific performance (for authenticated users)
        try {
          const userPerformance = await storage.getPerformanceFromAPI();
          if (Object.keys(userPerformance).length > 0) {
            // User is authenticated, use their data
            generator.setUserPerformance(userPerformance);
          }
        } catch (error) {
          // Not authenticated or error - will use localStorage
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setGlobalStatsLoaded(true);
      }
    }

    fetchData();
  }, [generator]);

  // Generate first question after global stats are loaded
  useEffect(() => {
    if (globalStatsLoaded) {
      setCurrentQuestion(generator.generateQuestion(questionType));
    }
  }, [generator, questionType, globalStatsLoaded]);

  // Timer for timed mode
  useEffect(() => {
    if (mode !== StudyMode.TIMED || isFinished || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      setIsFinished(true);
      // Submit all answers to backend when time runs out
      submitAnswersToBackend(answers);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isFinished, timeRemaining, answers]);

  // Submit answers to backend
  const submitAnswersToBackend = async (answersList: Answer[]) => {
    try {
      const submissions: AnswerSubmission[] = answersList.map(answer => ({
        wordId: answer.wordId,
        isCorrect: answer.isCorrect
      }));

      await fetch('/api/stats/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissions),
      });
    } catch (error) {
      console.error('Failed to submit answers to backend:', error);
      // Don't block the user from seeing results if submission fails
    }
  };

  const handleAnswer = (optionId: number) => {
    if (!currentQuestion || showFeedback) return;

    setSelectedOption(optionId);
    setShowFeedback(true);

    const isCorrect = optionId === currentQuestion.correctOptionId;

    // Play sound effect
    if (isCorrect) {
      soundPlayer.playCorrect();
    } else {
      soundPlayer.playIncorrect();
    }

    // Record answer
    const answer: Answer = {
      questionId: currentQuestion.word.id,
      wordId: currentQuestion.word.id,
      selectedOptionId: optionId,
      correctOptionId: currentQuestion.correctOptionId,
      isCorrect,
      timestamp: Date.now(),
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    storage.updateWordPerformance(currentQuestion.word.id, isCorrect);
    setQuestionsAnswered(questionsAnswered + 1);

    // Auto-advance after showing feedback
    setTimeout(() => {
      // Check if quiz should end
      if (mode === StudyMode.WORD_COUNT && questionCount && questionsAnswered + 1 >= questionCount) {
        setIsFinished(true);
        // Submit all answers to backend when quiz ends
        submitAnswersToBackend(updatedAnswers);
      } else {
        setCurrentQuestion(generator.generateQuestion(questionType));
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, 1500);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    return <ResultsSummary answers={answers} duration={duration} />;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Header with stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Questions Answered</div>
              <div className="text-2xl font-bold text-gray-900">
                {questionsAnswered}
                {mode === StudyMode.WORD_COUNT && questionCount && ` / ${questionCount}`}
              </div>
            </div>
            {mode === StudyMode.TIMED && timeRemaining !== null && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Time Remaining</div>
                <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
            {mode === StudyMode.WORD_COUNT && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-2xl font-bold text-gray-900">
                  {questionCount && Math.round((questionsAnswered / questionCount) * 100)}%
                </div>
              </div>
            )}
          </div>

          {/* Progress bar for word count mode */}
          {mode === StudyMode.WORD_COUNT && questionCount && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(questionsAnswered / questionCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          selectedOption={selectedOption}
          showFeedback={showFeedback}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
