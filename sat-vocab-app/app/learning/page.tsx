'use client';

import { useState } from 'react';
import LearningSetup from '@/components/LearningSetup';
import LearningSession from '@/components/LearningSession';

export default function LearningPage() {
  const [isSetup, setIsSetup] = useState(true);
  const [wordCount, setWordCount] = useState(20);

  if (isSetup) {
    return (
      <LearningSetup
        onStart={(count) => {
          setWordCount(count);
          setIsSetup(false);
        }}
      />
    );
  }

  return <LearningSession wordCount={wordCount} />;
}
