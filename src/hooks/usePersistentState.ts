import { useEffect, useState } from 'react';

/**
 * State saved to localStorage. Saved objects are merged over `defaults`, so data
 * written by older versions picks up fields added later.
 */
export function usePersistentState<T extends object>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch (e) {
      console.error(`Failed to load ${key} from storage`, e);
    }
    return defaults;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to storage`, e);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
