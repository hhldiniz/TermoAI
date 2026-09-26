import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, BarChart3, Cpu, Share2 } from 'lucide-react';
import { GameStatus, GuessAttempt, WordData } from '../types';
import { generateWordOffline, normalizeText } from '../words';
import { isKnownWord } from '../dictionary';
import { useGame } from '../GameContext';
import { usePhysicalKeyboard } from '../hooks/usePhysicalKeyboard';
import { buildShareGrid, checkHardMode, evaluateGuess, getKeyStatuses, sanitizeLetter } from '../game/classic';
import GameBoard from '../components/GameBoard';
import Keyboard from '../components/Keyboard';

export const MAX_GUESSES = 6;

const SAVE_KEY = 'termo_classic_game';

interface SavedGame {
  language: string;
  word: WordData;
  guesses: GuessAttempt[];
  status: GameStatus;
  hintRevealed: boolean;
}

// Restores the last Classic game (in progress or finished) for this language
function loadSavedGame(language: string): SavedGame | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const saved: SavedGame = JSON.parse(raw);
    if (saved.language !== language || !saved.word?.word || !Array.isArray(saved.guesses)) return null;
    return saved;
  } catch {
    return null;
  }
}

interface ClassicGameProps {
  /** Incremented by the parent to start a new word */
  restartToken: number;
  onResult: (won: boolean, attempts: number) => void;
  onShowStats: () => void;
  onStateChange: (state: { inProgress: boolean; wordLength: number }) => void;
}

