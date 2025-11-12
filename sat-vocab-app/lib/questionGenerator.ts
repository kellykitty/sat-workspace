import { Word, Question, QuestionType, QuestionOption, GlobalWordStats } from '@/types';
import { storage } from './storage';

export class QuestionGenerator {
  private words: Word[];
  private globalStats: GlobalWordStats;
  private userPerformance: Record<number, { correct: number; incorrect: number }> | null = null;

  constructor(words: Word[], globalStats: GlobalWordStats = {}) {
    this.words = words;
    this.globalStats = globalStats;
  }

  // Update global stats (useful when fetched from API)
  setGlobalStats(stats: GlobalWordStats) {
    this.globalStats = stats;
  }

  // Set user-specific performance (for authenticated users)
  setUserPerformance(performance: Record<number, { correct: number; incorrect: number }>) {
    this.userPerformance = performance;
  }

  // Generate a single question
  generateQuestion(type: QuestionType): Question {
    const word = this.selectWeightedWord();
    const options = this.generateOptions(word, type);

    return {
      word,
      options,
      correctOptionId: options.find(opt => opt.id === word.id)!.id,
      type,
    };
  }

  // Generate multiple questions
  generateQuestions(count: number, type: QuestionType): Question[] {
    const questions: Question[] = [];
    for (let i = 0; i < count; i++) {
      questions.push(this.generateQuestion(type));
    }
    return questions;
  }

  // Select a word based on weighted probabilities
  private selectWeightedWord(): Word {
    // Use user-specific performance if available (authenticated), otherwise use localStorage
    const performance = this.userPerformance !== null ? this.userPerformance : storage.getPerformance();
    const weights: number[] = [];

    // Calculate weight for each word
    this.words.forEach(word => {
      const wordPerf = performance[word.id];
      let localWeight = 1; // Base weight

      // Add local (personal) performance weight
      if (wordPerf) {
        const total = wordPerf.correct + wordPerf.incorrect;
        if (total > 0) {
          const incorrectRate = wordPerf.incorrect / total;
          // Increase weight based on incorrect rate
          // Words with higher incorrect rate appear more frequently
          localWeight += incorrectRate * 5; // Multiplier can be adjusted
        }
      }

      // Add global difficulty weight
      let globalWeight = 1;
      const globalStat = this.globalStats[word.id];
      if (globalStat && globalStat.totalAttempts >= 5) {
        // Only use global stats if there's enough data (5+ attempts)
        // difficultyScore is 0-1, where higher = more difficult
        globalWeight = 1 + (globalStat.difficultyScore * 3);
      }

      // Combined weight: multiply local and global weights
      // This means words that are difficult both personally AND globally
      // will appear most frequently
      const combinedWeight = localWeight * globalWeight;

      weights.push(combinedWeight);
    });

    // Weighted random selection
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < this.words.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return this.words[i];
      }
    }

    // Fallback (should rarely happen)
    return this.words[this.words.length - 1];
  }

  // Generate 4 options for a question
  private generateOptions(correctWord: Word, type: QuestionType): QuestionOption[] {
    // Get 3 random distractors
    const distractors = this.getRandomDistractors(correctWord, 3);
    const allWords = [correctWord, ...distractors];

    // Shuffle the options
    const shuffled = this.shuffleArray(allWords);

    // Create options based on question type
    return shuffled.map(word => ({
      id: word.id,
      text: type === QuestionType.DEFINITION_TO_WORD ? word.word : word.definition,
    }));
  }

  // Get random words that are not the correct word
  private getRandomDistractors(correctWord: Word, count: number): Word[] {
    const available = this.words.filter(w => w.id !== correctWord.id);
    const shuffled = this.shuffleArray(available);
    return shuffled.slice(0, count);
  }

  // Fisher-Yates shuffle algorithm
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
