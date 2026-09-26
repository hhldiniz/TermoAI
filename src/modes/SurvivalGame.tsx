import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, Trophy } from 'lucide-react';
import { GameStatus } from '../types';
import { getRandomLargeWord, LargeWordData, normalizeText } from '../words';
import { useGame } from '../GameContext';
import { usePhysicalKeyboard } from '../hooks/usePhysicalKeyboard';
import { sanitizeLetter } from '../game/classic';
import { AnswerInput, ClueCard, HiddenWord, applyAnswerKey } from '../components/LongWord';
import Keyboard from '../components/Keyboard';

const START_LIVES = 3;
const TRIES_PER_WORD = 3;
const TRANSITION_MS = 2500;

type BurstParticle = {
  icon: 'sparkle' | 'fire';
  className: string;
  iconClass?: string;
  style: React.CSSProperties;
};

/** Particles that fly out of the streak badge on each solved word (see .animate-burst) */
const BURST_PARTICLES: BurstParticle[] = [
  { icon: 'sparkle', className: 'text-orange-400', iconClass: 'w-3.5 h-3.5 fill-orange-400 text-orange-400',
    style: { '--dx': '-22px', '--dy': '-18px', '--rot': '45deg' } as React.CSSProperties },
  { icon: 'sparkle', className: 'text-yellow-400', iconClass: 'w-3 h-3 fill-yellow-400 text-yellow-400',
    style: { '--dx': '22px', '--dy': '-18px', '--rot': '-45deg', '--burst-delay': '0.08s' } as React.CSSProperties },
  { icon: 'fire', className: 'text-red-500 text-xs select-none',
    style: { '--dx': '-4px', '--dy': '-26px', '--y0': '5px', '--s0': '0.2', '--s1': '1.5', '--burst-duration': '0.9s', '--burst-delay': '0.04s' } as React.CSSProperties },
  { icon: 'fire', className: 'text-orange-500 text-xs select-none',
    style: { '--dx': '6px', '--dy': '-26px', '--y0': '5px', '--s0': '0.2', '--s1': '1.5', '--burst-duration': '0.9s', '--burst-delay': '0.12s' } as React.CSSProperties },
];

interface SurvivalGameProps {
  /** Incremented by the parent to start a new run */
  restartToken: number;
  /** Called when a run ends, with the number of words solved */
  onRunEnd: (streak: number) => void;
  onStateChange: (state: { inProgress: boolean }) => void;
}

