export interface Word {
  id: number;
  word: string;
  definition: string;
  synonym: string;
}

export interface UserPerformance {
  [wordId: number]: {
    correct: number;
    incorrect: number;
  };
}

export interface QuestionOption {
  id: number;
  text: string;
}

export interface Question {
  word: Word;
  options: QuestionOption[];
  correctOptionId: number;
  type: QuestionType;
}

export enum QuestionType {
  DEFINITION_TO_WORD = 'definition_to_word',
  WORD_TO_DEFINITION = 'word_to_definition',
}

export enum StudyMode {
  TIMED = 'timed',
  WORD_COUNT = 'word_count',
  LEARNING = 'learning',
}

export interface QuizSession {
  mode: StudyMode;
  questionType: QuestionType;
  totalQuestions?: number; // For word count mode
  duration?: number; // For timed mode in seconds
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  startTime: number;
  endTime?: number;
}

export interface Answer {
  questionId: number;
  wordId: number;
  selectedOptionId: number;
  correctOptionId: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface SessionSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  missedWords: Word[];
  duration: number; // in seconds
}

export interface GlobalWordStats {
  [wordId: number]: {
    correct: number;
    incorrect: number;
    totalAttempts: number;
    difficultyScore: number; // 0-1, higher = more difficult
  };
}

export interface AnswerSubmission {
  wordId: number;
  isCorrect: boolean;
}
