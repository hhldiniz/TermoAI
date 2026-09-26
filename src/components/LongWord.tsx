import React from 'react';
import { GameStatus } from '../types';
import { useGame } from '../GameContext';

// Shared UI for the long-word modes (Enigma and Survival).

type Accent = 'emerald' | 'rose';

// Full class names so Tailwind can find them at build time
const ACCENT = {
  emerald: {
    cardBorder: 'border-line',
    text: 'text-emerald-500',
    label: 'text-emerald-500',
    focusBorder: 'focus-within:border-emerald-500',
    button: 'bg-emerald-700 hover:bg-emerald-800'
  },
  rose: {
    cardBorder: 'border-rose-500/20',
    text: 'text-rose-400',
    label: 'text-rose-500',
    focusBorder: 'focus-within:border-rose-500',
    button: 'bg-rose-700 hover:bg-rose-800'
  }
} as const;

interface ClueCardProps {
  category: string;
  clue: string;
  accent: Accent;
  badge?: React.ReactNode;
}

export function ClueCard({ category, clue, accent, badge }: ClueCardProps) {
  const { t, settings } = useGame();
  const colors = ACCENT[accent];
  const categoryName = settings.language === 'pt' && category === 'Nature' ? 'Natureza' : category;

  return (
    <div className="px-4 mt-0.5 sm:mt-2 flex flex-col gap-1 sm:gap-2 relative z-10 shrink-0 select-none text-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-top-2 duration-300">
      <div className={`bg-surface p-2 sm:p-3 rounded border ${colors.cardBorder} flex flex-col items-center justify-center text-xs relative w-full`}>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 items-center mb-1">
          <span className={`text-xs font-bold ${colors.text} uppercase tracking-widest font-mono`}>
            {t.common.category} {categoryName}
          </span>
          {badge}
        </div>
        <p className="text-[13px] sm:text-sm text-slate-100 font-bold leading-normal px-2">
          <span className={`font-extrabold ${colors.text} uppercase tracking-widest block text-[11px] mb-0.5`}>
            {t.common.hint}
          </span>
          "{clue}"
        </p>
      </div>
    </div>
  );
}

interface HiddenWordProps {
  word: string;
  /** Positions revealed during play (hints or matches) */
  revealed: boolean[];
  status: GameStatus;
}

export function HiddenWord({ word, revealed, status }: HiddenWordProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-sm w-full mx-auto">
      {word.split('').map((char, idx) => {
        const isShown = revealed[idx] || status !== 'playing';
        const style = !isShown
          ? 'bg-surface border-line text-slate-700'
          : status === 'won'
            ? 'bg-correct border-correct text-white animate-in zoom-in duration-300'
            : revealed[idx]
              ? 'bg-hint border-emerald-500 text-emerald-400'
              : 'bg-rose-950 border-rose-600 text-rose-200';
        return (
          <div
            key={idx}
            className={`w-7 h-9 sm:w-9 sm:h-11 flex items-center justify-center text-sm sm:text-base font-black rounded border-2 transition-all duration-300 ${style}`}
          >
            {isShown ? char : '?'}
          </div>
        );
      })}
    </div>
  );
}

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  maxLength: number;
  accent: Accent;
}

export function AnswerInput({ value, onChange, onSubmit, placeholder, maxLength, accent }: AnswerInputProps) {
  const { t } = useGame();
  const colors = ACCENT[accent];

  return (
    <div className="w-full max-w-sm px-4 mb-2 flex flex-col gap-1 items-stretch mx-auto select-none">
      <div className={`text-[11px] uppercase tracking-widest ${colors.label} font-bold text-left mb-0.5 ml-1 font-mono`}>
        {t.common.yourGuess}
      </div>
      <div className={`relative flex items-center bg-surface rounded-lg border border-line ${colors.focusBorder} shadow-inner px-2.5 py-1.5 min-h-[36px] sm:min-h-[40px]`}>
        <span className={`${colors.label} font-mono font-black text-xs sm:text-sm mr-2 select-none`}>{'>'}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase().replace(/[^A-ZÇÑ]/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
          }}
          placeholder={placeholder}
          aria-label={t.common.yourGuess}
          className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm font-black font-mono tracking-wider placeholder-muted uppercase focus:ring-0 focus-visible:outline-none"
          maxLength={maxLength}
        />
        {value.length > 0 && (
          <button
            onClick={onSubmit}
            className={`ml-2 px-2.5 py-1 text-xs ${colors.button} text-white font-black uppercase tracking-wider rounded transition-colors active:scale-95 cursor-pointer`}
          >
            {t.common.confirm}
          </button>
        )}
      </div>
    </div>
  );
}

/** Keyboard handler for typing a full-word answer into `value`. */
export function applyAnswerKey(
  key: string,
  value: string,
  maxLength: number,
  language: 'pt' | 'en' | 'es',
  sanitize: (key: string, language: 'pt' | 'en' | 'es') => string
): string | 'SUBMIT' {
  if (key === 'BACKSPACE') return value.slice(0, -1);
  if (key === 'ENTER') return 'SUBMIT';
  if (/^[A-ZÇÑ]$/.test(key) && value.length < maxLength) return value + sanitize(key, language);
  return value;
}
