'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { QuestionType, StudyMode } from '@/types';
import QuizSetup from '@/components/QuizSetup';
import QuizSession from '@/components/QuizSession';

function QuizContent() {
  const searchParams = useSearchParams();
  const [isSetup, setIsSetup] = useState(true);
  const [questionCount, setQuestionCount] = useState(20);

  const mode = searchParams.get('mode') as StudyMode;
  const type = searchParams.get('type') as QuestionType;

  // For timed mode, skip setup
  useEffect(() => {
    if (mode === StudyMode.TIMED) {
      setIsSetup(false);
    }
  }, [mode]);

  if (isSetup && mode === StudyMode.WORD_COUNT) {
    return (
      <QuizSetup
        onStart={(count) => {
          setQuestionCount(count);
          setIsSetup(false);
        }}
      />
    );
  }

  return (
    <QuizSession
      mode={mode}
      questionType={type}
      questionCount={mode === StudyMode.WORD_COUNT ? questionCount : undefined}
    />
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-xl font-semibold">Loading...</div>
    </div>}>
      <QuizContent />
    </Suspense>
  );
}
