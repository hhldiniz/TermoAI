import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useDialog } from '../useDialog';
import { useGame } from '../GameContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Asks before discarding a game in progress.
export default function ConfirmDialog({ isOpen, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t, triggerSound } = useGame();
  const dialogRef = useDialog<HTMLDivElement>(isOpen, onCancel);
  if (!isOpen) return null;

  return (
    <div id="confirm-dialog-backdrop" className="absolute inset-0 bg-app/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div
        id="confirm-dialog"
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-body"
        className="w-full max-w-xs bg-surface border border-line rounded p-5 shadow-xl flex flex-col gap-4 select-none"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <h2 id="confirm-dialog-title" className="text-sm font-black text-white uppercase tracking-widest">{t.confirm.title}</h2>
        </div>
        <p id="confirm-dialog-body" className="text-sm text-slate-300">{t.confirm.body}</p>
        <div className="flex flex-col sm:flex-row-reverse gap-2">
          {/* Safe choice first so it receives focus */}
          <button
            onClick={() => { triggerSound('click'); onCancel(); }}
            className="flex-1 min-h-11 bg-white text-black hover:bg-emerald-700 hover:text-white font-black text-xs uppercase tracking-widest px-4 rounded transition-colors cursor-pointer"
          >
            {t.confirm.stay}
          </button>
          <button
            onClick={() => { triggerSound('click'); onConfirm(); }}
            className="flex-1 min-h-11 border border-line hover:border-rose-500/50 hover:text-rose-400 text-slate-300 font-black text-xs uppercase tracking-widest px-4 rounded transition-colors cursor-pointer"
          >
            {t.confirm.leave}
          </button>
        </div>
      </div>
    </div>
  );
}
