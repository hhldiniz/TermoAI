export type GameStatus = 'playing' | 'won' | 'lost';

export type GameMode = 'menu' | 'standard' | 'enigma' | 'survival';

export type SoundType = 'click' | 'flip' | 'win' | 'lose' | 'error';

export type LetterStatus = 'empty' | 'incorrect' | 'present' | 'correct';

export interface LetterEvaluation {
  char: string;
  status: LetterStatus;
}

export interface GuessAttempt {
  word: string;
  evaluations: LetterEvaluation[];
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
  enigma: { played: number; won: number; bestScore: number };
  survival: { played: number; bestStreak: number };
}

export type WordLength = 4 | 5 | 6;

export interface GameSettings {
  language: 'pt' | 'en' | 'es';
  soundEnabled: boolean;
  hardMode: boolean;
  autoRevealClue: boolean;
  wordLength: WordLength; // Classic mode word length
  category: string; // Classic mode category filter ('all' for any)
  highContrast: boolean; // Color-blind friendly palette (orange/blue)
}
