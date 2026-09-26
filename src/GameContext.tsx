import { createContext, useContext } from 'react';
import { GameSettings, LogType, SoundType } from './types';
import type { Messages } from './i18n';

// Shared app services used by every game mode.
export interface GameContextValue {
  settings: GameSettings;
  t: Messages;
  triggerSound: (type: SoundType) => void;
  pushLog: (type: LogType, message: string) => void;
  announce: (message: string) => void;
  isAnyModalOpen: boolean;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside GameContext.Provider');
  return value;
}
