import { describe, expect, it } from 'vitest';
import { buildShareGrid, checkHardMode, evaluateGuess, getKeyStatuses, sanitizeLetter } from './classic';

const statuses = (target: string, guess: string) => evaluateGuess(target, guess).map(e => e.status);

describe('evaluateGuess', () => {
  it('marks exact, misplaced and absent letters', () => {
    expect(statuses('CRANE', 'CARTS')).toEqual(['correct', 'present', 'present', 'incorrect', 'incorrect']);
  });

  it('scores every letter of 4- and 6-letter words', () => {
    expect(statuses('CASA', 'CASA')).toEqual(['correct', 'correct', 'correct', 'correct']);
    expect(statuses('BRIDGE', 'BRIDGE')).toHaveLength(6);
    expect(statuses('BRIDGE', 'BRIDGE').every(s => s === 'correct')).toBe(true);
  });

  it('does not over-count repeated letters', () => {
    // Only one E in the target: the green E uses it, the other E is absent
    expect(statuses('APPLE', 'EERIE')).toEqual(['incorrect', 'incorrect', 'incorrect', 'incorrect', 'correct']);
    // One L in the target, guess has two: first L is yellow, second gray
    expect(statuses('WORLD', 'LLAMA')).toEqual(['present', 'incorrect', 'incorrect', 'incorrect', 'incorrect']);
  });

  it('ignores accents and cedilla', () => {
    expect(statuses('LIMÃO', 'LIMAO').every(s => s === 'correct')).toBe(true);
    expect(statuses('AÇÚCAR', 'ACUCAR').every(s => s === 'correct')).toBe(true);
  });
});

describe('checkHardMode', () => {
  const last = evaluateGuess('CRANE', 'CARTS'); // C green, A and R yellow

  it('requires green letters to stay in place', () => {
    expect(checkHardMode('BRAKE', last)).toEqual({ kind: 'position', position: 1, char: 'C' });
  });

  it('requires yellow letters to be reused', () => {
    expect(checkHardMode('CABLE', last)).toEqual({ kind: 'missing', char: 'R' });
  });

  it('accepts guesses that use every revealed letter', () => {
    expect(checkHardMode('CRAMP', last)).toBeNull();
  });
});

describe('getKeyStatuses', () => {
  it('keeps the best status seen for each letter', () => {
    const guesses = [
      { word: 'CARTS', evaluations: evaluateGuess('CRANE', 'CARTS') },
      { word: 'CRAMP', evaluations: evaluateGuess('CRANE', 'CRAMP') }
    ];
    const keys = getKeyStatuses(guesses);
    expect(keys.R).toBe('correct'); // yellow first, then green
    expect(keys.T).toBe('incorrect');
    expect(keys.C).toBe('correct');
  });
});

describe('sanitizeLetter', () => {
  it('only keeps Ç in Portuguese and Ñ in Spanish', () => {
    expect(sanitizeLetter('Ç', 'pt')).toBe('Ç');
    expect(sanitizeLetter('Ç', 'en')).toBe('C');
    expect(sanitizeLetter('Ñ', 'es')).toBe('Ñ');
    expect(sanitizeLetter('Ñ', 'pt')).toBe('N');
    expect(sanitizeLetter('A', 'en')).toBe('A');
  });
});

describe('buildShareGrid', () => {
  const guesses = [
    { word: 'CARTS', evaluations: evaluateGuess('CRANE', 'CARTS') },
    { word: 'CRANE', evaluations: evaluateGuess('CRANE', 'CRANE') }
  ];

  it('builds a score and one row of squares per guess', () => {
    expect(buildShareGrid(guesses, true, 6, false)).toEqual({ score: '2/6', grid: '🟩🟨🟨⬛⬛\n🟩🟩🟩🟩🟩' });
  });

  it('uses X for a loss and orange/blue in color-blind mode', () => {
    expect(buildShareGrid(guesses.slice(0, 1), false, 6, true)).toEqual({ score: 'X/6', grid: '🟧🟦🟦⬛⬛' });
  });
});