export default function SurvivalGame({ restartToken, onRunEnd, onStateChange }: SurvivalGameProps) {
  const { settings, t, triggerSound, announce, isAnyModalOpen } = useGame();

  const [word, setWord] = useState<LargeWordData | null>(null);
  // Positions shown after wrong tries (letters the player already placed correctly)
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [triesLeft, setTriesLeft] = useState(TRIES_PER_WORD);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [lives, setLives] = useState(START_LIVES);
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [message, setMessage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadNextWord = useCallback((isFresh: boolean) => {
    const nextWord = getRandomLargeWord(settings.language);
    setWord(nextWord);
    setRevealed(nextWord.word.split('').map(() => false));
    setTriesLeft(TRIES_PER_WORD);
    setWrongGuesses([]);
    setInput('');
    setStatus('playing');
    setMessage(null);
    setIsTransitioning(false);
  }, [settings.language, t]);

  const startRun = useCallback(() => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setStreak(0);
    setLives(START_LIVES);
    loadNextWord(true);
  }, [loadNextWord]);

  useEffect(() => {
    startRun();
  }, [restartToken]);

  // Clear a pending word transition when leaving the mode
  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  const inProgress = status !== 'lost' && (streak > 0 || lives < START_LIVES || triesLeft < TRIES_PER_WORD);
  useEffect(() => {
    onStateChange({ inProgress });
  }, [inProgress]);

  const scheduleNextWord = () => {
    setIsTransitioning(true);
    transitionTimer.current = setTimeout(() => loadNextWord(false), TRANSITION_MS);
  };

  const submitGuess = () => {
    if (!word || status !== 'playing' || isTransitioning) return;
    const cleanGuess = normalizeText(input);
    if (!cleanGuess) return;

    if (cleanGuess === normalizeText(word.word)) {
      const nextStreak = streak + 1;
      setStatus('won');
      triggerSound('win');
      setRevealed(word.word.split('').map(() => true));
      setInput('');
      setMessage(null);
      setStreak(nextStreak);
      announce(t.a11y.survivalCorrect(nextStreak));
      scheduleNextWord();
      return;
    }

    triggerSound('error');
    setWrongGuesses(prev => (prev.includes(cleanGuess) ? prev : [...prev, cleanGuess]));
    setInput('');

    // Reveal letters the player placed correctly
    const target = normalizeText(word.word);
    setRevealed(prev => prev.map((shown, i) => shown || cleanGuess[i] === target[i]));

    const nextTries = triesLeft - 1;
    if (nextTries > 0) {
      setTriesLeft(nextTries);
      setMessage(t.survival.wrongAttempt(nextTries));
      announce(t.survival.wrongAttempt(nextTries));
      return;
    }

    // Out of tries for this word: lose a life
    setTriesLeft(0);
    const nextLives = Math.max(0, lives - 1);
    setLives(nextLives);

    if (nextLives === 0) {
      setStatus('lost');
      triggerSound('lose');
      setMessage(t.survival.gameOverMessage(word.word));
      announce(t.survival.lostText(streak, word.word));
      onRunEnd(streak);
    } else {
      setMessage(t.survival.wrongGuess(nextLives));
      announce(t.survival.wrongGuess(nextLives));
      scheduleNextWord();
    }
  };

  const handleKey = (key: string) => {
    if (!word || status !== 'playing' || isTransitioning) return;
    const next = applyAnswerKey(key, input, word.word.length, settings.language, sanitizeLetter);
    if (next === 'SUBMIT') submitGuess();
    else setInput(next);
  };

  usePhysicalKeyboard(handleKey, !isAnyModalOpen);

  if (!word) return null;

  const keyStatuses: Record<string, 'correct' | 'incorrect'> = {};
  const normalizedWord = normalizeText(word.word);
  revealed.forEach((shown, i) => { if (shown) keyStatuses[normalizedWord[i]] = 'correct'; });
  wrongGuesses.forEach(guess => guess.split('').forEach(char => {
    if (!normalizedWord.includes(char)) keyStatuses[char] = 'incorrect';
  }));

  const streakBadge = (
    <span
      key={streak}
      className={`text-[11px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider font-mono flex items-center gap-1 relative overflow-visible ${streak > 0 ? 'animate-streak-pop' : ''}`}
    >
      <Trophy className={`w-3 h-3 transition-colors duration-300 ${streak >= 3 ? 'text-amber-400' : 'text-rose-400'}`} />
      <span>{t.survival.solvedCount(streak)}</span>
      {streak >= 3 && (
        <span className="text-xs select-none text-orange-500 ml-0.5 inline-block animate-fire-pulse">
          🔥
        </span>
      )}
      {/* Burst on each correct answer */}
      {status === 'won' && (
        <span className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {BURST_PARTICLES.map((p, i) => (
            <span key={i} className={`absolute animate-burst ${p.className}`} style={p.style}>
              {p.icon === 'sparkle' ? <Sparkles className={p.iconClass} /> : '🔥'}
            </span>
          ))}
        </span>
      )}
    </span>
  );

  return (
    <>
      <ClueCard category={word.category} clue={word.clue} accent="rose" badge={streakBadge} />

      <div className="flex-1 flex flex-col items-center justify-center py-2 px-4 select-none shrink animate-in zoom-in-95 duration-400">
        <div className="flex gap-2 items-center mb-4 select-none">
          {Array.from({ length: START_LIVES }).map((_, idx) => (
            <Heart
              key={idx}
              className={`w-6 h-6 transition-all duration-300 ${
                idx < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-zinc-700 fill-zinc-800 scale-90 opacity-40'
              }`}
            />
          ))}
        </div>

        <HiddenWord word={word.word} revealed={revealed} status={status} />

        {status === 'playing' && !isTransitioning && (
          <div className="mt-2 text-xs font-bold uppercase tracking-widest font-mono text-rose-400" aria-live="off">
            {t.survival.tries} {triesLeft}/{TRIES_PER_WORD}
          </div>
        )}

        <div className="w-full flex flex-col gap-1.5 mt-3 sm:mt-4 max-w-xs mx-auto">
          {isTransitioning && (
            <div className="w-full mt-1 mb-2">
              <div className="flex justify-between items-center text-[11px] font-mono font-extrabold text-rose-500 mb-1 tracking-widest uppercase">
                <span>{t.survival.nextWordIn}</span>
                <span className="inline-block text-sm animate-spin-slow">⏳</span>
              </div>
              <div className="w-full h-2.5 bg-surface border border-line rounded-full overflow-hidden relative">
                <div
                  style={{ '--countdown-ms': `${TRANSITION_MS}ms` } as React.CSSProperties}
                  className="animate-countdown h-full bg-gradient-to-r from-rose-500 via-orange-500 to-yellow-400 rounded-full"
                />
              </div>
            </div>
          )}

          {message && (
            <div className="text-xs sm:text-sm py-1.5 px-3 rounded bg-rose-950/40 border border-rose-500/20 text-rose-400 text-center animate-shake mt-1 font-bold font-mono">
              {message}
            </div>
          )}
        </div>
      </div>

      {status === 'playing' ? (
        <AnswerInput
          value={input}
          onChange={setInput}
          onSubmit={submitGuess}
          placeholder={t.survival.placeholder}
          maxLength={word.word.length}
          accent="rose"
        />
      ) : (
        <div className="w-full max-w-sm px-4 mb-2 text-center mx-auto animate-in zoom-in-95 duration-200">
          <div className={`p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm font-bold ${
            status === 'won' ? 'bg-hint border-emerald-500 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            {status === 'won' ? (
              <div>
                <span className="block text-[11px] uppercase tracking-widest text-emerald-400 font-extrabold mb-1 font-mono">🎉 {t.survival.correctTitle}</span>
                {t.survival.loadingNext}
              </div>
            ) : (
              <div>
                <span className="block text-[11px] uppercase tracking-widest text-rose-400 font-extrabold mb-1 font-mono">☠️ {t.survival.lostTitle}</span>
                {t.survival.lostText(streak, word.word)}
                <button
                  onClick={() => { triggerSound('click'); startRun(); }}
                  className="mt-2.5 w-full py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded font-black uppercase text-[11px] sm:text-xs transition-colors cursor-pointer block text-center"
                >
                  {t.survival.tryAgain}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Keyboard
        onKeyPress={handleKey}
        letterStatuses={keyStatuses}
        language={settings.language}
        triggerSound={triggerSound}
      />
    </>
  );
}
