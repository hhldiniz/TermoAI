import React from 'react';
import { LetterEvaluation, LetterStatus } from '../types';

interface GameBoardProps {
  guesses: { word: string; evaluations: LetterEvaluation[] }[];
  currentGuess: string;
  maxGuesses: number;
  wordLength: number;
  shakeRowIndex: number | null;
  revealedWord: string | null;
}

export default function GameBoard({
  guesses,
  currentGuess,
  maxGuesses,
  wordLength,
  shakeRowIndex,
  revealedWord
}: GameBoardProps) {
  const rows = Array.from({ length: maxGuesses });

  return (
    <div id="game-board-container" className="flex-1 flex flex-col items-center justify-center px-4 py-0.5 sm:py-2 shrink select-none">
      <div 
        className="flex flex-col gap-1 sm:gap-1.5 w-full transition-all duration-300"
        style={{
          maxWidth: wordLength === 4 
            ? 'min(190px, 24vh)' 
            : wordLength === 5 
              ? 'min(240px, 28vh)' 
              : 'min(290px, 32vh)'
        }}
      >
        {rows.map((_, rowIndex) => {
          const isGuessed = rowIndex < guesses.length;
          const isCurrent = rowIndex === guesses.length;
          const isShake = rowIndex === shakeRowIndex;

          let wordRow = '';
          let evaluationsRow: LetterEvaluation[] = [];

          if (isGuessed) {
            wordRow = guesses[rowIndex].word;
            evaluationsRow = guesses[rowIndex].evaluations;
          } else if (isCurrent) {
            wordRow = currentGuess;
          }

          return (
            <GridRow
              key={rowIndex}
              rowIndex={rowIndex}
              word={wordRow}
              evaluations={evaluationsRow}
              isCurrent={isCurrent}
              isGuessed={isGuessed}
              wordLength={wordLength}
              isShake={isShake}
              revealedWord={rowIndex === guesses.length - 1 && revealedWord ? revealedWord : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

interface GridRowProps {
  key?: React.Key;
  rowIndex: number;
  word: string;
  evaluations: LetterEvaluation[];
  isCurrent: boolean;
  isGuessed: boolean;
  wordLength: number;
  isShake: boolean;
  revealedWord?: string; // Shows proper accents on completed rows
}

function GridRow({
  rowIndex,
  word,
  evaluations,
  isCurrent,
  isGuessed,
  wordLength,
  isShake,
  revealedWord
}: GridRowProps) {
  const cells = Array.from({ length: wordLength });

  return (
    <div 
      style={{
        gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`
      }}
      className={`grid gap-1 sm:gap-1.5 w-full ${isShake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
      id={`board-row-${rowIndex}`}
    >
      {cells.map((_, cellIndex) => {
        const char = word[cellIndex] || '';
        const evaluation = evaluations[cellIndex];
        let status: LetterStatus = 'empty';

        if (isGuessed && evaluation) {
          status = evaluation.status;
        }

        // If the word has been revealed, and this is the winning row, we can display the actual character from that word (showing diacritics like \u00C1) for polish
        let displayChar = char;
        if (isGuessed && revealedWord && revealedWord[cellIndex]) {
          displayChar = revealedWord[cellIndex];
        }

        return (
          <GridCell
            key={cellIndex}
            cellIndex={cellIndex}
            char={displayChar}
            status={status}
            isCurrent={isCurrent}
            isGuessed={isGuessed}
          />
        );
      })}
    </div>
  );
}

interface GridCellProps {
  key?: React.Key;
  cellIndex: number;
  char: string;
  status: LetterStatus;
  isCurrent: boolean;
  isGuessed: boolean;
}

function GridCell({
  cellIndex,
  char,
  status,
  isCurrent,
  isGuessed
}: GridCellProps) {
  // Compute styling based on state
  let bgStyles = "bg-transparent";
  let textStyles = "text-white";
  let borderStyles = "border-2 border-[#3a3a3c]";
  let animationStyles = "";

  if (isGuessed) {
    switch (status) {
      case 'correct':
        bgStyles = "bg-[#10b981]";
        borderStyles = "border-2 border-[#10b981]";
        break;
      case 'present':
        bgStyles = "bg-[#b59f3b]";
        borderStyles = "border-2 border-[#b59f3b]";
        break;
      case 'incorrect':
        bgStyles = "bg-[#3a3a3c]";
        borderStyles = "border-2 border-[#3a3a3c]";
        textStyles = "text-[#818384]";
        break;
    }
    // Flip animations with staggered timing per column index
    animationStyles = "animate-flip";
  } else if (char) {
    bgStyles = "bg-transparent";
    borderStyles = "border-2 border-[#565758]";
    animationStyles = "animate-bounce-pop";
  } else {
    bgStyles = "bg-transparent";
    borderStyles = "border-2 border-[#3a3a3c]/60";
  }

  // Generate clean delay styles so the flip stagger is elegant
  const animationDelay = isGuessed ? `${cellIndex * 150}ms` : '0ms';

  return (
    <div
      className={`aspect-square rounded flex items-center justify-center font-black text-2xl sm:text-3xl transition-all duration-300 ${bgStyles} ${borderStyles} ${textStyles} ${animationStyles}`}
      style={{ 
        animationDelay,
        animationFillMode: isGuessed ? 'backwards' : 'none'
      }}
    >
      <span className="transform-gpu">{char}</span>
    </div>
  );
}
