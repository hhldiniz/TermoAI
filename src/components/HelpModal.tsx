import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { getMessages } from '../i18n';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'pt' | 'en' | 'es';
  gameMode: 'menu' | 'standard' | 'enigma' | 'survival';
  wordLength: number;
  triggerSound: (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => void;
}

export default function HelpModal({
  isOpen,
  onClose,
  language,
  gameMode,
  wordLength,
  triggerSound
}: HelpModalProps) {
  if (!isOpen) return null;

  const t = getMessages(language);

  const standardRules = (
    <>
      <p className="mb-2 text-muted font-bold">
        {t.help.classicIntro(wordLength)}
      </p>
      <div className="flex flex-col gap-2 font-black uppercase tracking-wider text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-center bg-correct text-white rounded py-0.5">{t.help.green}</span>
          <span className="text-muted font-semibold tracking-tight normal-case">
            {t.help.greenDesc}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-center bg-present text-white rounded py-0.5">{t.help.yellow}</span>
          <span className="text-muted font-semibold tracking-tight normal-case">
            {t.help.yellowDesc}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-center bg-absent text-absent-fg border border-absent rounded py-0.5">{t.help.gray}</span>
          <span className="text-muted font-semibold tracking-tight normal-case">
            {t.help.grayDesc}
          </span>
        </div>
      </div>
    </>
  );

  const enigmaRules = (
    <ul className="list-disc pl-4 flex flex-col gap-1 text-muted font-bold">
      {t.help.enigmaRules.map(rule => <li key={rule}>{rule}</li>)}
    </ul>
  );

  const survivalRules = (
    <ul className="list-disc pl-4 flex flex-col gap-1 text-muted font-bold">
      {t.help.survivalRules.map(rule => <li key={rule}>{rule}</li>)}
    </ul>
  );

  const title = gameMode === 'enigma'
    ? t.help.titleEnigma
    : gameMode === 'survival'
      ? t.help.titleSurvival
      : t.help.titleClassic;

  return (
    <div id="help-modal-backdrop" className="absolute inset-0 bg-app/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div
        id="help-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        className="w-full max-w-sm bg-surface border border-line rounded p-6 shadow-xl relative flex flex-col gap-4 select-none"
      >
        <button
          onClick={() => { triggerSound('click'); onClose(); }}
          aria-label={t.common.close}
          className="absolute right-4 top-4 text-muted hover:text-white p-1 rounded hover:bg-line transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-line pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-500" />
          <h2 id="help-modal-title" className="text-sm font-black text-white uppercase tracking-widest">{title}</h2>
        </div>

        <div className="text-sm text-slate-300 leading-normal text-left">
          {gameMode === 'enigma' ? enigmaRules : gameMode === 'survival' ? survivalRules : standardRules}
        </div>
      </div>
    </div>
  );
}
