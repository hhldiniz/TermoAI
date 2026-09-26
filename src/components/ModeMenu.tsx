import React from 'react';
import { Cpu, Heart } from 'lucide-react';
import { GameMode } from '../types';
import { useGame } from '../GameContext';

interface ModeMenuProps {
  onSelect: (mode: Exclude<GameMode, 'menu'>) => void;
  onCycleLanguage: () => void;
}

const CARD = 'w-full p-3 sm:p-4 rounded-xl bg-surface border border-line hover:bg-surface-2 text-left transition-all duration-300 active:scale-[0.98] group flex flex-col cursor-pointer';

export default function ModeMenu({ onSelect, onCycleLanguage }: ModeMenuProps) {
  const { t, triggerSound } = useGame();

  const modes = [
    { mode: 'standard' as const, title: <>⚡ {t.modes.classic}</>, badge: t.menu.classicBadge, desc: t.menu.classicDesc, rose: false },
    { mode: 'enigma' as const, title: <>🔎 {t.modes.enigma}</>, badge: t.menu.enigmaBadge, desc: t.menu.enigmaDesc, rose: false },
    {
      mode: 'survival' as const,
      title: <><Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />{t.modes.survival}</>,
      badge: t.menu.survivalBadge,
      desc: t.menu.survivalDesc,
      rose: true
    }
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-center-safe items-center px-4 py-6 max-w-md mx-auto w-full z-10 select-none text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center">
        <div className="w-full h-full rounded-2xl bg-app flex items-center justify-center">
          <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
        </div>
      </div>

      <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-1 font-sans">
        TERMO<span className="text-emerald-500">AI</span>
      </h2>
      <p className="text-sm text-slate-400 mb-6 sm:mb-8 max-w-[300px]">{t.menu.subtitle}</p>

      <div className="w-full flex flex-col gap-3 sm:gap-4">
        {modes.map(({ mode, title, badge, desc, rose }) => (
          <button
            key={mode}
            onClick={() => { triggerSound('click'); onSelect(mode); }}
            className={`${CARD} ${rose ? 'hover:border-rose-500/50' : 'hover:border-emerald-500/50'}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className={`font-extrabold text-xs sm:text-sm text-white transition-colors flex items-center gap-1.5 ${rose ? 'group-hover:text-rose-500' : 'group-hover:text-emerald-400'}`}>
                {title}
              </span>
              <span className={`text-[11px] sm:text-xs font-mono px-2 py-0.5 rounded border ${
                rose ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {badge}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-400 leading-snug">{desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 flex gap-2 items-center text-xs text-muted bg-surface py-1.5 px-3 rounded-full border border-line">
        <span>{t.menu.language}</span>
        <button
          onClick={() => { triggerSound('click'); onCycleLanguage(); }}
          className="font-black text-emerald-400 hover:underline hover:text-white cursor-pointer"
          title={t.menu.switchLanguage}
        >
          {t.langName}
        </button>
      </div>
    </div>
  );
}
