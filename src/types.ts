export type GameStatus = 'playing' | 'won' | 'lost';

export type LetterStatus = 'empty' | 'incorrect' | 'present' | 'correct';

export interface LetterEvaluation {
  char: string;
  status: LetterStatus;
}

export interface GuessAttempt {
  word: string;
  evaluations: LetterEvaluation[];
}

export interface LLMConfig {
  modelName: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LLMLog {
  timestamp: string;
  type: 'system' | 'info' | 'success' | 'warning' | 'token';
  message: string;
}

export interface WordData {
  word: string; // Must be 5 letters, uppercase
  category: string;
  clue: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  explanation: string; // Local LLM verbose reasoning explanation
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessesDistribution: number[]; // Index 0 represents 1 guess, 1 for 2, etc. (size 6)
  lastPlayedDate?: string;
}

export interface GameSettings {
  language: 'pt' | 'en';
  soundEnabled: boolean;
  hardMode: boolean;
  autoRevealClue: boolean;
}
