import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { GameStatus } from '../types';
import { getRandomLargeWord, LargeWordData, normalizeText } from '../words';
import { useGame } from '../GameContext';
import { usePhysicalKeyboard } from '../hooks/usePhysicalKeyboard';
import { sanitizeLetter } from '../game/classic';
import { AnswerInput, ClueCard, HiddenWord, applyAnswerKey } from '../components/LongWord';
import Keyboard from '../components/Keyboard';

const START_SCORE = 100;
const START_TIME = 180;
const PENALTY = 15;

interface EnigmaGameProps {
  /** Incremented by the parent to start a new word */
  restartToken: number;
  onResult: (won: boolean, score: number) => void;
  onStateChange: (state: { inProgress: boolean }) => void;
}

export default function EnigmaGame({ restartToken, onResult, onStateChange }: EnigmaGameProps) {
  const { settings, t, triggerSound, announce, isAnyModalOpen } = useGame();

  const [word, setWord] = useState<LargeWordData | null>(null);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [score, setScore] = useState(START_SCORE);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [message, setMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(START_TIME);

  const startGame = useCallback(() => {
    setWord(getRandomLargeWord(settings.language));
    setRevealedLetters([]);
    setWrongGuesses([]);
    setScore(START_SCORE);
    setInput('');
    setStatus('playing');
    setMessage(null);
    setTimeLeft(START_TIME);
  }, [settings.language, t]);

  useEffect(() => {
    startGame();
  }, [restartToken]);

  // In progress once the player has acted or the clock has started eating points
  const inProgress = status === 'playing' && (timeLeft < START_TIME - 5 || revealedLetters.length > 0 || wrongGuesses.length > 0);
  useEffect(() => {
    onStateChange({ inProgress });
  }, [inProgress]);

  // Record the result once per game
  const reportedWord = useRef<LargeWordData | null>(null);
  useEffect(() => {
    if (status === 'playing' || !word || reportedWord.current === word) return;
    reportedWord.current = word;
    onResult(status === 'won', score);
  }, [status, word]);

  const submitGuess = () => {
    if (!word || status !== 'playing') return;
    const cleanGuess = normalizeText(input);
    if (!cleanGuess) return;

    if (cleanGuess === normalizeText(word.word)) {
      setStatus('won');
      triggerSound('win');
      setRevealedLetters(word.word.split(''));
      setInput('');
      setMessage(null);
      announce(t.enigma.solvedText(score));
    } else {
      triggerSound('error');
      setWrongGuesses(prev => (prev.includes(cleanGuess) ? prev : [...prev, cleanGuess]));
      setMessage(t.enigma.wrongGuess);
      announce(t.enigma.wrongGuess);
      setScore(prev => Math.max(0, prev - PENALTY));
      setInput('');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const revealLetter = () => {
    if (!word) return;
    const unrevealed = word.word.split('').filter(c => !revealedLetters.includes(c));
    if (unrevealed.length === 0) return;

    const randomChar = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setRevealedLetters(prev => [...prev, randomChar]);
    setScore(prev => Math.max(0, prev - PENALTY));
    triggerSound('flip');
    announce(t.a11y.enigmaLetterRevealed(randomChar));

    const remaining = word.word.split('').filter(c => c !== randomChar && !revealedLetters.includes(c));
    if (remaining.length === 0) {
      setStatus('won');
      triggerSound('win');
    }
  };

  // Game over when the score runs out
  useEffect(() => {
    if (status === 'playing' && score <= 0) {
      setStatus('lost');
      triggerSound('lose');
      announce(t.a11y.enigmaZeroScore(word?.word ?? ''));
    }
  }, [score, status]);

  // Countdown with progressive score loss; paused while a modal is open
  useEffect(() => {
    if (status !== 'playing' || isAnyModalOpen || !word) return;

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setStatus('lost');
          triggerSound('lose');
          announce(t.a11y.enigmaTimeout(word.word));
          return 0;
        }

        const updatedTime = prevTime - 1;
        const elapsedSeconds = START_TIME - updatedTime;

        // Lose 1 point every 3 seconds after the first 5 seconds
        if (elapsedSeconds > 5 && updatedTime % 3 === 0) {
          setScore(prevScore => {
            const nextScore = Math.max(1, prevScore - 1);
            if (nextScore === 1 && prevScore > 1) {
            }
            return nextScore;
          });
        }

        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, word, t, triggerSound, announce, isAnyModalOpen]);

  const handleKey = (key: string) => {
    if (!word || status !== 'playing') return;
    const next = applyAnswerKey(key, input, word.word.length, settings.language, sanitizeLetter);
    if (next === 'SUBMIT') submitGuess();
    else setInput(next);
  };

  usePhysicalKeyboard(handleKey, !isAnyModalOpen);

  if (!word) return null;

  // Keyboard colors: revealed letters green, letters from wrong guesses that are not in the word gray
  const keyStatuses: Record<string, 'correct' | 'incorrect'> = {};
  revealedLetters.forEach(char => { keyStatuses[char] = 'correct'; });
  wrongGuesses.forEach(guess => guess.split('').forEach(char => {
    if (!word.word.includes(char)) keyStatuses[char] = 'incorrect';
  }));

  return (
    <>
      <ClueCard category={word.category} clue={word.clue} accent="emerald" />

      <div className="flex-1 flex flex-col items-center justify-center py-2 px-4 select-none shrink animate-in zoom-in-95 duration-400">
        <HiddenWord
          word={word.word}
          revealed={word.word.split('').map(c => revealedLetters.includes(c))}
          status={status}
        />

        {/* Time and score */}
        <div className="mt-3 sm:mt-4 flex flex-col items-center w-full max-w-xs gap-1">
          <div className="flex justify-between w-full text-xs uppercase font-bold tracking-wider px-1">
            <span className="text-slate-400 font-mono">{t.enigma.time}</span>
            <span className={`font-mono font-black transition-colors duration-300 ${
              timeLeft < 30
                ? 'text-rose-500 animate-pulse text-xs sm:text-sm font-extrabold'
                : timeLeft < 60
                  ? 'text-amber-500'
                  : 'text-emerald-400'
            }`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex justify-between w-full text-xs uppercase font-bold tracking-wider mb-1 px-1">
            <span className="text-slate-400 font-mono">{t.enigma.score}</span>
            <span className={score > 40 ? 'text-emerald-400 font-black font-mono' : 'text-rose-500 font-black font-mono'}>
              {score} {t.common.points}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden border border-line">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                score > 50 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : score > 20 ? 'bg-amber-500' : 'bg-rose-600'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
            />
          </div>

          <div className="w-full flex flex-col gap-1.5 mt-3 sm:mt-4">
            {status === 'playing' ? (
              <button
                onClick={revealLetter}
                disabled={score <= PENALTY}
                className="w-full h-9 flex items-center justify-center gap-1.5 bg-surface text-xs text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-40 rounded py-2 transition-all font-black uppercase cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {t.enigma.revealLetter}
              </button>
            ) : (
              <button
                onClick={() => { triggerSound('click'); startGame(); }}
                className="w-full h-9 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded py-2 font-black uppercase text-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                {t.enigma.playAgain}
              </button>
            )}

            {message && (
              <div className="text-xs sm:text-sm py-1 px-3 rounded bg-rose-950/40 border border-rose-500/20 text-rose-400 text-center animate-shake mt-1 font-bold font-mono">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {status === 'playing' ? (
        <AnswerInput
          value={input}
          onChange={setInput}
          onSubmit={submitGuess}
          placeholder={t.enigma.placeholder}
          maxLength={word.word.length}
          accent="emerald"
        />
      ) : (
        <div className="w-full max-w-sm px-4 mb-2 text-center mx-auto animate-in zoom-in-95 duration-200">
          <div className={`p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm font-bold ${
            status === 'won' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            {status === 'won' ? (
              <div>
                <span className="block text-[11px] uppercase tracking-widest text-emerald-400 font-extrabold mb-1 font-mono">🎉 {t.enigma.solvedTitle}</span>
                {t.enigma.solvedText(score)}
              </div>
            ) : (
              <div>
                <span className="block text-[11px] uppercase tracking-widest text-rose-400 font-extrabold mb-1 font-mono">💥 {t.enigma.lostTitle}</span>
                {t.enigma.lostText(word.word)}
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
