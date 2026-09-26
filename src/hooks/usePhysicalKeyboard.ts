import { useEffect, useRef } from 'react';

/**
 * Forwards letters, Enter and Backspace from the physical keyboard to `onKey`
 * while `enabled`. Typing inside text inputs is left to the input itself.
 */
export function usePhysicalKeyboard(onKey: (key: string) => void, enabled: boolean) {
  const onKeyRef = useRef(onKey);
  onKeyRef.current = onKey;

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE') {
        onKeyRef.current('BACKSPACE');
      } else if (key === 'ENTER') {
        // Keep Enter from also activating a focused button (e.g. "new word")
        e.preventDefault();
        onKeyRef.current('ENTER');
      } else if (/^[A-ZÇÑ]$/.test(key)) {
        onKeyRef.current(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
