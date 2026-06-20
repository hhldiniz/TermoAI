import React from 'react';
import { Settings, Volume2, VolumeX, X, HelpCircle } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  language: 'pt' | 'en' | 'es';
  triggerSound: (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => void;
  wordLength: number;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings,
  language,
  triggerSound,
  wordLength
}: SettingsModalProps) {
  if (!isOpen) return null;

  const isPt = language === 'pt';
  const isEs = language === 'es';
  const labelTitle = isPt ? 'Configurações' : isEs ? 'Configuración' : 'Settings';
  const labelLang = isPt ? 'Idioma do Jogo' : isEs ? 'Idioma del Juego' : 'Game Language';
  const labelSound = isPt ? 'Efeitos Sonoros' : isEs ? 'Efectos de Sonido' : 'Sound Effects';
  const labelHardMode = isPt ? 'Modo Difícil' : isEs ? 'Modo Difícil' : 'Hard Mode';
  const labelAutoClue = isPt ? 'Dica Automática' : isEs ? 'Pista Automática' : 'Auto Reveal Hint';
  const labelAutoClueDesc = isPt 
    ? 'Revela a pista da palavra após a 3ª tentativa.' 
    : isEs 
      ? 'Revela la pista de la palabra automáticamente tras el 3er intento.' 
      : 'Reveals the word clue automatically after the 3rd guess.';
  
  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    setSettings(prev => ({ ...prev, soundEnabled: nextVal }));
    playSoundTest(nextVal);
  };

  const playSoundTest = (enabled: boolean) => {
    if (enabled) {
      playSound('click');
    }
  };

  const playSound = (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => {
    triggerSound(type);
  };

  return (
    <div id="settings-modal-backdrop" className="absolute inset-0 bg-[#121213]/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div 
        id="settings-modal-content"
        className="w-full max-w-sm bg-[#1a1a1b] border border-[#3a3a3c] rounded p-6 shadow-xl relative flex flex-col gap-5 select-none"
      >
        {/* Close Button */}
        <button 
          onClick={() => { playSound('click'); onClose(); }}
          className="absolute right-4 top-4 text-[#818384] hover:text-white p-1 rounded hover:bg-[#3a3a3c] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-2 border-b border-[#3a3a3c] pb-3">
          <Settings className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{labelTitle}</h2>
        </div>

        {/* Setting Controls */}
        <div className="flex flex-col gap-4 py-1 select-none text-left">
          
          {/* LANGUAGE SELECT */}
          <div className="flex items-center justify-between border-b border-[#3a3a3c]/40 pb-3">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelLang}</span>
              <span className="text-[10px] text-[#818384]">
                {isPt ? 'Muda o dicionário e strings de UI.' : isEs ? 'Cambia el vocabulario y la interfaz.' : 'Toggles vocabulary & UI layout.'}
              </span>
            </div>
            <div className="flex gap-1.5 bg-[#121213] p-1 rounded border border-[#3a3a3c] font-bold text-xs">
              <button
                onClick={() => {
                  playSound('click');
                  setSettings(p => ({ ...p, language: 'pt' }));
                }}
                className={`px-3 py-1 rounded transition-colors font-bold uppercase ${settings.language === 'pt' ? 'bg-[#10b981] text-white' : 'text-[#818384] hover:text-white'}`}
              >
                PT
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setSettings(p => ({ ...p, language: 'en' }));
                }}
                className={`px-3 py-1 rounded transition-colors font-bold uppercase ${settings.language === 'en' ? 'bg-[#10b981] text-white' : 'text-[#818384] hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setSettings(p => ({ ...p, language: 'es' }));
                }}
                className={`px-3 py-1 rounded transition-colors font-bold uppercase ${settings.language === 'es' ? 'bg-[#10b981] text-white' : 'text-[#818384] hover:text-white'}`}
              >
                ES
              </button>
            </div>
          </div>

          {/* AUDIO SOUND EFFECTS */}
          <div className="flex items-center justify-between border-b border-[#3a3a3c]/40 pb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelSound}</span>
              <span className="text-[10px] text-[#818384]">
                {isPt ? 'Ativa sons sintetizados da retro-placa.' : isEs ? 'Activa los efectos de sonido retro digitales.' : 'Plays localized retro digital sound chimes.'}
              </span>
            </div>
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                settings.soundEnabled 
                  ? 'bg-[#121213] border-[#10b981] text-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                  : 'bg-[#121213] border-[#3a3a3c] text-[#818384]'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* AUTO CLUE MATCH */}
          <div className="flex items-center justify-between border-b border-[#3a3a3c]/40 pb-3">
            <div className="flex flex-col gap-0.5 max-w-[75%]">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelAutoClue}</span>
              <span className="text-[10px] text-[#818384] leading-normal">{labelAutoClueDesc}</span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSettings(prev => ({ ...prev, autoRevealClue: !prev.autoRevealClue }));
              }}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors outline-none flex items-center cursor-pointer ${
                settings.autoRevealClue ? 'bg-[#10b981] justify-end' : 'bg-[#3a3a3c] justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full shadow bg-white" />
            </button>
          </div>

          {/* HARD MODE MATCH */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex flex-col gap-0.5 max-w-[75%]">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelHardMode}</span>
              <span className="text-[10px] text-[#818384] leading-normal">
                {isPt 
                  ? 'Dicas reveladas precisam conter novas letras de palpites anteriores.' 
                  : isEs 
                    ? 'Cualquier pista revelada debe ser integrada en los siguientes intentos.' 
                    : 'Any revealed hints must be integrated in following attempts.'}
              </span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSettings(prev => ({ ...prev, hardMode: !prev.hardMode }));
              }}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors outline-none flex items-center cursor-pointer ${
                settings.hardMode ? 'bg-[#10b981] justify-end' : 'bg-[#3a3a3c] justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full shadow bg-white" />
            </button>
          </div>

        </div>

        {/* Rules Sheet section */}
        <div className="bg-[#121213] p-3 rounded border border-[#3a3a3c] text-[10px] text-slate-300 leading-normal text-left select-none">
          <p className="font-bold text-white uppercase tracking-widest mb-1 text-[9px] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            {isPt ? 'Como jogar Termo' : isEs ? 'Cómo jugar a Termo' : 'How to play Termo'}
          </p>
          <p className="mb-2 text-[#818384] font-bold">
            {isPt 
              ? `Descubra a palavra secreta de ${wordLength} letras em 6 tentativas. A cada palpite, a cor do bloco mudará indicando quão perto você chegou:`
              : isEs
                ? `Descubre la palabra oculta de ${wordLength} letras en 6 intentos. Después de cada intento, el color de las fichas cambia:`
                : `Find the hidden ${wordLength}-letter word in 6 attempts. After each guess, tiles change colors to display correctness:`}
          </p>
          <div className="flex flex-col gap-2 font-black uppercase tracking-wider text-[9px]">
            <div className="flex items-center gap-2">
              <span className="w-14 text-center bg-[#10b981] text-white rounded py-0.5">{isPt ? 'VERDE' : isEs ? 'VERDE' : 'GREEN'}</span>
              <span className="text-[#818384] font-semibold tracking-tight normal-case">
                {isPt ? 'A letra faz parte da palavra e está na posição correta.' : isEs ? 'La letra está en la palabra y en la posición correcta.' : 'The letter is present and in the exact index.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-center bg-[#b59f3b] text-white rounded py-0.5">{isPt ? 'AMARELO' : isEs ? 'AMARILLO' : 'YELLOW'}</span>
              <span className="text-[#818384] font-semibold tracking-tight normal-case">
                {isPt ? 'A letra está contida na palavra, mas em uma posição incorreta.' : isEs ? 'La letra está en la palabra, pero en una posición diferente.' : 'The letter is present but positioned elsewhere.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-center bg-[#3a3a3c] text-[#818384] border border-[#3a3a3c] rounded py-0.5">{isPt ? 'CINZA' : isEs ? 'GRIS' : 'GRAY'}</span>
              <span className="text-[#818384] font-semibold tracking-tight normal-case">
                {isPt ? 'A letra não faz parte de nenhuma seção da palavra secreta.' : isEs ? 'La letra no forma parte de la palabra en ningún lugar.' : 'The letter is absent from this secret word.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
