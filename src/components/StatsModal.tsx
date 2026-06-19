import React from 'react';
import { RefreshCw, BarChart3, TrendingUp, X, Sparkles, Trophy } from 'lucide-react';
import { GameStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  language: 'pt' | 'en';
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
  if (!isOpen) return null;

  const isPt = language === 'pt';
  const labelTitle = isPt ? 'Estatísticas' : 'Statistics';
  const labelPlayed = isPt ? 'Jogos' : 'Played';
  const labelWinPct = isPt ? 'Vitórias' : 'Win %';
  const labelCurStreak = isPt ? 'Seq. Atual' : 'Cur Streak';
  const labelMaxStreak = isPt ? 'Seq. Máx' : 'Max Streak';
  const labelDistribution = isPt ? 'Distribuição de Tentativas' : 'Guess Distribution';
  const labelNewGame = isPt ? 'Novo Jogo' : 'New Game';
  const labelReset = isPt ? 'Limpar Dados' : 'Reset Stats';

  const totalGames = stats.gamesPlayed || 0;
  const winPercent = totalGames > 0 ? Math.round((stats.gamesWon / totalGames) * 100) : 0;
  const maxBar = Math.max(...stats.guessesDistribution, 1);

  return (
    <div id="stats-modal-backdrop" className="absolute inset-0 bg-[#121213]/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div 
        id="stats-modal-content"
        className="w-full max-w-sm bg-[#1a1a1b] border border-[#3a3a3c] rounded p-6 shadow-xl relative flex flex-col gap-5 select-none"
      >
        {/* Close button */}
        <button 
          onClick={() => { triggerSound('click'); onClose(); }}
          className="absolute right-4 top-4 text-[#818384] hover:text-white p-1 rounded hover:bg-[#3a3a3c] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title and Icon */}
        <div className="flex items-center gap-2 border-b border-[#3a3a3c] pb-3">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{labelTitle}</h2>
        </div>

        {/* Numeric KPI Grid */}
        <div className="grid grid-cols-4 gap-2 text-center py-1">
          <div className="bg-[#121213] p-2.5 rounded border border-[#3a3a3c]">
            <p className="text-xl font-black text-white font-mono leading-none mb-1">{totalGames}</p>
            <p className="text-[10px] uppercase font-bold text-[#818384] tracking-tight">{labelPlayed}</p>
          </div>
          <div className="bg-[#121213] p-2.5 rounded border border-[#3a3a3c]">
            <p className="text-xl font-black text-emerald-500 font-mono leading-none mb-1">{winPercent}%</p>
            <p className="text-[10px] uppercase font-bold text-[#818384] tracking-tight">{labelWinPct}</p>
          </div>
          <div className="bg-[#121213] p-2.5 rounded border border-[#3a3a3c]">
            <p className="text-xl font-black text-white font-mono leading-none mb-1 flex items-center justify-center gap-0.5">
              {stats.currentStreak}
            </p>
            <p className="text-[10px] uppercase font-bold text-[#818384] tracking-tight leading-tight">{labelCurStreak}</p>
          </div>
          <div className="bg-[#121213] p-2.5 rounded border border-[#3a3a3c]">
            <p className="text-xl font-black text-white font-mono leading-none mb-1 flex items-center justify-center gap-0.5">
              {stats.maxStreak}
            </p>
            <p className="text-[10px] uppercase font-bold text-[#818384] tracking-tight leading-tight">{labelMaxStreak}</p>
          </div>
        </div>

        {/* Distribution Graphs */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#818384] font-bold">
            {labelDistribution}
          </h3>
          <div className="space-y-2 mt-1 font-mono text-[10px]">
            {stats.guessesDistribution.map((count, index) => {
              const widthPct = totalGames > 0 ? (count / maxBar) * 100 : 0;
              const hasGuesses = count > 0;
              return (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-3 text-right font-black text-[#818384]">{index + 1}</span>
                  <div className="flex-1 bg-[#121213] h-4 rounded-sm relative border border-[#3a3a3c]/30">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-sm flex items-center justify-end pr-2 transition-all duration-500 font-black text-white text-[9px] ${
                        hasGuesses 
                          ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                          : 'bg-[#3a3a3c]'
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
        <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-4 border-t border-[#3a3a3c]">
          {/* Restart / New Game button */}
          <button
            onClick={() => {
              triggerSound('click');
              onNewGame();
              onClose();
            }}
            className="flex-1 bg-white text-black hover:bg-emerald-500 hover:text-white hover:border-emerald-500 border border-transparent font-black text-xs uppercase tracking-widest py-3 px-4 rounded transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {labelNewGame}
          </button>

          {/* Wipe button */}
          <button
            onClick={() => {
              if (confirm(isPt ? 'Deseja mesmo resetar todos os dados salvos?' : 'Are you sure you want to reset all saved records?')) {
                triggerSound('click');
                onResetStats();
              }
            }}
            className="border border-[#3a3a3c] hover:border-rose-500/50 hover:text-rose-500 text-slate-400 py-3 px-3 rounded text-[10px] font-black uppercase tracking-widest text-center transition-colors duration-200 cursor-pointer"
          >
            {labelReset}
          </button>
        </div>
      </div>
    </div>
  );
}
