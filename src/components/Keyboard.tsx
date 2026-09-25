import React from 'react';
import { Delete } from 'lucide-react';
import { LetterStatus } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: Record<string, LetterStatus>;
  language: 'pt' | 'en' | 'es';
  triggerSound: (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => void;
}

export default function Keyboard({
  onKeyPress,
  letterStatuses,
  language,
  triggerSound
}: KeyboardProps) {
  const isPt = language === 'pt';
  const isEs = language === 'es';
  
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    isPt 
      ? ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç']
      : isEs
        ? ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ']
        : ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyClass = (key: string) => {
    // Normal base styling for keyboard actions
    const base = "h-[38px] sm:h-12 flex-1 rounded text-sm sm:text-xs font-black transition-all duration-150 flex items-center justify-center select-none active:scale-95 touch-none ";
    
    if (key === 'ENTER' || key === 'BACKSPACE') {
      return base + "bg-key hover:bg-key/90 text-white flex-[1.4] text-[11px] sm:text-xs";
    }

    const status = letterStatuses[key];

    switch (status) {
      case 'correct':
        return base + "bg-correct hover:bg-correct/90 text-white";
      case 'present':
        return base + "bg-present hover:bg-present/90 text-white";
      case 'incorrect':
        return base + "bg-absent text-absent-fg cursor-not-allowed border border-absent";
      default:
        return base + "bg-key hover:bg-key/90 text-white";
    }
  };

  const handleKeyClick = (key: string) => {
    triggerSound('click');
    onKeyPress(key);
  };

  return (
    <div id="keyboard-container" className="w-full flex flex-col gap-1 sm:gap-1.5 px-0.5 sm:px-1 pb-1 sm:pb-2 tracking-wide select-none shrink-0 z-30">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center w-full">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
            const cleanId = `kb-key-${key.toLowerCase()}`;
            
            return (
              <button
                id={cleanId}
                key={key}
                onClick={() => handleKeyClick(key)}
                className={getKeyClass(key)}
                type="button"
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-4 h-4 text-slate-200" />
                ) : key === 'ENTER' ? (
                  <span className="font-bold uppercase tracking-wide text-[11px] sm:text-xs">
                    {key}
                  </span>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
