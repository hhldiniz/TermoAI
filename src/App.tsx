import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GameMode, GameSettings, GameStats, SoundType } from './types';
import { loadDictionary } from './dictionary';
import { getMessages, getHtmlLang } from './i18n';
import { playSound } from './utils/audio';
import { GameContext, GameContextValue } from './GameContext';
import { usePersistentState } from './hooks/usePersistentState';

import AndroidFrame from './components/AndroidFrame';
import Header from './components/Header';
import ModeMenu from './components/ModeMenu';
import StatsModal from './components/StatsModal';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import ConfirmDialog from './components/ConfirmDialog';
import ClassicGame from './modes/ClassicGame';
import EnigmaGame from './modes/EnigmaGame';
import SurvivalGame from './modes/SurvivalGame';

const DEFAULT_SETTINGS: GameSettings = {
  language: 'pt',
  soundEnabled: true,
  hardMode: false,
  autoRevealClue: true,
  wordLength: 5,
  category: 'all',
  highContrast: false
};

const EMPTY_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessesDistribution: [0, 0, 0, 0, 0, 0],
  enigma: { played: 0, won: 0, bestScore: 0 },
  survival: { played: 0, bestStreak: 0 }
};

const LAST_MODE_KEY = 'termo_last_mode';
const SEEN_HELP_KEY = 'termo_seen_help';

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode): the app still works without it
  }
}

