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

export type WordLength = 4 | 5 | 6;

export interface GameSettings {
  language: 'pt' | 'en' | 'es';
  soundEnabled: boolean;
  hardMode: boolean;
  autoRevealClue: boolean;
  wordLength: WordLength; // Classic mode word length
  category: string; // Classic mode category filter ('all' for any)
  showConsole: boolean; // Optional engine log console
}
