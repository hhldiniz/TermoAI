// English messages. This file defines the shape every other language must match.
const en = {
  langName: 'English (US)',

  common: {
    close: 'Close',
    confirm: 'Confirm',
    hint: 'Hint:',
    category: 'Category:',
    yourGuess: 'Your guess:',
    newWord: 'New word',
    backToMenu: 'Back to menu',
    points: 'pts',
    difficulty: { 'fácil': 'Easy', 'médio': 'Medium', 'difícil': 'Hard' } as Record<'fácil' | 'médio' | 'difícil', string>
  },

  modes: {
    classic: 'Classic',
    enigma: 'Enigma',
    survival: 'Survival'
  },

  menu: {
    subtitle: 'Choose a game mode.',
    classicBadge: '6 tries',
    classicDesc: 'Guess the 4, 5 or 6-letter word. Colors show how close you are, and there is a hint if you need it.',
    enigmaBadge: '3 minutes',
    enigmaDesc: 'Guess a long word from its clue. Revealing letters costs points, and the clock is ticking.',
    survivalBadge: '3 lives',
    survivalDesc: 'Solve as many words in a row as you can from their clues. Each miss costs one of 3 lives.',
    language: 'Language:',
    switchLanguage: 'Switch language'
  },

  classic: {
    showHint: 'Show hint',
    won: 'You won! 🎉',
    lost: 'You lost 💀',
    nextWord: 'Next word',
    typeLetters: (n: number) => `Type ${n} letters!`,
    onlyLetters: 'Use letters only!',
    notInList: 'Not in word list!',
    letterMustBe: (pos: number, char: string) => `Letter ${pos} must be ${char}!`,
    mustContain: (char: string) => `Guess must contain ${char}!`
  },

  enigma: {
    time: 'Time:',
    score: 'Score:',
    revealLetter: 'Reveal a letter (−15)',
    playAgain: 'Play again',
    placeholder: 'E.G. TECHNOLOGY',
    wrongGuess: 'Wrong guess! −15 points.',
    solvedTitle: 'SOLVED!',
    solvedText: (score: number) => `You solved it with ${score} points!`,
    lostTitle: 'GAME OVER',
    lostText: (word: string) => `The word was ${word}`
  },

  survival: {
    solvedCount: (n: number) => `${n} solved`,
    nextWordIn: 'NEXT WORD IN...',
    placeholder: 'E.G. KEYBOARD',
    wrongGuess: (lives: number) => `Wrong! ${lives} ${lives === 1 ? 'life' : 'lives'} left. Loading the next word...`,
    gameOverMessage: (word: string) => `Game over! The word was ${word}`,
    correctTitle: 'CORRECT!',
    loadingNext: 'Loading the next word...',
    lostTitle: 'GAME OVER!',
    lostText: (streak: number, word: string) => `You solved ${streak} ${streak === 1 ? 'word' : 'words'} in a row! The last word was ${word}.`,
    tryAgain: 'Try again'
  },

  help: {
    titleClassic: 'How to play Termo',
    titleEnigma: 'How to play Enigma',
    titleSurvival: 'How to play Survival',
    classicIntro: (n: number) => `Find the hidden ${n}-letter word in 6 attempts. Each guess must be a valid word. After each guess, tiles change colors to show how close you are:`,
    green: 'GREEN',
    greenDesc: 'The letter is in the word and in the right spot.',
    yellow: 'YELLOW',
    yellowDesc: 'The letter is in the word but in a different spot.',
    gray: 'GRAY',
    orange: 'ORANGE',
    blue: 'BLUE',
    grayDesc: 'The letter is not in the word.',
    enigmaRules: [
      'Guess the hidden word using the category clue.',
      'You start with 100 points and 3 minutes.',
      'Revealing a letter or a wrong guess costs 15 points.',
      'After 5 seconds, you lose 1 point every 3 seconds.',
      'The timer is paused while this window is open.'
    ],
    survivalRules: [
      'Guess the hidden word using the category clue.',
      'You get one guess per word and start with 3 lives.',
      'Each wrong guess costs a life. Solve as many words in a row as you can!'
    ]
  },

  settings: {
    title: 'Settings',
    language: 'Game language',
    languageDesc: 'Changes the words and the game text.',
    wordLength: 'Letters (Classic)',
    category: 'Category (Classic)',
    classicNote: 'Applies from the next word.',
    sound: 'Sound effects',
    soundDesc: 'Plays sounds during the game.',
    autoHint: 'Auto hint',
    autoHintDesc: 'Reveals the word hint automatically after the 3rd guess.',
    hardMode: 'Hard mode',
    hardModeDesc: 'Revealed letters (green and yellow) must be used in later guesses.',
    console: 'Engine console',
    consoleDesc: "Shows a panel with the game's internal messages.",
    highContrast: 'Color-blind mode',
    highContrastDesc: 'Uses orange and blue instead of green and yellow.'
  },

  stats: {
    title: 'Statistics',
    played: 'Played',
    winPct: 'Win %',
    curStreak: 'Streak',
    maxStreak: 'Best streak',
    distribution: 'Guess distribution',
    newGame: 'New game',
    reset: 'Reset stats',
    resetConfirm: 'Are you sure you want to reset all saved statistics?'
  },

  console: {
    title: 'Engine console',
    empty: 'No messages yet.',
    clear: 'Clear'
  },

  a11y: {
    help: 'How to play',
    backspace: 'Delete letter',
    enter: 'Submit guess',
    status: { correct: 'correct', present: 'in the word, wrong spot', incorrect: 'not in the word', empty: '' } as Record<'correct' | 'present' | 'incorrect' | 'empty', string>,
    guessResult: (row: number, letters: string) => `Guess ${row}: ${letters}.`
  },

  log: {
    classicSelected: 'Classic mode selected.',
    wordPicked: (len: number, category: string) => `New word picked: ${len} letters, category ${category}.`,
    hintRevealed: 'Hint revealed.',
    autoHint: 'Hint revealed automatically after the 3rd guess.',
    classicWon: (attempt: number) => `Solved on attempt ${attempt}/6.`,
    classicLost: (word: string) => `Out of attempts. The word was ${word}.`,
    enigmaStarted: 'New Enigma word selected.',
    enigmaWon: (score: number) => `Enigma solved with ${score} points.`,
    enigmaZeroScore: (word: string) => `Enigma lost: no points left. The word was ${word}.`,
    enigmaTimeout: (word: string) => `Enigma lost: time is up. The word was ${word}.`,
    enigmaCriticalScore: 'Enigma score is down to 1 point.',
    enigmaLetterRevealed: (char: string) => `Letter ${char} revealed (−15 points).`,
    survivalStarted: 'Survival started with 3 lives.',
    survivalNextWord: 'Survival: new word loaded.',
    survivalCorrect: (streak: number) => `Correct! Current streak: ${streak}.`,
    survivalOver: (streak: number) => `Survival over. Final streak: ${streak}.`,
    survivalWrong: (guess: string, lives: number) => `Wrong guess: ${guess}. ${lives} ${lives === 1 ? 'life' : 'lives'} left.`,
    statsReset: 'Statistics reset.'
  }
};

export default en;
export type Messages = typeof en;
