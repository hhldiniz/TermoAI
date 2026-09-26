import type { Messages } from './en';

// Brazilian Portuguese messages.
const pt: Messages = {
  langName: 'Português (BR)',

  common: {
    close: 'Fechar',
    confirm: 'Confirmar',
    hint: 'Dica:',
    category: 'Categoria:',
    yourGuess: 'Seu palpite:',
    newWord: 'Nova palavra',
    backToMenu: 'Voltar ao menu',
    points: 'pts',
    difficulty: { 'fácil': 'Fácil', 'médio': 'Médio', 'difícil': 'Difícil' }
  },

  modes: {
    classic: 'Clássico',
    enigma: 'Enigma',
    survival: 'Sobrevivência'
  },

  menu: {
    subtitle: 'Escolha um modo de jogo.',
    classicBadge: '6 tentativas',
    classicDesc: 'Descubra a palavra de 4, 5 ou 6 letras. Cores mostram o quão perto você está, e há uma dica se precisar.',
    enigmaBadge: '3 minutos',
    enigmaDesc: 'Descubra uma palavra longa pela dica. Revelar letras custa pontos, e o tempo está correndo.',
    survivalBadge: '3 vidas',
    survivalDesc: 'Acerte o máximo de palavras seguidas pela dica. Cada erro custa uma das 3 vidas.',
    language: 'Idioma:',
    switchLanguage: 'Mudar idioma'
  },

  classic: {
    showHint: 'Mostrar dica',
    won: 'Vitória! 🎉',
    lost: 'Derrota! 💀',
    nextWord: 'Próxima palavra',
    typeLetters: (n) => `Digite ${n} letras!`,
    onlyLetters: 'Use apenas letras!',
    notInList: 'Palavra não aceita!',
    letterMustBe: (pos, char) => `A ${pos}ª letra deve ser ${char}!`,
    mustContain: (char) => `O palpite deve conter ${char}!`
  },

  enigma: {
    time: 'Tempo:',
    score: 'Pontos:',
    revealLetter: 'Revelar uma letra (−15)',
    playAgain: 'Jogar de novo',
    placeholder: 'EX: TECNOLOGIA',
    wrongGuess: 'Palpite incorreto! −15 pontos.',
    solvedTitle: 'RESOLVIDO!',
    solvedText: (score) => `Você acertou com ${score} pontos!`,
    lostTitle: 'FIM DE JOGO',
    lostText: (word) => `A palavra era ${word}`
  },

  survival: {
    solvedCount: (n) => `${n} ${n === 1 ? 'acerto' : 'acertos'}`,
    nextWordIn: 'PRÓXIMA PALAVRA EM...',
    placeholder: 'EX: COMPUTADOR',
    wrongGuess: (lives) => `Incorreto! ${lives === 1 ? 'Resta 1 vida' : `Restam ${lives} vidas`}. Carregando a próxima palavra...`,
    gameOverMessage: (word) => `Fim de jogo! A palavra era ${word}`,
    correctTitle: 'ACERTOU!',
    loadingNext: 'Carregando a próxima palavra...',
    lostTitle: 'FIM DE JOGO!',
    lostText: (streak, word) => `Você acertou ${streak} ${streak === 1 ? 'palavra' : 'palavras'} seguidas! A última palavra era ${word}.`,
    tryAgain: 'Tentar novamente'
  },

  help: {
    titleClassic: 'Como jogar Termo',
    titleEnigma: 'Como jogar Enigma',
    titleSurvival: 'Como jogar Sobrevivência',
    classicIntro: (n) => `Descubra a palavra secreta de ${n} letras em 6 tentativas. Cada palpite precisa ser uma palavra válida. A cada palpite, a cor do bloco mudará indicando quão perto você chegou:`,
    green: 'VERDE',
    greenDesc: 'A letra faz parte da palavra e está na posição correta.',
    yellow: 'AMARELO',
    yellowDesc: 'A letra está na palavra, mas em outra posição.',
    gray: 'CINZA',
    orange: 'LARANJA',
    blue: 'AZUL',
    grayDesc: 'A letra não está na palavra.',
    enigmaRules: [
      'Adivinhe a palavra escondida usando a dica da categoria.',
      'Você começa com 100 pontos e 3 minutos.',
      'Pedir uma letra ou errar a palavra custa 15 pontos.',
      'Após 5 segundos, você perde 1 ponto a cada 3 segundos.',
      'O tempo fica pausado enquanto esta janela está aberta.'
    ],
    survivalRules: [
      'Adivinhe a palavra escondida usando a dica da categoria.',
      'Você tem um palpite por palavra e começa com 3 vidas.',
      'Cada erro custa uma vida. Acerte o máximo de palavras seguidas!'
    ]
  },

  settings: {
    title: 'Configurações',
    language: 'Idioma do jogo',
    languageDesc: 'Muda as palavras e os textos do jogo.',
    wordLength: 'Letras (Clássico)',
    category: 'Categoria (Clássico)',
    classicNote: 'Vale a partir da próxima palavra.',
    sound: 'Efeitos sonoros',
    soundDesc: 'Toca sons durante o jogo.',
    autoHint: 'Dica automática',
    autoHintDesc: 'Revela a dica da palavra após a 3ª tentativa.',
    hardMode: 'Modo difícil',
    hardModeDesc: 'Letras reveladas (verdes e amarelas) devem ser usadas nos próximos palpites.',
    console: 'Console do motor',
    consoleDesc: 'Mostra um painel com as mensagens internas do jogo.',
    highContrast: 'Modo daltônico',
    highContrastDesc: 'Usa laranja e azul no lugar de verde e amarelo.'
  },

  stats: {
    title: 'Estatísticas',
    played: 'Jogos',
    winPct: 'Vitórias',
    curStreak: 'Seq. atual',
    maxStreak: 'Seq. máx.',
    distribution: 'Distribuição de tentativas',
    newGame: 'Novo jogo',
    reset: 'Limpar dados',
    resetConfirm: 'Deseja mesmo apagar todas as estatísticas salvas?'
  },

  console: {
    title: 'Console do motor',
    empty: 'Nenhuma mensagem ainda.',
    clear: 'Limpar'
  },

  a11y: {
    help: 'Como jogar',
    backspace: 'Apagar letra',
    enter: 'Enviar palpite',
    status: { correct: 'correta', present: 'na palavra, posição errada', incorrect: 'não está na palavra', empty: '' },
    guessResult: (row, letters) => `Palpite ${row}: ${letters}.`
  },

  log: {
    classicSelected: 'Modo Clássico selecionado.',
    wordPicked: (len, category) => `Nova palavra escolhida: ${len} letras, categoria ${category}.`,
    hintRevealed: 'Dica revelada.',
    autoHint: 'Dica revelada automaticamente após a 3ª tentativa.',
    classicWon: (attempt) => `Acertou na tentativa ${attempt}/6.`,
    classicLost: (word) => `Tentativas esgotadas. A palavra era ${word}.`,
    enigmaStarted: 'Nova palavra do Enigma escolhida.',
    enigmaWon: (score) => `Enigma resolvido com ${score} pontos.`,
    enigmaZeroScore: (word) => `Enigma perdido: os pontos acabaram. A palavra era ${word}.`,
    enigmaTimeout: (word) => `Enigma perdido: o tempo acabou. A palavra era ${word}.`,
    enigmaCriticalScore: 'A pontuação do Enigma chegou a 1 ponto.',
    enigmaLetterRevealed: (char) => `Letra ${char} revelada (−15 pontos).`,
    survivalStarted: 'Sobrevivência iniciada com 3 vidas.',
    survivalNextWord: 'Sobrevivência: nova palavra carregada.',
    survivalCorrect: (streak) => `Correto! Sequência atual: ${streak}.`,
    survivalOver: (streak) => `Sobrevivência encerrada. Sequência final: ${streak}.`,
    survivalWrong: (guess, lives) => `Palpite errado: ${guess}. ${lives === 1 ? 'Resta 1 vida' : `Restam ${lives} vidas`}.`,
    statsReset: 'Estatísticas apagadas.'
  }
};

export default pt;