export default function ClassicGame({ restartToken, onResult, onShowStats, onStateChange }: ClassicGameProps) {
  const { settings, t, triggerSound, announce, isAnyModalOpen } = useGame();

  // Read once on mount so a reload or a trip to the menu resumes the same game
  const [restored] = useState(() => loadSavedGame(settings.language));
  const [activeWord, setActiveWord] = useState<WordData | null>(restored?.word ?? null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<GuessAttempt[]>(restored?.guesses ?? []);
  const [gameStatus, setGameStatus] = useState<GameStatus>(restored?.status ?? 'playing');
  const [hintRevealed, setHintRevealed] = useState(restored?.hintRevealed ?? false);
  const [notice, setNotice] = useState<string | null>(null);
  const [shakeRowIndex, setShakeRowIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wordLength = activeWord ? activeWord.word.length : settings.wordLength;

  const newWord = useCallback(() => {
    const solvedWord = generateWordOffline(settings.language, settings.category, settings.wordLength);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setHintRevealed(false);
    setErrorMessage(null);
    setActiveWord(solvedWord);
  }, [settings.language, settings.category, settings.wordLength, t]);

  // Pick a word on start (unless a saved game was restored), and again when word
  // settings change if no guess was made yet
  const skipRestoredStart = useRef(restored !== null);
  useEffect(() => {
    if (skipRestoredStart.current) {
      skipRestoredStart.current = false;
      return;
    }
    if (guesses.length === 0 || gameStatus !== 'playing') newWord();
  }, [settings.language, settings.category, settings.wordLength]);

  // Save progress
  useEffect(() => {
    if (!activeWord) return;
    const saved: SavedGame = { language: settings.language, word: activeWord, guesses, status: gameStatus, hintRevealed };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
    } catch (e) {
      console.error('Failed to save the Classic game', e);
    }
  }, [activeWord, guesses, gameStatus, hintRevealed]);

  // "New word" from the header or the stats dialog
  const lastRestartToken = useRef(restartToken);
  useEffect(() => {
    if (lastRestartToken.current === restartToken) return;
    lastRestartToken.current = restartToken;
    newWord();
  }, [restartToken]);

  useEffect(() => {
    onStateChange({ inProgress: gameStatus === 'playing' && guesses.length > 0, wordLength });
  }, [gameStatus, guesses.length, wordLength]);

  const showNotice = (message: string) => {
    setNotice(message);
    announce(message);
    setTimeout(() => setNotice(null), 2500);
  };

  const shareResult = async () => {
    triggerSound('click');
    const { score, grid } = buildShareGrid(guesses, gameStatus === 'won', MAX_GUESSES, settings.highContrast);
    const title = t.classic.shareTitle(score);
    const text = `${title}\n\n${grid}\n\n${window.location.href.split('#')[0]}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      showNotice(t.classic.copied);
    } catch (e) {
      // Sharing was cancelled or the clipboard is unavailable
      if ((e as Error)?.name !== 'AbortError') console.error('Share failed', e);
    }
  };

  const rejectGuess = (message: string) => {
    triggerSound('error');
    setShakeRowIndex(guesses.length);
    setTimeout(() => setShakeRowIndex(null), 450);
    setErrorMessage(message);
    announce(message);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setErrorMessage(null), 3500);
  };

  const submitGuess = () => {
    if (gameStatus !== 'playing' || !activeWord) return;
    const guess = normalizeText(currentGuess);

    if (guess.length !== wordLength) return rejectGuess(t.classic.typeLetters(wordLength));
    if (!/^[A-ZÇÑ]+$/.test(guess)) return rejectGuess(t.classic.onlyLetters);
    // Skipped only while the word list is still loading
    if (isKnownWord(guess, settings.language) === false) return rejectGuess(t.classic.notInList);

    if (settings.hardMode && guesses.length > 0) {
      const violation = checkHardMode(guess, guesses[guesses.length - 1].evaluations);
      if (violation?.kind === 'position') return rejectGuess(t.classic.letterMustBe(violation.position, violation.char));
      if (violation?.kind === 'missing') return rejectGuess(t.classic.mustContain(violation.char));
    }

    const evaluations = evaluateGuess(activeWord.word, guess);
    const nextGuesses = [...guesses, { word: guess, evaluations }];
    triggerSound('flip');
    setGuesses(nextGuesses);
    setCurrentGuess('');

    const spokenResult = t.a11y.guessResult(
      nextGuesses.length,
      evaluations.map(e => `${e.char} ${t.a11y.status[e.status]}`).join(', ')
    );

    if (guess === normalizeText(activeWord.word)) {
      setGameStatus('won');
      triggerSound('win');
      announce(`${spokenResult} ${t.classic.won}`);
      onResult(true, nextGuesses.length);
    } else if (nextGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost');
      triggerSound('lose');
      announce(`${spokenResult} ${t.a11y.classicLost(activeWord.word)}`);
      onResult(false, nextGuesses.length);
    } else if (settings.autoRevealClue && nextGuesses.length === 3 && !hintRevealed) {
      setHintRevealed(true);
      announce(`${spokenResult} ${t.common.hint} ${activeWord.clue}`);
    } else {
      announce(spokenResult);
    }
  };

  const handleKey = (key: string) => {
    if (gameStatus !== 'playing') return;
    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      submitGuess();
    } else if (/^[A-ZÇÑ]$/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + sanitizeLetter(key, settings.language));
    }
  };

  usePhysicalKeyboard(handleKey, !isAnyModalOpen);

  const categoryName = activeWord && settings.language === 'pt' && activeWord.category === 'Nature' ? 'Natureza' : activeWord?.category;

  return (
    <>
      {notice && (
        <div aria-hidden="true" className="absolute top-14 left-1/2 -translate-x-1/2 bg-emerald-950 border border-emerald-700 text-emerald-100 px-4 py-2 rounded-xl text-xs font-semibold shadow-xl z-50 animate-in fade-in duration-200">
          {notice}
        </div>
      )}

      {errorMessage && (
        <div aria-hidden="true" className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold shadow-xl z-50 flex items-center gap-1.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Clue and result card */}
      <div className="px-4 mt-0.5 sm:mt-2 flex flex-col gap-1 sm:gap-2 relative z-10 shrink-0 select-none text-center">
        {activeWord ? (
          <div className="bg-surface p-1.5 sm:p-3 rounded border border-line flex flex-col items-center justify-center text-xs max-w-xs mx-auto w-full relative">
            <div className="flex gap-2 items-center mb-0.5 sm:mb-1">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-500 uppercase tracking-widest">
                {t.common.category} {categoryName}
              </span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                activeWord.difficulty === 'fácil'
                  ? 'bg-surface border-emerald-500/30 text-emerald-400'
                  : activeWord.difficulty === 'médio'
                    ? 'bg-surface border-amber-500/30 text-amber-500'
                    : 'bg-surface border-rose-500/30 text-rose-400'
              }`}>
                {t.common.difficulty[activeWord.difficulty]}
              </span>
            </div>

            {gameStatus !== 'playing' ? (
              <div id="classic-result" className="flex flex-col items-center mt-1 animate-in fade-in zoom-in-95 duration-200">
                <p className={`text-xs font-black tracking-widest uppercase ${gameStatus === 'won' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {gameStatus === 'won' ? t.classic.won : t.classic.lost}
                </p>
                <h3 className="text-xl font-black text-white tracking-[0.2em] font-mono select-text mt-0.5 uppercase">
                  {activeWord.word}
                </h3>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => { triggerSound('click'); newWord(); }}
                    className="min-h-9 bg-white text-black hover:bg-emerald-700 hover:text-white font-black text-xs uppercase tracking-wide py-1.5 px-3 rounded transition-colors active:scale-95 cursor-pointer"
                  >
                    {t.classic.nextWord}
                  </button>
                  <button
                    onClick={shareResult}
                    className="min-h-9 flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wide py-1.5 px-3 rounded transition-colors active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {t.classic.share}
                  </button>
                  <button
                    onClick={() => { triggerSound('click'); onShowStats(); }}
                    className="w-9 h-9 flex items-center justify-center border border-line text-slate-300 hover:text-white hover:bg-line rounded transition-colors cursor-pointer"
                    title={t.stats.title}
                    aria-label={t.stats.title}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : hintRevealed ? (
              <p className="text-[13px] sm:text-sm text-slate-100 font-bold leading-snug mt-0.5 sm:mt-1 animate-in fade-in slide-in-from-top-1 px-1.5">
                <span className="font-extrabold text-emerald-500 not-italic uppercase tracking-widest block text-[11px] mb-0">{t.common.hint}</span>
                "{activeWord.clue}"
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  triggerSound('click');
                  setHintRevealed(true);
                }}
                className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs bg-white text-black hover:bg-emerald-700 hover:text-white font-black uppercase tracking-widest py-1 px-2.5 sm:py-1.5 sm:px-3 rounded transition-colors active:scale-95 cursor-pointer"
              >
                <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {t.classic.showHint}
              </button>
            )}
          </div>
        ) : (
          <div className="h-14" />
        )}
      </div>

      <GameBoard
        guesses={guesses}
        currentGuess={currentGuess}
        maxGuesses={MAX_GUESSES}
        wordLength={wordLength}
        shakeRowIndex={shakeRowIndex}
        revealedWord={gameStatus !== 'playing' && activeWord ? activeWord.word : null}
      />

      <Keyboard
        onKeyPress={handleKey}
        letterStatuses={getKeyStatuses(guesses)}
        language={settings.language}
        triggerSound={triggerSound}
      />
    </>
  );
}
