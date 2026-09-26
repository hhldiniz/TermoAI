import React from 'react';
import { BarChart3, HelpCircle, RefreshCw, Settings } from 'lucide-react';
import { GameMode } from '../types';
import { useGame } from '../GameContext';

interface HeaderProps {
  gameMode: GameMode;
  onHome: () => void;
  onHelp: () => void;
  onNewWord: () => void;
  onStats: () => void;
  onSettings: () => void;
}

const ICON_BUTTON = 'w-10 h-10 flex items-center justify-center shrink-0 text-slate-400 hover:text-white hover:bg-line rounded transition-all cursor-pointer';

export default function Header({ gameMode, onHome, onHelp, onNewWord, onStats, onSettings }: HeaderProps) {
  const { t, triggerSound } = useGame();
  const click = (action: () => void) => () => { triggerSound('click'); action(); };

  const modeName = gameMode === 'enigma'
    ? t.modes.enigma
    : gameMode === 'survival'
      ? t.modes.survival
      : t.modes.classic;

  return (
    <header className="h-12 sm:h-16 px-1.5 sm:px-3 flex items-center justify-between border-b border-line shrink-0 select-none bg-app z-20">
      <div className="flex flex-1 items-center">
        {gameMode !== 'menu' && (
          <button
            id="header-btn-home"
            onClick={click(onHome)}
            className="w-10 h-10 flex items-center justify-center shrink-0 text-emerald-400 hover:text-emerald-300 hover:bg-line active:scale-95 rounded transition-all cursor-pointer"
            title={t.common.backToMenu}
            aria-label={t.common.backToMenu}
          >
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        )}

        <button id="header-btn-help" onClick={click(onHelp)} className={`${ICON_BUTTON} active:scale-90`} title={t.a11y.help} aria-label={t.a11y.help}>
          <HelpCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 pointer-events-none" />
        </button>

        {(gameMode === 'standard' || gameMode === 'enigma') && (
          <button
            id={gameMode === 'standard' ? 'header-btn-refresh' : 'header-btn-enigma-refresh'}
            onClick={click(onNewWord)}
            className={`${ICON_BUTTON} active:scale-95`}
            title={t.common.newWord}
            aria-label={t.common.newWord}
          >
            <RefreshCw className="w-4 h-4 sm:w-4.5 sm:h-4.5 pointer-events-none" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center select-none" id="termo-box-logo">
        {gameMode !== 'menu' && (
          <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-500 font-bold leading-none mb-1 text-center font-mono">
            {modeName}
          </span>
        )}
        <h1 className="text-lg sm:text-2xl font-black tracking-tighter leading-none text-white text-center">
          TERMO<span className="text-emerald-500 underline decoration-2 underline-offset-4">AI</span>
        </h1>
      </div>

      <div className="flex flex-1 justify-end">
        <button id="header-btn-stats" onClick={click(onStats)} className={`${ICON_BUTTON} active:scale-90`} title={t.stats.title} aria-label={t.stats.title}>
          <BarChart3 className="w-4.5 h-4.5 sm:w-5 sm:h-5 pointer-events-none" />
        </button>
        <button id="header-btn-settings" onClick={click(onSettings)} className={`${ICON_BUTTON} active:scale-90`} title={t.settings.title} aria-label={t.settings.title}>
          <Settings className="w-4.5 h-4.5 sm:w-5 sm:h-5 pointer-events-none" />
        </button>
      </div>
    </header>
  );
}