export default function App() {
  const [settings, setSettings] = usePersistentState<GameSettings>('termo_settings', DEFAULT_SETTINGS);
  const [stats, setStats] = usePersistentState<GameStats>('termo_stats', EMPTY_STATS);
  const t = getMessages(settings.language);

  // Keep <html lang> in sync so screen readers and translators use the right language
  useEffect(() => {
    document.documentElement.lang = getHtmlLang(settings.language);
  }, [settings.language]);

  // Color-blind palette (see index.css)
  useEffect(() => {
    document.documentElement.dataset.contrast = settings.highContrast ? 'high' : 'normal';
  }, [settings.highContrast]);

  // Preload the guess dictionary for the active language
  useEffect(() => {
    loadDictionary(settings.language).catch((e) => console.error('Failed to load dictionary', e));
  }, [settings.language]);

  const triggerSound = useCallback((type: SoundType) => {
    playSound(type, settings.soundEnabled);
  }, [settings.soundEnabled]);


  // Screen reader announcements (rendered in a visually hidden live region)
  const [announcement, setAnnouncement] = useState('');
  const announce = useCallback((message: string) => {
    // Clear first so repeating the same message is announced again
    setAnnouncement('');
    setTimeout(() => setAnnouncement(message), 50);
  }, []);

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  // Action waiting for the "leave this game?" confirmation
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);
  const isAnyModalOpen = isStatsOpen || isSettingsOpen || isHelpOpen || pendingLeave !== null;

  // Classic saves its game, so a reload returns straight to it
  const [gameMode, setGameMode] = useState<GameMode>(() => (readStorage(LAST_MODE_KEY) === 'standard' ? 'standard' : 'menu'));
  const [modeInProgress, setModeInProgress] = useState(false);

  useEffect(() => {
    writeStorage(LAST_MODE_KEY, gameMode);

    // Show each mode's rules the first time it is opened
    if (gameMode === 'menu') {
      setModeInProgress(false);
      return;
    }
    let seen: string[] = [];
    try {
      seen = JSON.parse(readStorage(SEEN_HELP_KEY) || '[]');
    } catch {
      seen = [];
    }
    if (!seen.includes(gameMode)) {
      writeStorage(SEEN_HELP_KEY, JSON.stringify([...seen, gameMode]));
      setIsHelpOpen(true);
    }
  }, [gameMode]);

  // Runs `action` right away, or after confirmation if it would discard a game in progress
  const confirmLeave = (action: () => void) => {
    if (modeInProgress) setPendingLeave(() => action);
    else action();
  };
  // Incremented to ask the active mode for a new word / run
  const [restartToken, setRestartToken] = useState(0);
  const [classicWordLength, setClassicWordLength] = useState(settings.wordLength);

  const handleClassicResult = useCallback((won: boolean, attempts: number) => {
    setStats(prev => {
      if (!won) return { ...prev, gamesPlayed: prev.gamesPlayed + 1, currentStreak: 0 };
      const dist = [...prev.guessesDistribution];
      if (attempts >= 1 && attempts <= dist.length) dist[attempts - 1] += 1;
      const streak = prev.currentStreak + 1;
      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        currentStreak: streak,
        maxStreak: Math.max(prev.maxStreak, streak),
        guessesDistribution: dist
      };
    });
  }, [setStats]);

  const handleEnigmaResult = useCallback((won: boolean, score: number) => {
    setStats(prev => ({
      ...prev,
      enigma: {
        played: prev.enigma.played + 1,
        won: prev.enigma.won + (won ? 1 : 0),
        bestScore: won ? Math.max(prev.enigma.bestScore, score) : prev.enigma.bestScore
      }
    }));
  }, [setStats]);

  const handleSurvivalEnd = useCallback((streak: number) => {
    setStats(prev => ({
      ...prev,
      survival: {
        played: prev.survival.played + 1,
        bestStreak: Math.max(prev.survival.bestStreak, streak)
      }
    }));
  }, [setStats]);

  const handleModeState = useCallback(({ inProgress }: { inProgress: boolean }) => {
    setModeInProgress(inProgress);
  }, []);

  const selectMode = (mode: Exclude<GameMode, 'menu'>) => {
    setGameMode(mode);
  };

  const startNewGameForCurrentMode = () => {
    if (gameMode === 'menu') setGameMode('standard');
    confirmLeave(() => setRestartToken(n => n + 1));
  };

  const handleResetStatistics = () => {
    setStats(EMPTY_STATS);
  };

  const contextValue = useMemo<GameContextValue>(
    () => ({ settings, t, triggerSound, announce, isAnyModalOpen }),
    [settings, t, triggerSound, announce, isAnyModalOpen]
  );

  return (
    <GameContext.Provider value={contextValue}>
      <AndroidFrame>
        <div id="game-app-stage" className={`flex-1 min-h-0 w-full bg-app flex flex-col relative select-none justify-between pb-2`}>
          <Header
            gameMode={gameMode}
            // Classic saves its game, so only Enigma and Survival lose progress when leaving
            onHome={() => (gameMode === 'standard' ? setGameMode('menu') : confirmLeave(() => setGameMode('menu')))}
            onHelp={() => setIsHelpOpen(true)}
            onNewWord={() => confirmLeave(() => setRestartToken(n => n + 1))}
            onStats={() => setIsStatsOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
          />

          {/* Screen reader announcements */}
          <div className="sr-only-live" role="status" aria-live="polite" aria-atomic="true">
            {announcement}
          </div>

          {gameMode === 'menu' && (
            <ModeMenu
              onSelect={selectMode}
              onCycleLanguage={() => setSettings(p => ({
                ...p,
                language: p.language === 'pt' ? 'en' : p.language === 'en' ? 'es' : 'pt',
                category: 'all'
              }))}
            />
          )}

          {gameMode === 'standard' && (
            <ClassicGame
              restartToken={restartToken}
              onResult={handleClassicResult}
              onShowStats={() => setIsStatsOpen(true)}
              onStateChange={({ inProgress, wordLength }) => {
                setModeInProgress(inProgress);
                setClassicWordLength(wordLength);
              }}
            />
          )}

          {gameMode === 'enigma' && (
            <EnigmaGame restartToken={restartToken} onResult={handleEnigmaResult} onStateChange={handleModeState} />
          )}

          {gameMode === 'survival' && (
            <SurvivalGame restartToken={restartToken} onRunEnd={handleSurvivalEnd} onStateChange={handleModeState} />
          )}

          <StatsModal
            isOpen={isStatsOpen}
            onClose={() => setIsStatsOpen(false)}
            stats={stats}
            language={settings.language}
            onResetStats={handleResetStatistics}
            onNewGame={startNewGameForCurrentMode}
            triggerSound={triggerSound}
          />

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            setSettings={setSettings}
            language={settings.language}
            triggerSound={triggerSound}
          />

          <ConfirmDialog
            isOpen={pendingLeave !== null}
            onConfirm={() => {
              const action = pendingLeave;
              setPendingLeave(null);
              action?.();
            }}
            onCancel={() => setPendingLeave(null)}
          />

          <HelpModal
            isOpen={isHelpOpen}
            onClose={() => setIsHelpOpen(false)}
            language={settings.language}
            gameMode={gameMode}
            wordLength={classicWordLength}
            highContrast={settings.highContrast}
            triggerSound={triggerSound}
          />
        </div>
      </AndroidFrame>
    </GameContext.Provider>
  );
}
