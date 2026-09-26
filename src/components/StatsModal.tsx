import React from 'react';
import { RefreshCw, BarChart3, TrendingUp, X, Sparkles, Trophy } from 'lucide-react';
import { GameStats } from '../types';
import { getMessages } from '../i18n';
import { useDialog } from '../useDialog';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  language: 'pt' | 'en' | 'es';
  onResetStats: () => void;
  isGameFinished: boolean;
  onNewGame: () => void;
  triggerSound: (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => void;
}

export default function StatsModal({
  isOpen,
  onClose,
  stats,
  language,
  onResetStats,
  isGameFinished,
  onNewGame,
  triggerSound
}: StatsModalProps) {
  const dialogRef = useDialog<HTMLDivElement>(isOpen, onClose);
  if (!isOpen) return null;

  const t = getMessages(language);
  const labelTitle = t.stats.title;
  const labelPlayed = t.stats.played;
  const labelWinPct = t.stats.winPct;
  const labelCurStreak = t.stats.curStreak;
  const labelMaxStreak = t.stats.maxStreak;
  const labelDistribution = t.stats.distribution;
  const labelNewGame = t.stats.newGame;
  const labelReset = t.stats.reset;

  const totalGames = stats.gamesPlayed || 0;
  const winPercent = totalGames > 0 ? Math.round((stats.gamesWon / totalGames) * 100) : 0;
  const maxBar = Math.max(...stats.guessesDistribution, 1);

  return (
    <div id="stats-modal-backdrop" className="absolute inset-0 bg-app/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div 
        id="stats-modal-content"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-modal-title"
        className="w-full max-w-sm bg-surface border border-line rounded p-4 sm:p-6 shadow-xl relative flex flex-col gap-5 select-none"
      >
        {/* Close button */}
        <button
          aria-label={t.common.close} 
          onClick={() => { triggerSound('click'); onClose(); }}
          className="absolute right-2 top-2 w-11 h-11 flex items-center justify-center text-muted hover:text-white rounded hover:bg-line transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title and Icon */}
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          <h2 id="stats-modal-title" className="text-sm font-black text-white uppercase tracking-widest">{labelTitle}</h2>
        </div>

        {/* Numeric KPI Grid */}
        <div className="grid grid-cols-4 gap-2 text-center py-1">
          <div className="bg-app px-1 py-2.5 rounded border border-line min-w-0">
            <p className="text-xl font-black text-white font-mono leading-none mb-1">{totalGames}</p>
            <p className="text-[11px] sm:text-xs uppercase font-bold text-muted tracking-tight">{labelPlayed}</p>
          </div>
          <div className="bg-app px-1 py-2.5 rounded border border-line min-w-0">
            <p className="text-xl font-black text-emerald-500 font-mono leading-none mb-1">{winPercent}%</p>
            <p className="text-[11px] sm:text-xs uppercase font-bold text-muted tracking-tight">{labelWinPct}</p>
          </div>
          <div className="bg-app px-1 py-2.5 rounded border border-line min-w-0">
            <p className="text-xl font-black text-white font-mono leading-none mb-1 flex items-center justify-center gap-0.5">
              {stats.currentStreak}
            </p>
            <p className="text-[11px] sm:text-xs uppercase font-bold text-muted tracking-tight leading-tight">{labelCurStreak}</p>
          </div>
          <div className="bg-app px-1 py-2.5 rounded border border-line min-w-0">
            <p className="text-xl font-black text-white font-mono leading-none mb-1 flex items-center justify-center gap-0.5">
              {stats.maxStreak}
            </p>
            <p className="text-[11px] sm:text-xs uppercase font-bold text-muted tracking-tight leading-tight">{labelMaxStreak}</p>
          </div>
        </div>

        {/* Distribution Graphs */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm uppercase tracking-[0.2em] text-muted font-bold">
            {labelDistribution}
          </h3>
          <div className="space-y-2 mt-1 font-mono text-xs">
            {stats.guessesDistribution.map((count, index) => {
              const widthPct = totalGames > 0 ? (count / maxBar) * 100 : 0;
              const hasGuesses = count > 0;
              return (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-3 text-right font-black text-muted">{index + 1}</span>
                  <div className="flex-1 bg-app h-4 rounded-sm relative border border-line/30">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-sm flex items-center justify-end pr-2 transition-all duration-500 font-black text-white text-[11px] ${
                        hasGuesses 
                          ? 'bg-correct' 
                          : 'bg-line'
                      }`}
                      style={{ width: `${Math.max(widthPct, 8)}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal quick options footer */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-4 border-t border-line">
          {/* Restart / New Game button */}
          <button
            onClick={() => {
              triggerSound('click');
              onNewGame();
              onClose();
            }}
            className="flex-1 bg-white text-black hover:bg-emerald-700 hover:text-white hover:border-emerald-700 border border-transparent font-black text-xs uppercase tracking-widest py-3 px-4 rounded transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {labelNewGame}
          </button>

          {/* Wipe button */}
          <button
            onClick={() => {
              if (confirm(t.stats.resetConfirm)) {
                triggerSound('click');
                onResetStats();
              }
            }}
            className="border border-line hover:border-rose-500/50 hover:text-rose-500 text-slate-400 py-3 px-3 rounded text-xs font-black uppercase tracking-widest text-center transition-colors duration-200 cursor-pointer"
          >
            {labelReset}
          </button>
        </div>
      </div>
    </div>
  );
}
