import type { Messages } from './en';

// Spanish messages.
const es: Messages = {
  langName: 'Español (ES)',

  common: {
    close: 'Cerrar',
    confirm: 'Confirmar',
    hint: 'Pista:',
    category: 'Categoría:',
    yourGuess: 'Tu respuesta:',
    newWord: 'Nueva palabra',
    backToMenu: 'Volver al menú',
    points: 'pts',
    difficulty: { 'fácil': 'Fácil', 'médio': 'Media', 'difícil': 'Difícil' }
  },

  modes: {
    classic: 'Clásico',
    enigma: 'Enigma',
    survival: 'Supervivencia'
  },

  menu: {
    subtitle: 'Elige un modo de juego.',
    classicBadge: '6 intentos',
    classicDesc: 'Adivina la palabra de 4, 5 o 6 letras. Los colores muestran lo cerca que estás, y hay una pista si la necesitas.',
    enigmaBadge: '3 minutos',
    enigmaDesc: 'Adivina una palabra larga con la pista. Revelar letras cuesta puntos, y el tiempo corre.',
    survivalBadge: '3 vidas',
    survivalDesc: 'Acierta tantas palabras seguidas como puedas. Tienes 3 intentos por palabra; agotarlos cuesta una de las 3 vidas.',
    language: 'Idioma:',
    switchLanguage: 'Cambiar idioma'
  },

  classic: {
    showHint: 'Mostrar pista',
    won: '¡Victoria! 🎉',
    lost: '¡Derrota! 💀',
    nextWord: 'Siguiente palabra',
    typeLetters: (n) => `¡Escribe ${n} letras!`,
    onlyLetters: '¡Usa solo letras!',
    notInList: '¡Palabra no válida!',
    letterMustBe: (pos, char) => `¡La ${pos}.ª letra debe ser ${char}!`,
    mustContain: (char) => `¡El intento debe contener ${char}!`,
    share: 'Compartir',
    copied: '¡Resultado copiado!',
    shareTitle: (result) => `TermoAI ${result}`
  },

  enigma: {
    time: 'Tiempo:',
    score: 'Puntos:',
    revealLetter: 'Revelar una letra (−15)',
    playAgain: 'Jugar de nuevo',
    placeholder: 'EJ.: TECNOLOGÍA',
    wrongGuess: '¡Respuesta incorrecta! −15 puntos.',
    solvedTitle: '¡RESUELTO!',
    solvedText: (score) => `¡Acertaste con ${score} puntos!`,
    lostTitle: 'FIN DEL JUEGO',
    lostText: (word) => `La palabra era ${word}`
  },

  survival: {
    solvedCount: (n) => `${n} ${n === 1 ? 'acierto' : 'aciertos'}`,
    nextWordIn: 'SIGUIENTE PALABRA EN...',
    placeholder: 'EJ.: ORDENADOR',
    wrongGuess: (lives) => `¡Sin intentos! ${lives === 1 ? 'Queda 1 vida' : `Quedan ${lives} vidas`}. Cargando la siguiente palabra...`,
    wrongAttempt: (tries) => `¡Casi! ${tries === 1 ? 'Queda 1 intento' : `Quedan ${tries} intentos`} para esta palabra. Las letras en su posición ya se muestran.`,
    tries: 'Intentos:',
    gameOverMessage: (word) => `¡Fin del juego! La palabra era ${word}`,
    correctTitle: '¡CORRECTO!',
    loadingNext: 'Cargando la siguiente palabra...',
    lostTitle: '¡FIN DEL JUEGO!',
    lostText: (streak, word) => `¡Acertaste ${streak} ${streak === 1 ? 'palabra' : 'palabras'} seguidas! La última palabra era ${word}.`,
    tryAgain: 'Intentar de nuevo'
  },

  help: {
    titleClassic: 'Cómo jugar a Termo',
    titleEnigma: 'Cómo jugar a Enigma',
    titleSurvival: 'Cómo jugar a Supervivencia',
    classicIntro: (n) => `Descubre la palabra oculta de ${n} letras en 6 intentos. Cada intento debe ser una palabra válida. Después de cada intento, el color de las fichas cambia para mostrar lo cerca que estás:`,
    green: 'VERDE',
    greenDesc: 'La letra está en la palabra y en la posición correcta.',
    yellow: 'AMARILLO',
    yellowDesc: 'La letra está en la palabra, pero en una posición diferente.',
    gray: 'GRIS',
    orange: 'NARANJA',
    blue: 'AZUL',
    grayDesc: 'La letra no está en la palabra.',
    enigmaRules: [
      'Adivina la palabra oculta usando la pista de la categoría.',
      'Empiezas con 100 puntos y 3 minutos.',
      'Revelar una letra o fallar la palabra cuesta 15 puntos.',
      'Después de 5 segundos, pierdes 1 punto cada 3 segundos.',
      'El tiempo se pausa mientras esta ventana está abierta.'
    ],
    survivalRules: [
      'Adivina la palabra oculta usando la pista de la categoría.',
      'Tienes 3 intentos por palabra y empiezas con 3 vidas.',
      'Un intento fallido revela las letras que pusiste en su posición.',
      'Agotar los 3 intentos de una palabra cuesta una vida. ¡Acierta tantas palabras seguidas como puedas!'
    ]
  },

  settings: {
    title: 'Configuración',
    language: 'Idioma del juego',
    languageDesc: 'Cambia las palabras y los textos del juego.',
    wordLength: 'Letras (Clásico)',
    category: 'Categoría (Clásico)',
    classicNote: 'Se aplica desde la próxima palabra.',
    sound: 'Efectos de sonido',
    soundDesc: 'Reproduce sonidos durante el juego.',
    autoHint: 'Pista automática',
    autoHintDesc: 'Revela la pista de la palabra tras el 3.er intento.',
    hardMode: 'Modo difícil',
    hardModeDesc: 'Las letras reveladas (verdes y amarillas) deben usarse en los siguientes intentos.',
    highContrast: 'Modo daltónico',
    highContrastDesc: 'Usa naranja y azul en lugar de verde y amarillo.'
  },

  stats: {
    title: 'Estadísticas',
    played: 'Partidas',
    winPct: 'Victorias',
    curStreak: 'Racha',
    maxStreak: 'Mejor racha',
    distribution: 'Distribución de intentos',
    newGame: 'Nuevo juego',
    reset: 'Restablecer',
    resetConfirm: '¿Seguro que quieres borrar todas las estadísticas guardadas?',
    won: 'Victorias',
    bestScore: 'Mejor puntuación',
    runs: 'Partidas',
    bestStreak: 'Mejor racha'
  },

  confirm: {
    title: '¿Salir de este juego?',
    body: 'Se perderá el progreso de este juego.',
    leave: 'Salir',
    stay: 'Seguir jugando'
  },


  a11y: {
    help: 'Cómo jugar',
    backspace: 'Borrar letra',
    enter: 'Enviar intento',
    status: { correct: 'correcta', present: 'en la palabra, posición incorrecta', incorrect: 'no está en la palabra', empty: '' },
    guessResult: (row, letters) => `Intento ${row}: ${letters}.`,
    classicLost: (word) => `Sin intentos. La palabra era ${word}.`,
    enigmaZeroScore: (word) => `Enigma perdido: sin puntos. La palabra era ${word}.`,
    enigmaTimeout: (word) => `Enigma perdido: se acabó el tiempo. La palabra era ${word}.`,
    enigmaLetterRevealed: (char) => `Letra ${char} revelada (−15 puntos).`,
    survivalCorrect: (streak) => `¡Correcto! Racha actual: ${streak}.`
  }
};

export default es;
