import React from 'react';
import { Settings, Volume2, VolumeX, X } from 'lucide-react';
import { GameSettings, WordLength } from '../types';
import { getCategories } from '../categories';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  language: 'pt' | 'en' | 'es';
  triggerSound: (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings,
  language,
  triggerSound
}: SettingsModalProps) {
  if (!isOpen) return null;

  const isPt = language === 'pt';
  const isEs = language === 'es';
  const labelTitle = isPt ? 'Configurações' : isEs ? 'Configuración' : 'Settings';
  const labelLang = isPt ? 'Idioma do Jogo' : isEs ? 'Idioma del Juego' : 'Game Language';
  const labelSound = isPt ? 'Efeitos Sonoros' : isEs ? 'Efectos de Sonido' : 'Sound Effects';
  const labelHardMode = isPt ? 'Modo Difícil' : isEs ? 'Modo Difícil' : 'Hard Mode';
  const labelWordLength = isPt ? 'Letras (Clássico)' : isEs ? 'Letras (Clásico)' : 'Letters (Classic)';
  const labelCategory = isPt ? 'Categoria (Clássico)' : isEs ? 'Categoría (Clásico)' : 'Category (Classic)';
  const labelClassicNote = isPt ? 'Vale a partir da próxima palavra.' : isEs ? 'Se aplica desde la próxima palabra.' : 'Applies from the next word.';
  const labelConsole = isPt ? 'Console do motor' : isEs ? 'Consola del motor' : 'Engine console';
  const labelConsoleDesc = isPt ? 'Mostra um painel com as mensagens internas do jogo.' : isEs ? 'Muestra un panel con los mensajes internos del juego.' : 'Shows a panel with the game\'s internal messages.';
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
    <div id="settings-modal-backdrop" className="absolute inset-0 bg-app/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div 
        id="settings-modal-content"
        className="w-full max-w-sm max-h-full overflow-y-auto bg-surface border border-line rounded p-4 sm:p-6 shadow-xl relative flex flex-col gap-5 select-none"
      >
        {/* Close Button */}
        <button 
          onClick={() => { playSound('click'); onClose(); }}
          className="absolute right-4 top-4 text-muted hover:text-white p-1 rounded hover:bg-line transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <Settings className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{labelTitle}</h2>
        </div>

        {/* Setting Controls */}
        <div className="flex flex-col gap-4 py-1 select-none text-left">
          
          {/* LANGUAGE SELECT */}
          <div className="flex items-center justify-between border-b border-line/40 pb-3">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelLang}</span>
              <span className="text-xs text-muted">
                {isPt ? 'Muda as palavras e os textos do jogo.' : isEs ? 'Cambia las palabras y los textos del juego.' : 'Changes the words and the game text.'}
              </span>
            </div>
            <div className="flex gap-1.5 bg-app p-1 rounded border border-line font-bold text-xs">
              <button
                onClick={() => {
                  playSound('click');
                  setSettings(p => ({ ...p, language: 'pt', category: p.language === 'pt' ? p.category : 'all' }));
                }}
                className={`px-3 py-1 rounded transition-colors font-bold uppercase ${settings.language === 'pt' ? 'bg-emerald-500 text-white' : 'text-muted hover:text-white'}`}
              >
                PT
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setSettings(p => ({ ...p, language: 'en', category: p.language === 'en' ? p.category : 'all' }));
                }}
                className={`px-3 py-1 rounded transition-colors font-bold uppercase ${settings.language === 'en' ? 'bg-emerald-500 text-white' : 'text-muted hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setSettings(p => ({ ...p, language: 'es', category: p.language === 'es' ? p.category : 'all' }));
                }}
                className={`px-3 py-1 rounded transition-colors font-bold uppercase ${settings.language === 'es' ? 'bg-emerald-500 text-white' : 'text-muted hover:text-white'}`}
              >
                ES
              </button>
            </div>
          </div>

          {/* CLASSIC MODE: WORD LENGTH */}
          <div className="flex items-center justify-between gap-3 border-b border-line/40 pb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelWordLength}</span>
              <span className="text-xs text-muted">{labelClassicNote}</span>
            </div>
            <div className="flex gap-1.5 bg-app p-1 rounded border border-line font-bold text-xs shrink-0">
              {([4, 5, 6] as WordLength[]).map(len => (
                <button
                  key={len}
                  onClick={() => {
                    playSound('click');
                    setSettings(p => ({ ...p, wordLength: len }));
                  }}
                  aria-pressed={settings.wordLength === len}
                  className={`px-3 py-1 rounded transition-colors font-bold ${settings.wordLength === len ? 'bg-emerald-500 text-white' : 'text-muted hover:text-white'}`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* CLASSIC MODE: CATEGORY */}
          <div className="flex items-center justify-between gap-3 border-b border-line/40 pb-3">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="settings-category" className="text-xs font-black text-white uppercase tracking-wider">{labelCategory}</label>
              <span className="text-xs text-muted">{labelClassicNote}</span>
            </div>
            <select
              id="settings-category"
              value={settings.category}
              onChange={(e) => {
                playSound('click');
                const category = e.target.value;
                setSettings(p => ({ ...p, category }));
              }}
              className="bg-app border border-line rounded px-2 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500 max-w-[55%]"
            >
              {getCategories(language).map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* AUDIO SOUND EFFECTS */}
          <div className="flex items-center justify-between border-b border-line/40 pb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelSound}</span>
              <span className="text-xs text-muted">
                {isPt ? 'Toca sons durante o jogo.' : isEs ? 'Reproduce sonidos durante el juego.' : 'Plays sounds during the game.'}
              </span>
            </div>
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                settings.soundEnabled 
                  ? 'bg-app border-emerald-500 text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                  : 'bg-app border-line text-muted'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* AUTO CLUE MATCH */}
          <div className="flex items-center justify-between border-b border-line/40 pb-3">
            <div className="flex flex-col gap-0.5 max-w-[75%]">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelAutoClue}</span>
              <span className="text-xs text-muted leading-normal">{labelAutoClueDesc}</span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSettings(prev => ({ ...prev, autoRevealClue: !prev.autoRevealClue }));
              }}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors outline-none flex items-center cursor-pointer ${
                settings.autoRevealClue ? 'bg-emerald-500 justify-end' : 'bg-line justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full shadow bg-white" />
            </button>
          </div>

          {/* HARD MODE MATCH */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex flex-col gap-0.5 max-w-[75%]">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelHardMode}</span>
              <span className="text-xs text-muted leading-normal">
                {isPt 
                  ? 'Letras reveladas (verdes e amarelas) devem ser usadas nos próximos palpites.' 
                  : isEs 
                    ? 'Las letras reveladas (verdes y amarillas) deben usarse en los siguientes intentos.' 
                    : 'Revealed letters (green and yellow) must be used in later guesses.'}
              </span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSettings(prev => ({ ...prev, hardMode: !prev.hardMode }));
              }}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors outline-none flex items-center cursor-pointer ${
                settings.hardMode ? 'bg-emerald-500 justify-end' : 'bg-line justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full shadow bg-white" />
            </button>
          </div>

          {/* ENGINE CONSOLE */}
          <div className="flex items-center justify-between border-t border-line/40 pt-3">
            <div className="flex flex-col gap-0.5 max-w-[75%]">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelConsole}</span>
              <span className="text-xs text-muted leading-normal">{labelConsoleDesc}</span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSettings(prev => ({ ...prev, showConsole: !prev.showConsole }));
              }}
              role="switch"
              aria-checked={settings.showConsole}
              aria-label={labelConsole}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors outline-none flex items-center cursor-pointer ${
                settings.showConsole ? 'bg-emerald-500 justify-end' : 'bg-line justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full shadow bg-white" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
