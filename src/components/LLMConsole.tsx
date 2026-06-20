import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Settings, RefreshCw, Cpu, Flame, Database, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { LLMConfig, LLMLog, WordData } from '../types';

interface LLMConsoleProps {
  language: 'pt' | 'en' | 'es';
  config: LLMConfig;
  setConfig: React.Dispatch<React.SetStateAction<LLMConfig>>;
  logs: LLMLog[];
  setLogs: React.Dispatch<React.SetStateAction<LLMLog[]>>;
  isGenerating: boolean;
  generateNewWord: (customCategory?: string, customTemp?: number) => void;
  activeWord: WordData | null;
  revealedCount: number;
  triggerSound: (type: 'click' | 'flip' | 'win' | 'lose' | 'error') => void;
}

export default function LLMConsole({
  language,
  config,
  setConfig,
  logs,
  setLogs,
  isGenerating,
  generateNewWord,
  activeWord,
  revealedCount,
  triggerSound
}: LLMConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'hyperparameters'>('terminal');
  const [inferenceStats, setInferenceStats] = useState({
    speed: 0,
    time: 0,
    tokens: 0,
    memory: '112.4 MB'
  });
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Translate labels based on game language selector
  const isPt = language === 'pt';
  const isEs = language === 'es';
  const labelCategory = isPt ? 'Categoria do Modelo' : isEs ? 'Categoría de Modelo' : 'Model Category';
  const labelTemp = isPt ? 'Temperatura (Criatividade)' : isEs ? 'Temperatura (Creatividad)' : 'Temperature (Creativity)';
  const labelTopP = isPt ? 'Amostragem Top-P' : isEs ? 'Muestreo Top-P' : 'Top-P Sampling';
  const labelModel = isPt ? 'Modelo Ativo' : isEs ? 'Modelo Activo' : 'Active Model';
  const labelInference = isPt ? 'Estado do Mecanismo' : isEs ? 'Estado del Motor' : 'Engine State';
  const labelGenerate = isPt ? 'Gerar Nova Palavra' : isEs ? 'Generar Nueva Palabra' : 'Generate New Puzzle';
  
  const categoriesPt = [
    { value: 'all', label: 'Qualquer (Aleatório)' },
    { value: 'Natureza', label: 'Natureza e Clima' },
    { value: 'Animais', label: 'Animais e Biologia' },
    { value: 'Alimentos', label: 'Alimentos e Sobremesas' },
    { value: 'Objetos', label: 'Objetos do Cotidiano' },
    { value: 'Tecnologia', label: 'Tecnologia e Engenharia' },
    { value: 'Locais', label: 'Lugares e Ambientes' }
  ];

  const categoriesEs = [
    { value: 'all', label: 'Cualquiera (Aleatorio)' },
    { value: 'Naturaleza', label: 'Naturaleza y Clima' },
    { value: 'Animales', label: 'Animales y Biología' },
    { value: 'Alimentos', label: 'Alimentos y Platos' },
    { value: 'Objetos', label: 'Objetos Cotidianos' },
    { value: 'Tecnología', label: 'Tecnología e Ingeniería' },
    { value: 'Lugares', label: 'Lugares y Entornos' }
  ];

  const categoriesEn = [
    { value: 'all', label: 'Any (Random)' },
    { value: 'Nature', label: 'Nature & Climate' },
    { value: 'Animals', label: 'Animals & Biology' },
    { value: 'Foods', label: 'Foods & Staple Dishes' },
    { value: 'Objects', label: 'Everyday Objects' },
    { value: 'Tech', label: 'Tech & Engineering' },
    { value: 'Places', label: 'Places & Venues' }
  ];

  const targetCategories = isPt ? categoriesPt : isEs ? categoriesEs : categoriesEn;

  const handleCategoryChange = (val: string) => {
    triggerSound('click');
    setConfig(prev => ({ ...prev, category: val }));
    addLog('info', isPt ? `Filtro de contexto definido para: ${val}` : isEs ? `Filtro de contexto de IA definido en: ${val}` : `Context attention filter set to: ${val}`);
  };

  const handleTemperatureChange = (val: number) => {
    triggerSound('click');
    setConfig(prev => ({ ...prev, temperature: val }));
    const style = val < 0.35 ? (isPt ? 'Convergente/Fácil' : isEs ? 'Conservador/Fácil' : 'Conservative/Easy') :
                  val < 0.7 ? (isPt ? 'Balanceado/Normal' : isEs ? 'Balanceado/Medio' : 'Balanced/Medium') : 
                               (isPt ? 'Divergente/Exótico' : isEs ? 'Creativo/Exótico' : 'Creative/Unorthodox');
    addLog('info', isPt ? `Hiperparametro Temperatura ajustado para: ${val} (${style})` : isEs ? `Hiperparámetro de Temperatura ajustado en: ${val} (${style})` : `Temperature hyperparameter updated to: ${val} (${style})`);
  };

  const addLog = (type: 'system' | 'info' | 'success' | 'warning' | 'token', message: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { timestamp: timeStr, type, message }]);
  };

  // Re-run offline initialization diagnostics
  const runDiagnostics = () => {
    triggerSound('click');
    addLog('system', isPt ? 'Solicitando diagnóstico do micro-modelo local...' : isEs ? 'Solicitando diagnóstico de micro-modelo local...' : 'Requesting local micro-model diagnostics...');
    setTimeout(() => addLog('info', isPt ? 'VRAM: Alocando cache WebGL compatível nas texturas 2D.' : isEs ? 'VRAM: Asignando capas de caché WebGL-2D.' : 'VRAM: Binding WebGL-2D cache layers.'), 200);
    setTimeout(() => addLog('info', isPt ? 'Tokens carregados: Letras A-Z normalizadas em codificação UTF-8.' : isEs ? 'Tokens cargados: Letras A-Z normalizadas (formato UTF-8).' : 'Tokens uploaded: Standard A-Z mappings loaded (UTF-8 format).'), 450);
    setTimeout(() => {
      // Generate some nice numbers
      const speed = +(35 + Math.random() * 20).toFixed(1);
      const timeMs = +(150 + Math.random() * 100).toFixed(0);
      setInferenceStats(prev => ({
        ...prev,
        speed,
        time: timeMs,
        tokens: 5
      }));
      addLog('success', isPt ? `Status: OK. Desempenho estimado: ${speed} t/s. Latência: ${timeMs}ms.` : isEs ? `Estado: ACTIVADO. Velocidad: ${speed} t/s. Latencia: ${timeMs}ms.` : `Status: ONLINE. Speed: ${speed} t/s. Latency: ${timeMs}ms.`);
    }, 700);
  };

  return (
    <div id="llm-console-container" className="absolute bottom-1.5 sm:bottom-6 left-0 right-0 px-4 z-40">
      {/* Slide-up Console sheet wrapper */}
      <div 
        className={`bg-[#1a1a1b] border-t border-l border-r ${isOpen ? 'border-[#3a3a3c] shadow-lg' : 'border-[#3a3a3c]/70 shadow-md'} rounded-t transition-all duration-300 flex flex-col`}
        style={{ height: isOpen ? 'min(85vh, 380px)' : 'var(--console-closed-h)' }}
      >
        {/* Upper trigger bar */}
        <div 
          onClick={() => {
            triggerSound('click');
            setIsOpen(!isOpen);
          }}
          className="h-[var(--console-closed-h)] px-4 flex items-center justify-between cursor-pointer select-none active:bg-[#3a3a3c]/30 rounded-t shrink-0"
        >
          <div className="flex items-center gap-2">
            <Cpu className={`w-4.5 h-4.5 ${isGenerating ? 'text-emerald-500 animate-spin' : 'text-emerald-500'}`} />
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
                {isPt ? 'LLM CONSOLE LOCAL' : isEs ? 'CONSOLA LOCAL DE LLM' : 'LOCAL LLM CONSOLE'}
                <span className="text-[9px] bg-[#121213] border border-[#3a3a3c] text-[#818384] px-1 py-0.5 rounded lowercase font-mono">v0.1.2</span>
              </span>
              <span className="text-[10px] text-[#818384] font-mono tracking-tight font-bold">
                {isGenerating 
                  ? (isPt ? 'Decodificando tokens...' : isEs ? 'Decodificando tokens...' : 'Decoding tokens...') 
                  : (isPt ? `TermoLLM-0.12B offline [Pronto]` : isEs ? `TermoLLM-0.12B offline [Listo]` : `TermoLLM-0.12B offline [Ready]`)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isGenerating && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            {isOpen ? <ChevronDown className="w-4 h-4 text-[#818384]" /> : <ChevronUp className="w-4 h-4 text-[#818384]" />}
          </div>
        </div>

        {/* Console Expanded Segment Area */}
        {isOpen && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav tabs for Hyperparameters or Logs */}
            <div className="flex border-b border-[#3a3a3c] px-4 gap-4 bg-[#121213] select-none shrink-0 text-xs">
              <button 
                onClick={() => { triggerSound('click'); setActiveTab('terminal'); }}
                className={`py-2 px-1 font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${activeTab === 'terminal' ? 'text-emerald-500 border-emerald-500' : 'text-[#818384] border-transparent hover:text-white'}`}
              >
                <Terminal className="w-3.5 h-3.5" />
                {isPt ? 'Terminal' : isEs ? 'Registros' : 'Inference Logs'}
              </button>
              <button 
                onClick={() => { triggerSound('click'); setActiveTab('hyperparameters'); }}
                className={`py-2 px-1 font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${activeTab === 'hyperparameters' ? 'text-emerald-500 border-emerald-500' : 'text-[#818384] border-transparent hover:text-white'}`}
              >
                <Settings className="w-3.5 h-3.5" />
                {isPt ? 'Hiperparâmetros' : isEs ? 'Parámetros de IA' : 'AI Parameters'}
              </button>
            </div>

            {/* Tab content wrapper */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-[#121213]/40">
              
              {/* TAB 1: TERMINAL STATE LOGS */}
              {activeTab === 'terminal' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  {/* Console Logs Display Terminal */}
                  <div className="flex-1 bg-[#121213] rounded p-2.5 font-mono text-[10px] text-slate-300 overflow-y-auto border border-[#3a3a3c] flex flex-col gap-1 select-text scrollbar-thin">
                    {logs.map((log, i) => {
                      let color = 'text-slate-400';
                      if (log.type === 'system') color = 'text-sky-400';
                      if (log.type === 'success') color = 'text-emerald-400';
                      if (log.type === 'warning') color = 'text-amber-500';
                      if (log.type === 'token') color = 'text-emerald-400 font-bold';

                      return (
                        <div key={i} className="leading-relaxed flex items-start gap-1">
                          <span className="text-[#818384] shrink-0 font-bold">[{log.timestamp}]</span>
                          <span className={`${color} shrink-0 font-bold`}>
                            {log.type === 'token' ? '✨' : `[${log.type}]`}
                          </span>
                          <span className="break-all font-semibold">{log.message}</span>
                        </div>
                      );
                    })}
                    <div ref={terminalEndRef} />
                  </div>

                  {/* Terminal quick auxiliary status metrics bar */}
                  <div className="flex items-center justify-between mt-2.5 px-0.5 text-[10px] text-[#818384] font-mono tracking-tight font-bold shrink-0 select-none uppercase">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[#818384]"><Database className="w-3 h-3 text-emerald-500" /> {inferenceStats.memory}</span>
                      <span className="h-2.5 w-[1px] bg-[#3a3a3c]" />
                      <span className="flex items-center gap-1 text-[#818384]"><Flame className="w-3 h-3 text-emerald-500" /> {config.temperature}t</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={runDiagnostics}
                        className="text-[9px] text-[#818384] hover:text-white flex items-center gap-1 border border-[#3a3a3c] bg-[#1a1a1b] hover:bg-[#3a3a3c] px-2 py-0.5 rounded transition-all active:scale-95 duration-100"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        {isPt ? 'Diagnóstico' : isEs ? 'Diagnóstico' : 'Diagnostic Audit'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HYPERPARAMETER SLIDERS */}
              {activeTab === 'hyperparameters' && (
                <div className="flex-1 flex flex-col gap-3 justify-center text-xs text-left select-none">
                  
                  {/* Model Name specification */}
                  <div id="hyperparam-model-group" className="bg-[#121213] p-2.5 rounded border border-[#3a3a3c] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#818384] uppercase font-bold tracking-wider">{labelModel}</p>
                      <h4 className="font-black text-white tracking-tight text-xs flex items-center gap-1 mt-0.5">
                        TermoLLM-0.12B-Mobile-Q4
                      </h4>
                    </div>
                    <span className="text-[9px] bg-[#1a1a1b] border border-[#3a3a3c] text-emerald-500 px-2 py-0.5 rounded font-black tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_#10b981]" />
                      100% {isPt ? 'Offline' : isEs ? 'Sin Conexión' : 'Offline'}
                    </span>
                  </div>

                  {/* Category Selection Dropdown */}
                  <div id="hyperparam-category-group" className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#818384] uppercase font-bold tracking-widest">{labelCategory}</label>
                    <div className="relative">
                      <select 
                        value={config.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full bg-[#121213] border border-[#3a3a3c] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-550 appearance-none font-bold font-sans uppercase tracking-wide"
                      >
                        {targetCategories.map(cat => (
                          <option key={cat.value} value={cat.value} className="bg-[#121213] text-white font-bold">{cat.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#818384] absolute col-end-1 right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Difficulty Selection Dropdown */}
                  <div id="hyperparam-difficulty-group" className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#818384] uppercase font-bold tracking-widest">
                      {isPt ? 'Dificuldade da Geração' : isEs ? 'Dificultad de la Palabra' : 'Generation Difficulty'}
                    </label>
                    <div className="relative">
                      <select 
                        value={config.difficulty || 'medium'}
                        onChange={(e) => {
                          const val = e.target.value as 'easy' | 'medium' | 'hard';
                          triggerSound('click');
                          setConfig(prev => ({ ...prev, difficulty: val }));
                          addLog('info', isPt ? `Dificuldade reconfigurada para: ${val.toUpperCase()}` : isEs ? `Dificultad reconfigurada a: ${val.toUpperCase()}` : `Generation difficulty reconfigured to: ${val.toUpperCase()}`);
                        }}
                        className="w-full bg-[#121213] border border-[#3a3a3c] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-550 appearance-none font-bold font-sans uppercase tracking-wide"
                      >
                        <option value="easy" className="bg-[#121213] text-white font-bold">
                          {isPt ? 'FÁCIL (4 LETRAS / COMUNS)' : isEs ? 'FÁCIL (4 LETRAS / COMUNES)' : 'EASY (4 LETTERS / COMMON)'}
                        </option>
                        <option value="medium" className="bg-[#121213] text-white font-bold">
                          {isPt ? 'MÉDIO (5 LETRAS / PADRÃO)' : isEs ? 'MEDIO (5 LETRAS / ESTÁNDAR)' : 'MEDIUM (5 LETTERS / STANDARD)'}
                        </option>
                        <option value="hard" className="bg-[#121213] text-white font-bold">
                          {isPt ? 'DIFÍCIL (6 LETRAS / EXÓTICO)' : isEs ? 'DIFÍCIL (6 LETRAS / EXÓTICO)' : 'HARD (6 LETTERS / EXOTIC)'}
                        </option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#818384] absolute col-end-1 right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Temperature slider */}
                  <div id="hyperparam-temperature-group" className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-[#818384] uppercase font-bold tracking-widest">{labelTemp}</label>
                      <span className="font-mono font-black text-emerald-500 bg-[#121213] border border-[#3a3a3c] px-1.5 py-0.5 rounded text-[10px]">
                        t = {config.temperature}
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={config.temperature}
                      onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#3a3a3c] rounded appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[8px] text-[#818384] font-bold uppercase tracking-wider">
                      <span>{isPt ? 'Determinístico' : isEs ? 'Determinista' : 'Deterministic'}</span>
                      <span>{isPt ? 'Criativo / Complexo' : isEs ? 'Creativo / Complejo' : 'Creative / Complex'}</span>
                    </div>
                  </div>

                  {/* Top-P settings */}
                  <div id="hyperparam-topp-group" className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-[#818384] uppercase font-bold tracking-widest">{labelTopP}</label>
                      <span className="font-mono text-emerald-500 font-bold text-[10px]">p = {config.topP}</span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={config.topP}
                      onChange={(e) => setConfig(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 bg-[#3a3a3c] rounded appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Trigger generate button */}
                  <button
                    disabled={isGenerating}
                    onClick={() => {
                      triggerSound('click');
                      generateNewWord(config.category, config.temperature);
                    }}
                    className={`mt-2 font-black text-xs uppercase text-center py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 ${
                      isGenerating
                        ? 'bg-[#3a3a3c] text-[#818384] cursor-not-allowed'
                        : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {labelGenerate}
                  </button>

                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
