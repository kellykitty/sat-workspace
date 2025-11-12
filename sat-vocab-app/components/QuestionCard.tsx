'use client';

import { Question, QuestionType } from '@/types';

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  showFeedback: boolean;
  onAnswer: (optionId: number) => void;
}

export default function QuestionCard({
  question,
  selectedOption,
  showFeedback,
  onAnswer,
}: QuestionCardProps) {
  const getOptionStyle = (optionId: number) => {
    if (!showFeedback) {
      return 'bg-white hover:bg-gray-50 border-gray-300 hover:border-indigo-400';
    }

    // Show feedback
    if (optionId === question.correctOptionId) {
      return 'bg-green-50 border-green-500 border-2';
    }

    if (optionId === selectedOption && optionId !== question.correctOptionId) {
      return 'bg-red-50 border-red-500 border-2';
    }

    return 'bg-gray-50 border-gray-200 opacity-50';
  };

  const getOptionIcon = (optionId: number) => {
    if (!showFeedback) return null;

    if (optionId === question.correctOptionId) {
      return (
        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (optionId === selectedOption && optionId !== question.correctOptionId) {
      return (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return null;
  };

  const questionText =
    question.type === QuestionType.DEFINITION_TO_WORD
      ? question.word.definition
      : question.word.word;

  const questionLabel =
    question.type === QuestionType.DEFINITION_TO_WORD
      ? 'Which word matches this definition?'
      : 'What is the definition of this word?';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Question prompt */}
      <div className="mb-8">
        <div className="text-sm font-medium text-gray-600 mb-3">{questionLabel}</div>
        <div className="text-3xl font-bold text-gray-900">{questionText}</div>
        {question.type === QuestionType.WORD_TO_DEFINITION && (
          <div className="text-sm text-gray-500 mt-2 italic">
            Synonym: {question.word.synonym}
          </div>
        )}
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => !showFeedback && onAnswer(option.id)}
            disabled={showFeedback}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center justify-between ${getOptionStyle(
              option.id
            )} ${!showFeedback ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <span className="font-medium text-gray-900">{option.text}</span>
            {getOptionIcon(option.id)}
          </button>
        ))}
      </div>

      {/* Feedback message */}
      {showFeedback && (
        <div className={`mt-6 p-4 rounded-lg ${
          selectedOption === question.correctOptionId
            ? 'bg-green-100 border border-green-300'
            : 'bg-red-100 border border-red-300'
        }`}>
          {selectedOption === question.correctOptionId ? (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold text-green-900">Correct!</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-red-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-red-900">Incorrect</span>
              </div>
              <div className="text-sm text-red-800">
                <span className="font-medium">{question.word.word}:</span> {question.word.definition}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
