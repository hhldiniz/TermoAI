import React from 'react';
import { X, HelpCircle } from 'lucide-react';

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

  const isPt = language === 'pt';
  const isEs = language === 'es';
  const t = (pt: string, en: string, es: string) => (isPt ? pt : isEs ? es : en);

  const standardRules = (
    <>
      <p className="mb-2 text-muted font-bold">
        {t(
          `Descubra a palavra secreta de ${wordLength} letras em 6 tentativas. Cada palpite precisa ser uma palavra válida. A cada palpite, a cor do bloco mudará indicando quão perto você chegou:`,
          `Find the hidden ${wordLength}-letter word in 6 attempts. Each guess must be a valid word. After each guess, tiles change colors to show how close you are:`,
          `Descubre la palabra oculta de ${wordLength} letras en 6 intentos. Cada intento debe ser una palabra válida. Después de cada intento, el color de las fichas cambia:`
        )}
      </p>
      <div className="flex flex-col gap-2 font-black uppercase tracking-wider text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-center bg-correct text-white rounded py-0.5">{t('VERDE', 'GREEN', 'VERDE')}</span>
          <span className="text-muted font-semibold tracking-tight normal-case">
            {t('A letra faz parte da palavra e está na posição correta.', 'The letter is in the word and in the right spot.', 'La letra está en la palabra y en la posición correcta.')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-center bg-present text-white rounded py-0.5">{t('AMARELO', 'YELLOW', 'AMARILLO')}</span>
          <span className="text-muted font-semibold tracking-tight normal-case">
            {t('A letra está na palavra, mas em outra posição.', 'The letter is in the word but in a different spot.', 'La letra está en la palabra, pero en una posición diferente.')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-center bg-absent text-absent-fg border border-absent rounded py-0.5">{t('CINZA', 'GRAY', 'GRIS')}</span>
          <span className="text-muted font-semibold tracking-tight normal-case">
            {t('A letra não está na palavra.', 'The letter is not in the word.', 'La letra no está en la palabra.')}
          </span>
        </div>
      </div>
    </>
  );

  const enigmaRules = (
    <ul className="list-disc pl-4 flex flex-col gap-1 text-muted font-bold">
      <li>{t('Adivinhe a palavra escondida usando a dica da categoria.', 'Guess the hidden word using the category clue.', 'Adivina la palabra oculta usando la pista de la categoría.')}</li>
      <li>{t('Você começa com 100 pontos e 3 minutos.', 'You start with 100 points and 3 minutes.', 'Empiezas con 100 puntos y 3 minutos.')}</li>
      <li>{t('Pedir uma letra ou errar a palavra custa 15 pontos.', 'Revealing a letter or a wrong guess costs 15 points.', 'Revelar una letra o fallar la palabra cuesta 15 puntos.')}</li>
      <li>{t('Após 5 segundos, você perde 1 ponto a cada 3 segundos.', 'After 5 seconds, you lose 1 point every 3 seconds.', 'Después de 5 segundos, pierdes 1 punto cada 3 segundos.')}</li>
      <li>{t('O tempo fica pausado enquanto esta janela está aberta.', 'The timer is paused while this window is open.', 'El tiempo se pausa mientras esta ventana está abierta.')}</li>
    </ul>
  );

  const survivalRules = (
    <ul className="list-disc pl-4 flex flex-col gap-1 text-muted font-bold">
      <li>{t('Adivinhe a palavra escondida usando a dica da categoria.', 'Guess the hidden word using the category clue.', 'Adivina la palabra oculta usando la pista de la categoría.')}</li>
      <li>{t('Você tem um palpite por palavra e começa com 3 vidas.', 'You get one guess per word and start with 3 lives.', 'Tienes un intento por palabra y empiezas con 3 vidas.')}</li>
      <li>{t('Cada erro custa uma vida. Acerte o máximo de palavras seguidas!', 'Each wrong guess costs a life. Solve as many words in a row as you can!', 'Cada error cuesta una vida. ¡Acierta tantas palabras seguidas como puedas!')}</li>
    </ul>
  );

  const title = gameMode === 'enigma'
    ? t('Como jogar Enigma', 'How to play Enigma', 'Cómo jugar a Enigma')
    : gameMode === 'survival'
      ? t('Como jogar Sobrevivência', 'How to play Survival', 'Cómo jugar a Supervivencia')
      : t('Como jogar Termo', 'How to play Termo', 'Cómo jugar a Termo');

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
          aria-label={t('Fechar', 'Close', 'Cerrar')}
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
