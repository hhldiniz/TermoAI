import { GuessAttempt, LetterEvaluation, LetterStatus } from '../types';
import { normalizeText } from '../words';

/** Scores a guess against the target word, handling repeated letters like Wordle. */
export function evaluateGuess(targetWord: string, guessWord: string): LetterEvaluation[] {
  const targetLetters = normalizeText(targetWord).split('');
  const guessLetters = normalizeText(guessWord).split('');

  const evaluations: LetterEvaluation[] = targetLetters.map((_, i) => ({
    char: guessLetters[i],
    status: 'incorrect'
  }));

  // Remaining target letters available for yellow matches
  const targetCount: Record<string, number> = {};
  for (const char of targetLetters) {
    targetCount[char] = (targetCount[char] || 0) + 1;
  }

  // Pass 1: exact matches (green)
  for (let i = 0; i < targetLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      evaluations[i].status = 'correct';
      targetCount[guessLetters[i]]--;
    }
  }

  // Pass 2: letters present elsewhere (yellow)
  for (let i = 0; i < targetLetters.length; i++) {
    if (evaluations[i].status !== 'correct') {
      const char = guessLetters[i];
      if (targetCount[char] > 0) {
        evaluations[i].status = 'present';
        targetCount[char]--;
      }
    }
  }

  return evaluations;
}

export type HardModeViolation =
  | { kind: 'position'; position: number; char: string }
  | { kind: 'missing'; char: string };

/**
 * Hard mode: green letters must stay in place and every revealed letter (green or
 * yellow) must be reused as many times as it was revealed.
 */
export function checkHardMode(guess: string, lastEvaluation: LetterEvaluation[]): HardModeViolation | null {
  for (let i = 0; i < lastEvaluation.length; i++) {
    if (lastEvaluation[i].status === 'correct' && guess[i] !== lastEvaluation[i].char) {
      return { kind: 'position', position: i + 1, char: lastEvaluation[i].char };
    }
  }

  const requiredCounts: Record<string, number> = {};
  for (const evaluation of lastEvaluation) {
    if (evaluation.status === 'correct' || evaluation.status === 'present') {
      requiredCounts[evaluation.char] = (requiredCounts[evaluation.char] || 0) + 1;
    }
  }
  for (const [char, required] of Object.entries(requiredCounts)) {
    const used = guess.split('').filter(c => c === char).length;
    if (used < required) return { kind: 'missing', char };
  }
  return null;
}

const STATUS_RANK: Record<LetterStatus, number> = { empty: 0, incorrect: 1, present: 2, correct: 3 };

/** Best known status per letter across all guesses, for coloring the keyboard. */
export function getKeyStatuses(guesses: GuessAttempt[]): Record<string, LetterStatus> {
  const statuses: Record<string, LetterStatus> = {};
  for (const attempt of guesses) {
    for (const { char, status } of attempt.evaluations) {
      if (!statuses[char] || STATUS_RANK[status] > STATUS_RANK[statuses[char]]) {
        statuses[char] = status;
      }
    }
  }
  return statuses;
}

/** Maps Ç/Ñ to C/N outside the languages whose keyboards show them. */
export function sanitizeLetter(key: string, language: 'pt' | 'en' | 'es'): string {
  if (key === 'Ç' && language !== 'pt') return 'C';
  if (key === 'Ñ' && language !== 'es') return 'N';
  return key;
}

const SHARE_SQUARES = {
  normal: { correct: '🟩', present: '🟨', incorrect: '⬛', empty: '⬛' },
  highContrast: { correct: '🟧', present: '🟦', incorrect: '⬛', empty: '⬛' }
} as const;

/** Spoiler-free result grid, e.g. "3/6" followed by one row of squares per guess. */
export function buildShareGrid(guesses: GuessAttempt[], won: boolean, maxGuesses: number, highContrast: boolean) {
  const squares = SHARE_SQUARES[highContrast ? 'highContrast' : 'normal'];
  const score = `${won ? guesses.length : 'X'}/${maxGuesses}`;
  const rows = guesses.map(g => g.evaluations.map(e => squares[e.status]).join(''));
  return { score, grid: rows.join('\n') };
}
