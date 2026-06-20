import React, { useState, useEffect, useCallback } from 'react';
import { HelpCircle, BarChart3, Settings, AlertCircle, RefreshCw, Cpu, Check, HelpCircle as HelpIcon, Sparkles, Heart, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus, LetterEvaluation, LetterStatus, GameStats, GameSettings, LLMConfig, LLMLog, WordData } from './types';
import { generateWordOffline, normalizeText, isValidGuess, getWordsByLanguage, getRandomLargeWord, LargeWordData } from './words';
import { playSound } from './utils/audio';

// Components
import AndroidFrame from './components/AndroidFrame';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import LLMConsole from './components/LLMConsole';
import StatsModal from './components/StatsModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  // 1. Initial Default Configuration States
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('termo_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load settings from storage", e);
    }
    return {
      language: 'pt',
      soundEnabled: true,
      hardMode: false,
      autoRevealClue: true
    };
  });

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('termo_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load statistics from storage", e);
    }
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessesDistribution: [0, 0, 0, 0, 0, 0]
    };
  });

  // Persist settings changes
  useEffect(() => {
    localStorage.setItem('termo_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist stats changes
  useEffect(() => {
    localStorage.setItem('termo_stats', JSON.stringify(stats));
  }, [stats]);

  const isPt = settings.language === 'pt';

  // Play Sound helper safeguarding settings toggle
  const triggerSound = useCallback((type: 'click' | 'flip' | 'win' | 'lose' | 'error') => {
    playSound(type, settings.soundEnabled);
  }, [settings.soundEnabled]);

  // 2. Core Game Logic States
  const [activeWord, setActiveWord] = useState<WordData | null>(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<{ word: string; evaluations: LetterEvaluation[] }[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  
  // Clues/Hints Oracle State
  const [revealedCount, setRevealedCount] = useState(0);
  const [shakedRowIndex, setShakedRowIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- MULTI-GAME MODE SYSTEM ---
  const [gameMode, setGameMode] = useState<'menu' | 'standard' | 'enigma' | 'survival'>('menu');

  // --- SURVIVAL MODE STATES ---
  const [survivalWord, setSurvivalWord] = useState<LargeWordData | null>(null);
  const [survivalRevealedLetters, setSurvivalRevealedLetters] = useState<string[]>([]);
  const [survivalGuesses, setSurvivalGuesses] = useState<string[]>([]);
  const [survivalInput, setSurvivalInput] = useState('');
  const [survivalLives, setSurvivalLives] = useState(3);
  const [survivalStreak, setSurvivalStreak] = useState(0);
  const [survivalStatus, setSurvivalStatus] = useState<GameStatus>('playing');
  const [survivalMessage, setSurvivalMessage] = useState<string | null>(null);
  const [isSurvivalTransitioning, setIsSurvivalTransitioning] = useState(false);

  const startSurvivalGame = () => {
    setSurvivalStreak(0);
    setSurvivalLives(3);
    setGameMode('survival');
    triggerSound('click');
    loadNextSurvivalWord(true);
  };

  const loadNextSurvivalWord = (isFresh = false) => {
    const wordObj = getRandomLargeWord(settings.language);
    setSurvivalWord(wordObj);
    setSurvivalRevealedLetters([]);
    setSurvivalGuesses([]);
    setSurvivalInput('');
    setSurvivalStatus('playing');
    setSurvivalMessage(null);
    setIsSurvivalTransitioning(false);
    if (!isFresh) {
      pushLog('system', isPt ? `Sobrevivência: Nova palavra carregada.` : `Survival: New word loaded.`);
    } else {
      pushLog('system', isPt ? 'Arquitetura de Sobrevivência ativada. 3 Vidas restantes!' : 'Survival computing mode active. 3 Lives allocated!');
    }
  };

  const submitSurvivalFullGuess = () => {
    if (!survivalWord || survivalStatus !== 'playing' || isSurvivalTransitioning) return;
    const cleanGuess = normalizeText(survivalInput);
    if (!cleanGuess) return;

    if (cleanGuess === normalizeText(survivalWord.word)) {
      setSurvivalStatus('won');
      triggerSound('win');
      setSurvivalRevealedLetters(survivalWord.word.split(''));
      setSurvivalInput('');
      setSurvivalMessage(null);
      setSurvivalStreak(prev => prev + 1);
      pushLog('success', isPt 
        ? `Incrível! Palavra correta! Sequência atual: ${survivalStreak + 1} acertos.`
        : `Outstanding! Correct word! Current streak: ${survivalStreak + 1} solved.`
      );
      
      setIsSurvivalTransitioning(true);
      // Auto transition to next word in 2.5 seconds
      setTimeout(() => {
        setSurvivalStatus(prevStatus => {
          if (prevStatus === 'won') {
            loadNextSurvivalWord(false);
          }
          return prevStatus;
        });
      }, 2500);

    } else {
      triggerSound('error');
      setSurvivalGuesses(prev => {
        if (prev.includes(cleanGuess)) return prev;
        return [...prev, cleanGuess];
      });
      
      setSurvivalLives(prevLives => {
        const nextLives = Math.max(0, prevLives - 1);
        if (nextLives === 0) {
          setSurvivalStatus('lost');
          triggerSound('lose');
          setSurvivalMessage(isPt ? `Game Over! Palavra extra: ${survivalWord.word}` : `Game Over! Extra word was: ${survivalWord.word}`);
          pushLog('warning', isPt
            ? `Histórico de sobrevivência finalizado! Sequência obtida: ${survivalStreak} acertos.`
            : `Survival sequence finished! Final streak: ${survivalStreak} solved.`
          );
        } else {
          setSurvivalMessage(isPt 
            ? `Incorreto! Restam ${nextLives} vidas. Carregando próxima palavra...` 
            : `Incorrect! ${nextLives} lives left. Loading next word...`
          );
          pushLog('info', isPt 
            ? `Erro de digitação: [${cleanGuess}]. Restam ${nextLives} vidas.` 
            : `Mispelled: [${cleanGuess}]. ${nextLives} lives remaining.`
          );
          
          setIsSurvivalTransitioning(true);
          // Auto transition to next word in 2.5 seconds
          setTimeout(() => {
            loadNextSurvivalWord(false);
          }, 2500);
        }
        return nextLives;
      });
      setSurvivalInput('');
    }
  };

  // LLM Engine Console States
  const [logs, setLogs] = useState<LLMLog[]>([]);

  const pushLog = useCallback((type: 'system' | 'info' | 'success' | 'warning' | 'token', message: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(p => [...p, { timestamp: timeStr, type, message }]);
  }, []);

  // Enigma Mode States
  const [enigmaWord, setEnigmaWord] = useState<LargeWordData | null>(null);
  const [enigmaRevealedLetters, setEnigmaRevealedLetters] = useState<string[]>([]);
  const [enigmaGuesses, setEnigmaGuesses] = useState<string[]>([]);
  const [enigmaScore, setEnigmaScore] = useState(100);
  const [enigmaInput, setEnigmaInput] = useState('');
  const [enigmaStatus, setEnigmaStatus] = useState<GameStatus>('playing');
  const [enigmaMessage, setEnigmaMessage] = useState<string | null>(null);
  const [enigmaTimeLeft, setEnigmaTimeLeft] = useState(180);

  const startEnigmaGame = () => {
    const wordObj = getRandomLargeWord(settings.language);
    setEnigmaWord(wordObj);
    setEnigmaRevealedLetters([]);
    setEnigmaGuesses([]);
    setEnigmaScore(100);
    setEnigmaInput('');
    setEnigmaStatus('playing');
    setEnigmaMessage(null);
    setEnigmaTimeLeft(180);
    setGameMode('enigma');
    triggerSound('click');
    pushLog('system', isPt ? 'Nova palavra Enigma selecionada para desencriptação.' : 'New Enigma secret word selected for signal decrypting.');
  };

  const submitEnigmaFullGuess = () => {
    if (!enigmaWord || enigmaStatus !== 'playing') return;
    const cleanGuess = normalizeText(enigmaInput);
    if (!cleanGuess) return;

    if (cleanGuess === normalizeText(enigmaWord.word)) {
      setEnigmaStatus('won');
      triggerSound('win');
      setEnigmaRevealedLetters(enigmaWord.word.split(''));
      setEnigmaInput('');
      setEnigmaMessage(null);
      pushLog('success', isPt 
        ? `Parabéns! Enigma resolvido com sucesso! Pontuação Final: ${enigmaScore} pts.`
        : `Congratulations! Decryption resolved with positive signal! Score: ${enigmaScore} pts.`
      );
    } else {
      triggerSound('error');
      setEnigmaGuesses(prev => {
        if (prev.includes(cleanGuess)) return prev;
        return [...prev, cleanGuess];
      });
      setEnigmaMessage(isPt ? 'Palpite incorreto! -15 Pontos.' : 'Incorrect full word answer! -15 pts.');
      setEnigmaScore(prev => Math.max(0, prev - 15));
      setEnigmaInput('');
      
      setTimeout(() => {
        setEnigmaMessage(null);
      }, 3000);
    }
  };

  // Track Enigma zero score game over
  useEffect(() => {
    if (gameMode === 'enigma' && enigmaStatus === 'playing' && enigmaScore <= 0) {
      setEnigmaStatus('lost');
      triggerSound('lose');
      pushLog('warning', isPt 
        ? `Insucesso! Pontuação esgotada para decodificação Enigma. A palavra era: ${enigmaWord?.word}` 
        : `Decompiled zero energy! Word has not been successfully extracted: ${enigmaWord?.word}`
      );
    }
  }, [enigmaScore, enigmaStatus, gameMode, enigmaWord, isPt, triggerSound, pushLog]);

  // Enigma Countdown Timer and Progressive Score Loss
  useEffect(() => {
    if (gameMode !== 'enigma' || enigmaStatus !== 'playing') {
      return;
    }

    const intervalId = setInterval(() => {
      setEnigmaTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setEnigmaStatus('lost');
          triggerSound('lose');
          pushLog('warning', isPt 
            ? `Insucesso! O tempo limite de 3 minutos expirou para a decodificação Enigma. A palavra era: ${enigmaWord?.word}` 
            : `Decryption timeout! The 3-minute limit expired. The secret word was: ${enigmaWord?.word}`
          );
          return 0;
        }

        const updatedTime = prevTime - 1;
        const elapsedSeconds = 180 - updatedTime;

        // Progressive score loss: deduct 1 point every 3 seconds, excluding the first 5 seconds
        if (elapsedSeconds > 5 && updatedTime % 3 === 0) {
          setEnigmaScore((prevScore) => {
            const nextScore = Math.max(1, prevScore - 1);
            if (nextScore === 1 && prevScore > 1) {
              pushLog('token', isPt ? 'Alerta: Escore Enigma no nível crítico de 1 ponto!' : 'Alert: Enigma score reached critical level of 1 point!');
            }
            return nextScore;
          });
        }

        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameMode, enigmaStatus, enigmaWord, isPt, triggerSound, pushLog]);

  // Modal Triggers
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // LLM Engine Console States
  const [config, setConfig] = useState<LLMConfig>({
    modelName: 'TermoLLM-0.12B-Mobile',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 5,
    category: 'all',
    difficulty: 'medium'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const wordLength = activeWord 
    ? activeWord.word.length 
    : (config.difficulty === 'easy' ? 4 : config.difficulty === 'medium' ? 5 : 6);

  // 3. Simulated Token Generation sequence (Local LLM Simulation)
  const generateNewWord = useCallback((customCategory?: string, customTemp?: number) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setRevealedCount(0);
    setErrorMessage(null);
    setActiveWord(null);

    const targetCategory = customCategory ?? config.category;
    const targetTemp = customTemp ?? config.temperature;
    const targetDifficulty = config.difficulty;

    const initialLogs: { type: 'system' | 'info' | 'success' | 'warning' | 'token'; msg: string; delay: number }[] = [
      { type: 'system', msg: isPt ? 'Iniciando TermoLLM-0.12B offline...' : 'Initializing TermoLLM-0.12B offline mode...', delay: 0 },
      { type: 'info', msg: isPt ? 'Verificando memória VRAM dedicada...' : 'Allocating local container memory frames...', delay: 150 },
      { type: 'info', msg: isPt ? 'Carga de pesos da GPU ativa [Q4_K_M quantum: 98.4MB]' : 'Weight tensors uploaded successfully [Q4_K_M quantum: 98.4MB]', delay: 350 },
      { type: 'system', msg: isPt ? `Filtros: Categoria = [${targetCategory}], Temp = [${targetTemp}], Nível = [${targetDifficulty.toUpperCase()}]` : `Attention nodes: Category = [${targetCategory}], Temp = [${targetTemp}], Level = [${targetDifficulty.toUpperCase()}]`, delay: 600 },
      { type: 'info', msg: isPt ? `Realizando amostragem probabilistic de tokens no vocabulário de ${targetDifficulty === 'easy' ? 4 : targetDifficulty === 'medium' ? 5 : 6} letras...` : `Executing probabilistic token distribution over ${targetDifficulty === 'easy' ? 4 : targetDifficulty === 'medium' ? 5 : 6}-letter vocabulary...`, delay: 850 },
      { type: 'token', msg: 'GENERATING SECRET WORD TOKEN SEQUENCE...', delay: 1100 }
    ];

    // Stream logs with timeouts to simulate authentic compilation
    initialLogs.forEach((l) => {
      setTimeout(() => {
        pushLog(l.type, l.msg);
      }, l.delay);
    });

    // Solve for the random word utilizing temperature sampling and selected difficulty
    const solvedWord = generateWordOffline(settings.language, targetCategory, targetTemp, targetDifficulty);

    // Final streams and word binding
    setTimeout(() => {
      const chars = solvedWord.word.split('');
      chars.forEach((char, index) => {
        setTimeout(() => {
          pushLog('token', `Decoded token index [${index}]: '${char}'`);
        }, index * 120);
      });

      setTimeout(() => {
        setActiveWord(solvedWord);
        setIsGenerating(false);
        pushLog('success', isPt 
          ? `Mecanismo bloqueado com sucesso. Nível de Dificuldade: ${targetDifficulty.toUpperCase()} (${solvedWord.word.length} letras). Pronto para jogar!` 
          : `Engine state locked successfully. Difficulty Level: ${targetDifficulty.toUpperCase()} (${solvedWord.word.length} letters). Ready to solve!`
        );
      }, chars.length * 120 + 100);

    }, 1300);

  }, [config.category, config.temperature, config.difficulty, settings.language, isPt, pushLog, isGenerating]);

  // Bootstrapping the initial offline word load on startup
  useEffect(() => {
    generateNewWord();
    // Clear console terminal to avoid visual bloating on startup
    setTimeout(() => {
      setLogs(p => p.slice(-4));
    }, 4000);
  }, []);

  // 4. Input Shaking & Alert Manager
  const triggerErrorShaking = () => {
    triggerSound('error');
    setShakedRowIndex(guesses.length);
    setTimeout(() => {
      setShakedRowIndex(null);
    }, 450);
  };

  const showAlert = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3500);
  };

  // 5. Letter Keypad Evaluation algorithm
  const evaluateGuess = (guessWord: string): LetterEvaluation[] => {
    if (!activeWord) return [];
    
    const target = normalizeText(activeWord.word);
    const guess = normalizeText(guessWord);

    const targetLetters = target.split('');
    const guessLetters = guess.split('');

    const evaluations: LetterEvaluation[] = Array(5).fill(null).map((_, i) => ({
      char: guessLetters[i],
      status: 'incorrect'
    }));

    // Tracks remaining letters available for yellow matching to avoid triple-lighting letters
    const targetCount: Record<string, number> = {};
    for (const char of targetLetters) {
      targetCount[char] = (targetCount[char] || 0) + 1;
    }

    // Passes 1: Green exact hits matching
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        evaluations[i].status = 'correct';
        targetCount[guessLetters[i]]--;
      }
    }

    // Passes 2: Yellow displaced elements matching
    for (let i = 0; i < 5; i++) {
      if (evaluations[i].status !== 'correct') {
        const char = guessLetters[i];
        if (targetCount[char] && targetCount[char] > 0) {
          evaluations[i].status = 'present';
          targetCount[char]--;
        }
      }
    }

    return evaluations;
  };

  // Submit currentGuess row
  const handleSubmitGuess = () => {
    if (isGenerating || gameStatus !== 'playing') return;
    if (!activeWord) return;

    const normalizedGuess = normalizeText(currentGuess);

    // Validate size
    if (normalizedGuess.length !== wordLength) {
      showAlert(isPt ? `Digite ${wordLength} letras!` : `Guess must be exactly ${wordLength} letters!`);
      triggerErrorShaking();
      return;
    }

    // Validate standard alpha characters
    if (!/^[A-ZÇ]+$/.test(normalizedGuess) || normalizedGuess.length !== wordLength) {
      showAlert(isPt ? 'Use apenas letras normais!' : 'Only valid alphabet characters are accepted!');
      triggerErrorShaking();
      return;
    }

    // Hard Mode Validation
    if (settings.hardMode && guesses.length > 0) {
      const lastEval = guesses[guesses.length - 1].evaluations;
      for (let i = 0; i < wordLength; i++) {
        // Correct position condition
        if (lastEval[i].status === 'correct' && normalizedGuess[i] !== lastEval[i].char) {
          showAlert(isPt 
            ? `A ${i+1}ª letra deve ser ${lastEval[i].char}!` 
            : `The ${i+1}th character must be ${lastEval[i].char}!`);
          triggerErrorShaking();
          return;
        }
      }
    }

    const evaluationResult = evaluateGuess(normalizedGuess);
    const nextGuesses = [...guesses, { word: normalizedGuess, evaluations: evaluationResult }];
    
    triggerSound('flip');
    setGuesses(nextGuesses);
    setCurrentGuess('');

    const isMatch = normalizedGuess === normalizeText(activeWord.word);

    // Check Win/Loss
    if (isMatch) {
      setGameStatus('won');
      triggerSound('win');
      pushLog('success', isPt 
        ? `Incrível! Palavra encontrada na tentativa ${nextGuesses.length}/6.` 
        : `Outstanding performance! Match resolved in attempt ${nextGuesses.length}/6.`
      );
      
      // Update persistent stats
      setStats(prev => {
        const dist = [...prev.guessesDistribution];
        const attemptIdx = nextGuesses.length - 1;
        if (attemptIdx >= 0 && attemptIdx < 6) {
          dist[attemptIdx] = (dist[attemptIdx] || 0) + 1;
        }
        const streak = prev.currentStreak + 1;
        const maxStreak = Math.max(prev.maxStreak, streak);
        return {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: prev.gamesWon + 1,
          currentStreak: streak,
          maxStreak,
          guessesDistribution: dist
        };
      });

      // Stagger stats popup
      setTimeout(() => {
        setIsStatsOpen(true);
      }, 1200);

    } else if (nextGuesses.length >= 6) {
      setGameStatus('lost');
      triggerSound('lose');
      pushLog('warning', isPt 
        ? `Palpites esgotados! A palavra secreta era: ${activeWord.word}` 
        : `Attempts exhausted! The secret word was: ${activeWord.word}`
      );

      setStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        currentStreak: 0
      }));

      setTimeout(() => {
        setIsStatsOpen(true);
      }, 1200);
    } else {
      // Game continues. Give visual hints if auto reveal conditions match
      if (settings.autoRevealClue && nextGuesses.length === 3) {
        setRevealedCount(1); // Auto unlock clue
        pushLog('info', isPt 
          ? `[Auto-Dica]: Clue revelado para apoio cognitivo.` 
          : `[Auto-Hint]: Semantic clue unlocked for cognitive alignment.`
        );
      }
    }
  };

  // Key press processor
  const handleKeyPress = useCallback((key: string) => {
    const normalizedKey = key.toUpperCase();

    if (gameMode === 'survival') {
      if (survivalStatus !== 'playing' || isSurvivalTransitioning) return;
      if (normalizedKey === 'BACKSPACE') {
        setSurvivalInput(prev => prev.slice(0, -1));
      } else if (normalizedKey === 'ENTER') {
        submitSurvivalFullGuess();
      } else if (/^[A-ZÇ]$/.test(normalizedKey)) {
        const mL = survivalWord ? survivalWord.word.length : 15;
        if (survivalInput.length < mL) {
          const sanitized = normalizedKey === 'Ç' && !isPt ? 'C' : normalizedKey;
          setSurvivalInput(prev => prev + sanitized);
        }
      }
      return;
    }

    if (gameMode === 'enigma') {
      if (enigmaStatus !== 'playing') return;
      if (normalizedKey === 'BACKSPACE') {
        setEnigmaInput(prev => prev.slice(0, -1));
      } else if (normalizedKey === 'ENTER') {
        submitEnigmaFullGuess();
      } else if (/^[A-ZÇ]$/.test(normalizedKey)) {
        const mL = enigmaWord ? enigmaWord.word.length : 15;
        if (enigmaInput.length < mL) {
          const sanitized = normalizedKey === 'Ç' && !isPt ? 'C' : normalizedKey;
          setEnigmaInput(prev => prev + sanitized);
        }
      }
      return;
    }

    if (isGenerating || gameStatus !== 'playing') return;

    if (normalizedKey === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (normalizedKey === 'ENTER') {
      handleSubmitGuess();
    } else if (/^[A-ZÇ]$/.test(normalizedKey) && currentGuess.length < wordLength) {
      // Filter ç into c if English mode, allow otherwise
      const sanitized = normalizedKey === 'Ç' && !isPt ? 'C' : normalizedKey;
      setCurrentGuess(prev => prev + sanitized);
    }
  }, [
    currentGuess, isGenerating, gameStatus, isPt, guesses.length, gameMode, 
    enigmaStatus, enigmaWord, enigmaInput, submitEnigmaFullGuess,
    survivalStatus, survivalWord, survivalInput, submitSurvivalFullGuess, isSurvivalTransitioning
  ]);

  // Capturing physical machine keyboard keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (isStatsOpen || isSettingsOpen) return;

      const key = e.key.toUpperCase();
      if (key === 'ESCAPE') {
        setIsStatsOpen(false);
        setIsSettingsOpen(false);
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
      } else if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (/^[A-ZÇ]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, isStatsOpen, isSettingsOpen]);

  // Accumulate highlighted statuses per character key
  const letterStatuses: Record<string, LetterStatus> = {};
  guesses.forEach(attempt => {
    attempt.evaluations.forEach(evalNode => {
      const char = evalNode.char;
      const currentStatus = letterStatuses[char];
      
      // Upgrade priority order: correct > present > incorrect
      if (!currentStatus || currentStatus === 'empty') {
        letterStatuses[char] = evalNode.status;
      } else if (currentStatus === 'present' && evalNode.status === 'correct') {
        letterStatuses[char] = 'correct';
      } else if (currentStatus === 'incorrect' && (evalNode.status === 'present' || evalNode.status === 'correct')) {
        letterStatuses[char] = evalNode.status;
      }
    });
  });

  const getKeyStatuses = () => {
    if (gameMode === 'survival') {
      const statuses: Record<string, LetterStatus> = {};
      if (!survivalWord) return statuses;
      
      // Revealed letters are marked as correct (green)
      survivalRevealedLetters.forEach(char => {
        statuses[char] = 'correct';
      });

      // Guessed letters not in the word are marked as incorrect (dark gray)
      survivalGuesses.forEach(guess => {
        guess.split('').forEach(char => {
          if (!survivalWord.word.includes(char)) {
            statuses[char] = 'incorrect';
          }
        });
      });

      return statuses;
    }
    if (gameMode === 'enigma') {
      const statuses: Record<string, LetterStatus> = {};
      if (!enigmaWord) return statuses;
      
      // Revealed letters are marked as correct (green)
      enigmaRevealedLetters.forEach(char => {
        statuses[char] = 'correct';
      });

      // Guessed letters not in the word are marked as incorrect (dark gray)
      enigmaGuesses.forEach(guess => {
        guess.split('').forEach(char => {
          if (!enigmaWord.word.includes(char)) {
            statuses[char] = 'incorrect';
          }
        });
      });

      return statuses;
    }
    return letterStatuses;
  };

  // Wipes all data clean and reloads
  const handleResetStatistics = () => {
    const freshStats: GameStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessesDistribution: [0, 0, 0, 0, 0, 0]
    };
    setStats(freshStats);
    localStorage.setItem('termo_stats', JSON.stringify(freshStats));
    pushLog('system', isPt ? 'Zera histórico local realizado.' : 'Wiped and cleared local cache records.');
  };

  return (
    <AndroidFrame>
      {/* Visual Canvas segment */}
      <div id="game-app-stage" className="flex-1 w-full bg-[#121213] flex flex-col relative select-none pb-[60px] sm:pb-20 justify-between">
        
        {/* Navigation / Header segment */}
        <header className="h-12 sm:h-16 px-3 sm:px-4 flex items-center justify-between border-b border-[#3a3a3c] shrink-0 select-none bg-[#121213] z-20">
          <div className="flex gap-1 items-center">
            {gameMode !== 'menu' && (
              <button 
                id="header-btn-home"
                onClick={() => { triggerSound('click'); setGameMode('menu'); }}
                className="p-1 px-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-[#3a3a3c] active:scale-95 rounded transition-all mr-1 flex items-center justify-center cursor-pointer"
                title={isPt ? 'Voltar para o Menu' : 'Back to Menu'}
              >
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6 pointer-events-none" />
                </svg>
              </button>
            )}

            {/* Help guidelines */}
            <button 
              id="header-btn-help"
              onClick={() => { triggerSound('click'); setIsSettingsOpen(true); }}
              className="p-1 text-slate-400 hover:text-white hover:bg-[#3a3a3c] active:scale-90 rounded transition-all cursor-pointer"
            >
              <HelpCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 pointer-events-none" />
            </button>

            {/* Force Refresh puzzle - only for standard mode */}
            {gameMode === 'standard' && (
              <button 
                id="header-btn-refresh"
                onClick={() => { triggerSound('click'); generateNewWord(); }}
                disabled={isGenerating}
                className="p-1 text-slate-400 hover:text-white hover:bg-[#3a3a3c] active:scale-95 disabled:opacity-30 rounded transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isGenerating ? 'animate-spin text-[#10b981]' : ''} pointer-events-none`} />
              </button>
            )}

            {/* Force Refresh puzzle - for enigma mode */}
            {gameMode === 'enigma' && (
              <button 
                id="header-btn-enigma-refresh"
                onClick={() => { triggerSound('click'); startEnigmaGame(); }}
                className="p-1 text-slate-400 hover:text-white hover:bg-[#3a3a3c] active:scale-95 rounded transition-all cursor-pointer"
                title={isPt ? 'Nova Palavra' : 'New Word'}
              >
                <RefreshCw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400 pointer-events-none" />
              </button>
            )}
          </div>

          {/* Styled Wordle box logo */}
          <div className="flex flex-col items-center select-none" id="termo-box-logo">
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.25em] text-emerald-500 font-bold leading-none mb-1 text-center font-mono">
              {gameMode === 'enigma' 
                ? (isPt ? 'DESCRIPTOGRAFIA ENIGMA' : 'ENIGMA DECRYPTION') 
                : gameMode === 'survival'
                  ? (isPt ? 'SOBREVIVÊNCIA 3 VIDAS' : '3 LIVES SURVIVAL')
                  : (isPt ? 'Mecanismo LLM Ativo' : 'Local LLM Active')}
            </span>
            <span className="inline sm:hidden text-[8px] uppercase tracking-[0.15em] text-emerald-500 font-bold leading-none mb-0.5 text-center font-mono">
              {gameMode === 'enigma' 
                ? 'ENIGMA' 
                : gameMode === 'survival' 
                  ? 'SOBREVIVÊNCIA' 
                  : (isPt ? 'LLM Ativo' : 'LLM Active')}
            </span>
            <h1 className="text-lg sm:text-2xl font-black tracking-tighter leading-none text-white text-center">
              {gameMode === 'enigma' 
                ? 'ENIGMA' 
                : gameMode === 'survival' 
                  ? 'SOBREVIVÊNCIA' 
                  : 'TERMO'}<span className="text-emerald-500 underline decoration-2 underline-offset-4">AI</span>
            </h1>
          </div>

          <div className="flex gap-1">
            {/* Stats chart */}
            <button 
              id="header-btn-stats"
              onClick={() => { triggerSound('click'); setIsStatsOpen(true); }}
              className="p-1 text-slate-400 hover:text-white hover:bg-[#3a3a3c] active:scale-90 rounded transition-all cursor-pointer"
            >
              <BarChart3 className="w-4.5 h-4.5 sm:w-5 sm:h-5 pointer-events-none" />
            </button>

            {/* App Settings */}
            <button 
              id="header-btn-settings"
              onClick={() => { triggerSound('click'); setIsSettingsOpen(true); }}
              className="p-1 text-slate-400 hover:text-white hover:bg-[#3a3a3c] active:scale-90 rounded transition-all cursor-pointer"
            >
              <Settings className="w-4.5 h-4.5 sm:w-5 sm:h-5 pointer-events-none" />
            </button>
          </div>
        </header>

        {/* Dynamic Warning Alert Overlay */}
        {errorMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold shadow-xl z-50 flex items-center gap-1.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* --- GAME MODE SELECTION VIEW --- */}
        {gameMode === 'menu' && (
          <div className="flex-1 flex flex-col justify-center items-center px-4 py-6 max-w-md mx-auto w-full z-10 select-none text-center">
            
            {/* Decorative Tech Icon / Logo */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-2xl bg-[#121213] flex items-center justify-center">
                <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
              </div>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-1 font-sans">
              TERMO<span className="text-emerald-500">AI</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 mb-6 sm:mb-8 max-w-[280px]">
              {isPt 
                ? 'Selecione a arquitetura cognitiva para iniciar o processamento.' 
                : 'Select the cognitive architecture to begin processing.'}
            </p>

            {/* Choices */}
            <div className="w-full flex flex-col gap-3 sm:gap-4">
              {/* Option 1: Standard */}
              <button
                onClick={() => {
                  triggerSound('click');
                  setGameMode('standard');
                  pushLog('system', isPt ? 'Arquitetura TermoAI Padrão ativada.' : 'Standard TermoAI computing architecture selected.');
                }}
                className="w-full p-3 sm:p-4 rounded-xl bg-[#1a1a1b] border border-[#3a3a3c] hover:border-emerald-500/50 hover:bg-[#202021] text-left transition-all duration-300 active:scale-[0.98] group flex flex-col cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-extrabold text-xs sm:text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {isPt ? '⚡ TermoAI Padrão' : '⚡ Standard Wordle AI'}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {isPt ? 'Original' : 'Standard'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-snug">
                  {isPt 
                    ? 'Adivinhe palavras com 4, 5 ou 6 letras. Terminal de logs ativa, logs LLM locais de amostragem e hyperparâmetros.'
                    : 'Guess words with 4, 5, or 6 letters. Log terminal active, local sampling weights and hyperparameters simulation.'}
                </p>
              </button>

              {/* Option 2: Enigma */}
              <button
                onClick={() => {
                  startEnigmaGame();
                }}
                className="w-full p-3 sm:p-4 rounded-xl bg-[#1a1a1b] border border-[#3a3a3c] hover:border-emerald-500/50 hover:bg-[#202021] text-left transition-all duration-300 active:scale-[0.98] group flex flex-col cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-extrabold text-xs sm:text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {isPt ? '🔎 Decodificador Enigma' : '🔎 Enigma Decoder'}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {isPt ? 'Dica Redutiva' : 'Penalty Score'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-snug">
                  {isPt 
                    ? 'Palavras médias (5 a 8 letras) escondidas. Peça letras de dica que aparecem na palavra mas reduzem seu escore final!'
                    : 'Medium hidden words (5 to 8 letters). Ask for correct letters that appear everywhere but reduce your final score!'}
                </p>
              </button>

              {/* Option 3: Survival */}
              <button
                onClick={() => {
                  startSurvivalGame();
                }}
                className="w-full p-3 sm:p-4 rounded-xl bg-[#1a1a1b] border border-[#3a3a3c] hover:border-rose-500/50 hover:bg-[#202021] text-left transition-all duration-300 active:scale-[0.98] group flex flex-col cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-extrabold text-xs sm:text-sm text-white group-hover:text-[#f43f5e] transition-colors flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
                    {isPt ? 'Modo Sobrevivência' : 'Survival Mode'}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {isPt ? '3 Vidas' : '3 Lives'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-snug">
                  {isPt 
                    ? 'Acerte palavras seguidas em série. Você começa com 3 vidas e perde uma vida a cada palpite incorreto!'
                    : 'Solve consecutive secrets in a row. Start with 3 lives and lose a life on every wrong full word guess!'}
                </p>
              </button>
            </div>

            {/* Language indicator on the fly */}
            <div className="mt-6 sm:mt-8 flex gap-2 items-center text-[10px] sm:text-xs text-slate-500 bg-[#1a1a1b] py-1.5 px-3 rounded-full border border-[#3a3a3c]">
              <span>{isPt ? 'Idioma:' : 'Language:'}</span>
              <button 
                onClick={() => {
                  triggerSound('click');
                  setSettings(p => ({ ...p, language: p.language === 'pt' ? 'en' : 'pt' }));
                }}
                className="font-black text-emerald-400 hover:underline hover:text-white pointer-events-auto"
                title={isPt ? 'Mudar para Inglês' : 'Switch to Portuguese'}
              >
                {isPt ? 'Português (BR)' : 'English (US)'}
              </button>
            </div>

          </div>
        )}

        {/* --- STANDARD MODE VIEWPLAY --- */}
        {gameMode === 'standard' && (
          <>
            {/* Dynamic Clues & Status Card above play board */}
            <div className="px-4 mt-0.5 sm:mt-2 flex flex-col gap-1 sm:gap-2 relative z-10 shrink-0 select-none text-center">
              {activeWord ? (
                <div className="bg-[#1a1a1b] p-1.5 sm:p-3 rounded border border-[#3a3a3c] flex flex-col items-center justify-center text-xs max-w-xs mx-auto w-full relative">
                  {/* Category indicator badges */}
                  <div className="flex gap-2 items-center mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      {isPt ? 'Categoria:' : 'Category:'} {isPt && activeWord.category === 'Nature' ? 'Natureza' : activeWord.category}
                    </span>
                    <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                      activeWord.difficulty === 'fácil' 
                        ? 'bg-[#1a1a1b] border-emerald-500/30 text-emerald-400' 
                        : activeWord.difficulty === 'médio'
                          ? 'bg-[#1a1a1b] border-amber-500/30 text-amber-500' 
                          : 'bg-[#1a1a1b] border-rose-500/30 text-rose-400'
                    }`}>
                      {activeWord.difficulty}
                    </span>
                  </div>

                  {/* Clue revealing or solved text */}
                  {revealedCount > 0 ? (
                    <p className="text-[10px] sm:text-[11px] text-slate-100 font-bold leading-snug mt-0.5 sm:mt-1 animate-in fade-in slide-in-from-top-1 px-1.5 animate-bounce">
                      <span className="font-extrabold text-emerald-500 not-italic uppercase tracking-widest block text-[8px] sm:text-[9px] mb-0">{isPt ? '⚡ Dica Lógica:' : '⚡ AI Hint:'}</span>
                      "{activeWord.clue}"
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        triggerSound('click');
                        setRevealedCount(1);
                        pushLog('info', isPt ? 'Clue consultado pelo Oracle.' : 'Clue queried by user.');
                      }}
                      className="mt-1 flex items-center gap-1.5 text-[9px] sm:text-[10px] bg-white text-black hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest py-1 px-2.5 sm:py-1.5 sm:px-3 rounded transition-colors active:scale-95 cursor-pointer"
                    >
                      <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {isPt ? 'Consultar Oracle LLM' : 'Consult Local LLM Oracle'}
                    </button>
                  )}

                  {/* Solved reveal message */}
                  {gameStatus !== 'playing' && (
                    <div className="absolute inset-0 bg-[#1a1a1b] rounded flex flex-col items-center justify-center px-4 py-2 border border-[#3a3a3c] animate-in fade-in zoom-in-95 duration-200 z-10">
                      <p className={`text-xs font-black tracking-widest uppercase ${gameStatus === 'won' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {gameStatus === 'won' ? (isPt ? 'Vitória! 🎉' : 'Victory Resolved! 🎉') : (isPt ? 'Derrota! 💀' : 'Defeated! 💀')}
                      </p>
                      <h3 className="text-xl font-black text-white tracking-[0.2em] font-mono select-text mt-0.5 uppercase">
                        {activeWord.word}
                      </h3>
                      <button 
                        onClick={() => { triggerSound('click'); generateNewWord(); }}
                        className="mt-2 bg-white text-black hover:bg-emerald-500 hover:text-white font-black text-[10px] uppercase tracking-widest py-1.5 px-4 rounded transition-colors active:scale-95 cursor-pointer"
                      >
                        {isPt ? 'Próxima Palavra' : 'Next Puzzle'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-14 flex items-center justify-center font-mono text-xs text-[#818384] select-none gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                  <span>{isPt ? 'Gerando palavra...' : 'Sampling local token weights...'}</span>
                </div>
              )}
            </div>

            {/* Word Board Grid View */}
            <GameBoard
              guesses={guesses}
              currentGuess={currentGuess}
              maxGuesses={6}
              wordLength={wordLength}
              shakeRowIndex={shakedRowIndex}
              revealedWord={gameStatus !== 'playing' && activeWord ? activeWord.word : null}
            />
          </>
        )}

        {/* --- ENIGMA MODE VIEWPLAY --- */}
        {gameMode === 'enigma' && enigmaWord && (
          <>
            {/* Category / Clue Concept Indicator */}
            <div className="px-4 mt-0.5 sm:mt-2 flex flex-col gap-1 sm:gap-2 relative z-10 shrink-0 select-none text-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-[#1a1a1b] p-2 sm:p-3 rounded border border-[#3a3a3c] flex flex-col items-center justify-center text-xs relative w-full">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">
                    {isPt ? 'Categoria:' : 'Category:'} {isPt && enigmaWord.category === 'Nature' ? 'Natureza' : enigmaWord.category}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider font-mono">
                    {isPt ? 'Conversão Enigma' : 'Enigma Conversion'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-100 font-bold leading-normal px-2">
                  <span className="font-extrabold text-emerald-500 uppercase tracking-widest block text-[8px] sm:text-[9px] mb-0.5">
                    {isPt ? '⚡ Diretriz do Clue:' : '⚡ Concept Prompt:'}
                  </span>
                  "{enigmaWord.clue}"
                </p>
              </div>
            </div>

            {/* Hidden word row display */}
            <div className="flex-1 flex flex-col items-center justify-center py-2 px-4 select-none shrink animate-in zoom-in-95 duration-400">
              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-sm w-full mx-auto">
                {enigmaWord.word.split('').map((char, idx) => {
                  const isRevealed = enigmaRevealedLetters.includes(char) || enigmaStatus !== 'playing';
                  const isSolvedWord = enigmaStatus === 'won';
                  
                  return (
                    <div
                      key={idx}
                      className={`w-7 h-9 sm:w-9 sm:h-11 flex items-center justify-center text-sm sm:text-base font-black rounded border-2 transition-all duration-300 ${
                        isRevealed
                          ? isSolvedWord
                            ? 'bg-[#538d4e] border-[#538d4e] text-white animate-in zoom-in duration-300'
                            : enigmaRevealedLetters.includes(char)
                              ? 'bg-[#1b4332] border-emerald-500 text-emerald-400'
                              : 'bg-rose-950 border-rose-600 text-rose-200'
                          : 'bg-[#1a1a1b] border-[#3a3a3c] text-slate-700'
                      }`}
                    >
                      {isRevealed ? char : '?'}
                    </div>
                  );
                })}
              </div>

              {/* Score HUD telemetry */}
              <div className="mt-3 sm:mt-4 flex flex-col items-center w-full max-w-xs gap-1">
                <div className="flex justify-between w-full text-[10px] uppercase font-bold tracking-wider px-1">
                  <span className="text-slate-400 font-mono">{isPt ? 'Tempo Restante:' : 'Time Remaining:'}</span>
                  <span className={`font-mono font-black transition-colors duration-300 ${
                    enigmaTimeLeft < 30 
                      ? 'text-rose-500 animate-pulse text-xs sm:text-sm font-extrabold' 
                      : enigmaTimeLeft < 60 
                        ? 'text-amber-500 animate-pulse' 
                        : 'text-emerald-400'
                  }`}>
                    {Math.floor(enigmaTimeLeft / 60)}:{(enigmaTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="flex justify-between w-full text-[10px] uppercase font-bold tracking-wider mb-1 px-1">
                  <span className="text-slate-400 font-mono">{isPt ? 'Escore Final Estimado:' : 'Estimated Final Score:'}</span>
                  <span className={enigmaScore > 40 ? 'text-emerald-400 font-black animate-pulse font-mono' : 'text-rose-500 font-black animate-bounce font-mono'}>
                    {enigmaScore} pts
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#202021] rounded-full overflow-hidden border border-[#3a3a3c]">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      enigmaScore > 50 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : enigmaScore > 20 
                          ? 'bg-amber-500' 
                          : 'bg-rose-600 animate-pulse'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, enigmaScore))}%` }}
                  />
                </div>

                {/* Tip Buttons & Controls */}
                <div className="w-full flex flex-col gap-1.5 mt-3 sm:mt-4">
                  {enigmaStatus === 'playing' ? (
                    <button
                      onClick={() => {
                        const unrevealed = enigmaWord.word.split('').filter(c => !enigmaRevealedLetters.includes(c));
                        if (unrevealed.length === 0) return;
                        
                        const randomChar = unrevealed[Math.floor(Math.random() * unrevealed.length)];
                        setEnigmaRevealedLetters(prev => [...prev, randomChar]);
                        setEnigmaScore(prev => Math.max(0, prev - 15));
                        triggerSound('flip');
                        pushLog('info', isPt ? `Dica acionada: revelando letra [${randomChar}]. -15pts.` : `Letter tip active: revealing letter [${randomChar}]. -15pts.`);
                        
                        // Check if all letters are revealed
                        const remaining = enigmaWord.word.split('').filter(c => c !== randomChar && !enigmaRevealedLetters.includes(c));
                        if (remaining.length === 0) {
                          setEnigmaStatus('won');
                          triggerSound('win');
                        }
                      }}
                      disabled={enigmaScore <= 15}
                      className="w-full h-9 flex items-center justify-center gap-1.5 bg-[#1a1a1b] text-[10px] sm:text-xs text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-40 rounded py-2 transition-all font-black uppercase cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      {isPt ? 'Pedir Letra Dica (-15)' : 'Request Letter Hint (-15)'}
                    </button>
                  ) : (
                    <button
                      onClick={startEnigmaGame}
                      className="w-full h-9 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded py-2 font-black uppercase text-[10px] sm:text-xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {isPt ? 'Jogar de Novo' : 'Decrypt New Word'}
                    </button>
                  )}

                  {enigmaMessage && (
                    <div className="text-[10px] sm:text-[11px] py-1 px-3 rounded bg-rose-950/40 border border-rose-500/20 text-rose-400 text-center animate-bounce mt-1 font-bold font-mono">
                      {enigmaMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Draft / answer typing bar */}
            {enigmaStatus === 'playing' ? (
              <div className="w-full max-w-sm px-4 mb-2 flex flex-col gap-1 items-stretch mx-auto select-none">
                <div className="text-[9px] uppercase tracking-widest text-[#10b981] font-bold text-left mb-0.5 ml-1 font-mono">
                  {isPt ? 'Digite seu palpite completo:' : 'Draft full word answer:'}
                </div>
                <div className="relative flex items-center bg-[#1a1a1b] rounded-lg border border-[#3a3a3c] focus-within:border-emerald-500 shadow-inner px-2.5 py-1.5 min-h-[36px] sm:min-h-[40px]">
                  <span className="text-emerald-500 font-mono font-black text-xs sm:text-sm mr-2 select-none">{'>'}</span>
                  <input
                    type="text"
                    value={enigmaInput}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-ZÇ]/g, '');
                      setEnigmaInput(val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitEnigmaFullGuess();
                      }
                    }}
                    placeholder={isPt ? "EX: TECNOLOGIA" : "E.G. TECHNOLOGY"}
                    className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm font-black font-mono tracking-wider placeholder-slate-600 uppercase focus:ring-0"
                    maxLength={enigmaWord.word.length}
                  />
                  {enigmaInput.length > 0 && (
                    <button
                      onClick={submitEnigmaFullGuess}
                      className="ml-2 px-2.5 py-1 text-[10px] bg-emerald-500 text-white font-black hover:bg-emerald-400 uppercase tracking-wider rounded transition-colors active:scale-95 cursor-pointer"
                    >
                      {isPt ? 'Confirmar' : 'Confirm'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm px-4 mb-2 text-center mx-auto animate-in zoom-in-95 duration-200">
                <div className={`p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm font-bold ${
                  enigmaStatus === 'won' 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  {enigmaStatus === 'won' ? (
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-emerald-400 font-extrabold mb-1 font-mono">🎉 {isPt ? 'DESAFIO CONCLUÍDO!' : 'DECRYPTED SUCCESS!'}</span>
                      {isPt 
                        ? `Você desvendou a palavra secreta com ${enigmaScore} pontos!` 
                        : `You decrypted the secret word successfully claiming ${enigmaScore} points!`}
                    </div>
                  ) : (
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-rose-400 font-extrabold mb-1 font-mono">💥 {isPt ? 'SINAL PERDIDO' : 'DECRYPTION FAILED'}</span>
                      {isPt 
                        ? `A palavra encriptada era ${enigmaWord.word}` 
                        : `The encrypted secret word was ${enigmaWord.word}`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- SURVIVAL MODE VIEWPLAY --- */}
        {gameMode === 'survival' && survivalWord && (
          <>
            {/* Category / Clue Concept Indicator */}
            <div className="px-4 mt-0.5 sm:mt-2 flex flex-col gap-1 sm:gap-2 relative z-10 shrink-0 select-none text-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-[#1a1a1b] p-2 sm:p-3 rounded border border-rose-500/20 flex flex-col items-center justify-center text-xs relative w-full">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest font-mono">
                    {isPt ? 'Categoria:' : 'Category:'} {isPt && survivalWord.category === 'Nature' ? 'Natureza' : survivalWord.category}
                  </span>
                  <motion.span
                    key={survivalStreak}
                    initial={{ scale: 1 }}
                    animate={survivalStreak > 0 ? {
                      scale: [1, 1.25, 1],
                      borderColor: ["rgba(244,63,94,0.2)", "rgba(249,115,22,0.8)", "rgba(244,63,94,0.2)"],
                      backgroundColor: ["rgba(244,63,94,0.1)", "rgba(249,115,22,0.25)", "rgba(244,63,94,0.1)"],
                      boxShadow: [
                        "0 0 0px rgba(0,0,0,0)",
                        "0 0 12px rgba(249,115,22,0.6)",
                        "0 0 0px rgba(0,0,0,0)"
                      ]
                    } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider font-mono flex items-center gap-1 relative overflow-visible"
                  >
                    <Trophy className={`w-3 h-3 transition-colors duration-300 ${survivalStreak >= 3 ? 'text-amber-400 animate-bounce' : 'text-rose-400'}`} />
                    <span>{isPt ? `${survivalStreak} Acertos` : `${survivalStreak} Solved`}</span>

                    {/* Subtle Fire 'On Fire' Indicator if streak >= 3 */}
                    {survivalStreak >= 3 && (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1], y: [0, -1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        className="text-[10px] select-none text-orange-500 ml-0.5"
                      >
                        🔥
                      </motion.span>
                    )}

                    {/* Particles popping out on increment */}
                    <AnimatePresence>
                      {survivalStatus === 'won' && (
                        <span className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          {/* Left sparkle */}
                          <motion.span
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{ x: -22, y: -18, scale: 1.3, opacity: 0, rotate: 45 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute text-orange-400"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                          </motion.span>
                          {/* Right sparkle */}
                          <motion.span
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{ x: 22, y: -18, scale: 1.3, opacity: 0, rotate: -45 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
                            className="absolute text-yellow-400"
                          >
                            <Sparkles className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          </motion.span>
                          {/* Centered Fire sparkle */}
                          <motion.span
                            initial={{ x: 0, y: 5, scale: 0.2, opacity: 1 }}
                            animate={{ x: -4, y: -26, scale: 1.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9, ease: "easeOut", delay: 0.04 }}
                            className="absolute text-red-500 text-xs select-none"
                          >
                            🔥
                          </motion.span>
                          {/* Secondary Fire sparkle */}
                          <motion.span
                            initial={{ x: 0, y: 5, scale: 0.2, opacity: 1 }}
                            animate={{ x: 6, y: -26, scale: 1.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
                            className="absolute text-orange-500 text-xs select-none"
                          >
                            🔥
                          </motion.span>
                        </span>
                      )}
                    </AnimatePresence>
                  </motion.span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-100 font-bold leading-normal px-2">
                  <span className="font-extrabold text-rose-400 uppercase tracking-widest block text-[8px] sm:text-[9px] mb-0.5">
                    {isPt ? '⚡ Diretriz do Clue:' : '⚡ Concept Prompt:'}
                  </span>
                  "{survivalWord.clue}"
                </p>
              </div>
            </div>

            {/* Hidden word row display */}
            <div className="flex-1 flex flex-col items-center justify-center py-2 px-4 select-none shrink animate-in zoom-in-95 duration-400">
              {/* Hearts / Lives indicator */}
              <div className="flex gap-2 items-center mb-4 select-none">
                {Array.from({ length: 3 }).map((_, idx) => {
                  const isHeartActive = idx < survivalLives;
                  return (
                    <Heart 
                      key={idx} 
                      className={`w-6 h-6 transition-all duration-300 ${
                        isHeartActive 
                          ? 'text-rose-500 fill-rose-500 scale-100 animate-pulse' 
                          : 'text-zinc-700 fill-zinc-800 scale-90 opacity-40'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-sm w-full mx-auto">
                {survivalWord.word.split('').map((char, idx) => {
                  const isRevealed = survivalRevealedLetters.includes(char) || survivalStatus !== 'playing';
                  const isSolvedWord = survivalStatus === 'won';
                  
                  return (
                    <div
                      key={idx}
                      className={`w-7 h-9 sm:w-9 sm:h-11 flex items-center justify-center text-sm sm:text-base font-black rounded border-2 transition-all duration-300 ${
                        isRevealed
                          ? isSolvedWord
                            ? 'bg-[#538d4e] border-[#538d4e] text-white animate-in zoom-in duration-300'
                            : survivalRevealedLetters.includes(char)
                              ? 'bg-[#1b4332] border-emerald-500 text-emerald-400'
                              : 'bg-rose-950 border-rose-600 text-rose-200'
                          : 'bg-[#1a1a1b] border-[#3a3a3c] text-slate-700'
                      }`}
                    >
                      {isRevealed ? char : '?'}
                    </div>
                  );
                })}
              </div>

              {/* Status or skip elements */}
              <div className="w-full flex flex-col gap-1.5 mt-3 sm:mt-4 max-w-xs mx-auto">
                {survivalStatus !== 'playing' && survivalStatus === 'won' && (
                  <button
                    onClick={() => loadNextSurvivalWord(false)}
                    className="w-full h-9 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded py-2 font-black uppercase text-[10px] sm:text-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {isPt ? 'Próxima Palavra' : 'Next Word'}
                  </button>
                )}

                {survivalMessage && (
                  <div className="text-[10px] sm:text-[11px] py-1.5 px-3 rounded bg-rose-950/40 border border-rose-500/20 text-rose-400 text-center animate-bounce mt-1 font-bold font-mono">
                    {survivalMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Draft / answer typing bar */}
            {survivalStatus === 'playing' ? (
              <div className="w-full max-w-sm px-4 mb-2 flex flex-col gap-1 items-stretch mx-auto select-none">
                <div className="text-[9px] uppercase tracking-widest text-[#f43f5e] font-bold text-left mb-0.5 ml-1 font-mono">
                  {isPt ? 'Sua Resposta Completa / Letras:' : 'Your Complete Word Prediction:'}
                </div>
                <div className="relative flex items-center bg-[#1a1a1b] rounded-lg border border-[#3a3a3c] focus-within:border-rose-500 shadow-inner px-2.5 py-1.5 min-h-[36px] sm:min-h-[40px]">
                  <span className="text-rose-500 font-mono font-black text-xs sm:text-sm mr-2 select-none">{'>'}</span>
                  <input
                    type="text"
                    value={survivalInput}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-ZÇ]/g, '');
                      setSurvivalInput(val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitSurvivalFullGuess();
                      }
                    }}
                    placeholder={isPt ? "EX: COMPUTADOR" : "E.G. KEYBOARD"}
                    className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm font-black font-mono tracking-wider placeholder-slate-600 uppercase focus:ring-0"
                    maxLength={survivalWord.word.length}
                  />
                  {survivalInput.length > 0 && (
                    <button
                      onClick={submitSurvivalFullGuess}
                      className="ml-2 px-2.5 py-1 text-[10px] bg-rose-500 text-white font-black hover:bg-rose-400 uppercase tracking-wider rounded transition-colors active:scale-95 cursor-pointer"
                    >
                      {isPt ? 'Confirmar' : 'Confirm'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm px-4 mb-2 text-center mx-auto animate-in zoom-in-95 duration-200">
                <div className={`p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm font-bold ${
                  survivalStatus === 'won' 
                    ? 'bg-[#1b4332] border-emerald-500 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  {survivalStatus === 'won' ? (
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-emerald-450 font-extrabold mb-1 font-mono">🎉 {isPt ? 'ACERTO CONCLUÍDO!' : 'CORRECT ANSWER!'}</span>
                      {isPt 
                        ? `Aguarde, carregando nova palavra secreta...` 
                        : `Wait, loading the next secret word...`}
                    </div>
                  ) : (
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-rose-450 font-extrabold mb-1 font-mono">☠️ {isPt ? 'FIM DE JOGO!' : 'GAME OVER!'}</span>
                      {isPt 
                        ? `Você acertou ${survivalStreak} palavras seguidas! A última palavra era: ${survivalWord.word}` 
                        : `You solved ${survivalStreak} words in a row! The final word was: ${survivalWord.word}`}
                      <button
                        onClick={startSurvivalGame}
                        className="mt-2.5 w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-black uppercase text-[9px] sm:text-[10px] transition-colors cursor-pointer block text-center"
                      >
                        {isPt ? 'Tentar Novamente' : 'Try Again'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Keyboard keypad view shown when not in landing menu */}
        {gameMode !== 'menu' && (
          <Keyboard
            onKeyPress={handleKeyPress}
            letterStatuses={getKeyStatuses()}
            language={settings.language}
            triggerSound={triggerSound}
          />
        )}

        {/* Bottom Panel Simulated Local LLM Console */}
        <LLMConsole
          language={settings.language}
          config={config}
          setConfig={setConfig}
          logs={logs}
          setLogs={setLogs}
          isGenerating={isGenerating}
          generateNewWord={generateNewWord}
          activeWord={activeWord}
          revealedCount={revealedCount}
          triggerSound={triggerSound}
        />

        {/* Overlays / Alerts modals */}
        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          stats={stats}
          language={settings.language}
          onResetStats={handleResetStatistics}
          isGameFinished={gameStatus !== 'playing'}
          onNewGame={() => generateNewWord()}
          triggerSound={triggerSound}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          setSettings={setSettings}
          language={settings.language}
          triggerSound={triggerSound}
          wordLength={wordLength}
        />

      </div>
    </AndroidFrame>
  );
}
