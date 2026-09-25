import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { LLMLog } from '../types';

interface LLMConsoleProps {
  language: 'pt' | 'en' | 'es';
  logs: LLMLog[];
  setLogs: React.Dispatch<React.SetStateAction<LLMLog[]>>;
  triggerSound: (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => void;
}

// Optional log panel (enabled in Settings) that shows the game's engine messages.
export default function LLMConsole({
  language,
  logs,
  setLogs,
  triggerSound
}: LLMConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs to bottom
  useEffect(() => {
    if (isOpen && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const isPt = language === 'pt';
  const isEs = language === 'es';
  const labelTitle = isPt ? 'Console do motor' : isEs ? 'Consola del motor' : 'Engine console';
  const labelEmpty = isPt ? 'Nenhuma mensagem ainda.' : isEs ? 'Aún no hay mensajes.' : 'No messages yet.';
  const labelClear = isPt ? 'Limpar' : isEs ? 'Borrar' : 'Clear';
  const lastLog = logs[logs.length - 1];

  return (
    <div id="llm-console-container" className="absolute bottom-1.5 sm:bottom-6 left-0 right-0 px-4 z-40">
      <div
        className={`bg-surface border-t border-l border-r ${isOpen ? 'border-line shadow-lg' : 'border-line/70 shadow-md'} rounded-t transition-all duration-300 flex flex-col`}
        style={{ height: isOpen ? 'min(60vh, 320px)' : 'var(--console-closed-h)' }}
      >
        {/* Toggle bar */}
        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          className="h-[var(--console-closed-h)] px-4 flex items-center justify-between cursor-pointer select-none active:bg-line/30 rounded-t shrink-0 text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white uppercase tracking-wider">{labelTitle}</span>
              <span className="text-xs text-muted font-mono tracking-tight truncate">
                {lastLog ? lastLog.message : labelEmpty}
              </span>
            </div>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-muted shrink-0" /> : <ChevronUp className="w-4 h-4 text-muted shrink-0" />}
        </button>

        {isOpen && (
          <div className="flex-1 flex flex-col overflow-hidden p-3 pt-0 gap-2">
            <div className="flex-1 bg-app rounded p-2.5 font-mono text-xs text-slate-300 overflow-y-auto border border-line flex flex-col gap-1 select-text scrollbar-thin">
              {logs.length === 0 && <span className="text-muted">{labelEmpty}</span>}
              {logs.map((log, i) => {
                let color = 'text-slate-400';
                if (log.type === 'system') color = 'text-sky-400';
                if (log.type === 'success') color = 'text-emerald-400';
                if (log.type === 'warning') color = 'text-amber-500';
                if (log.type === 'token') color = 'text-emerald-400 font-bold';

                return (
                  <div key={i} className="leading-relaxed flex items-start gap-1">
                    <span className="text-muted shrink-0 font-bold">[{log.timestamp}]</span>
                    <span className={`${color} shrink-0 font-bold`}>[{log.type}]</span>
                    <span className="break-words font-semibold">{log.message}</span>
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
            <button
              type="button"
              onClick={() => {
                triggerSound('click');
                setLogs([]);
              }}
              className="self-end text-xs text-muted hover:text-white flex items-center gap-1 border border-line bg-surface hover:bg-line px-2 py-1 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              {labelClear}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
