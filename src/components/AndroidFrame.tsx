import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Zap, HelpCircle } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export default function AndroidFrame({ children }: AndroidFrameProps) {
  const [time, setTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(98);
  const [isCharging, setIsCharging] = useState(false);

  // Update time for the Android status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // first hour is 12
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // check each 30s
    return () => clearInterval(interval);
  }, []);

  // Soft battery decay simulation for cosmetic charm
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 12) {
          setIsCharging(true);
          return 95; // Reset to simulate power supply plugin
        }
        return prev - 1;
      });
    }, 180000); // decrement every 3 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="android-canvas-container" className="min-h-screen bg-[#121213] flex items-center justify-center p-0 md:p-6 select-none font-sans overflow-hidden">
      {/* Visual background ambient glow behind the phone mockup on desktop */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Main Physical Phone Mockup container on Desktop, raw screen container on mobile */}
      <div 
        id="android-device-wrapper"
        className="relative w-full h-screen md:h-[860px] md:w-[410px] md:rounded-[24px] md:border-[12px] md:border-[#3a3a3c] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] md:ring-4 md:ring-[#3a3a3c]/50 bg-[#121213] flex flex-col overflow-hidden"
      >
        {/* Punch Hole Camera Cutout - Only visible on desktop mockup */}
        <div className="hidden md:absolute md:top-3 md:left-1/2 md:-translate-x-1/2 md:w-3.5 md:h-3.5 md:rounded-full md:bg-[#1a1a1b] md:ring-2 md:ring-[#3a3a3c] md:z-50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        </div>

        {/* Android Status Bar at top */}
        <div className="h-7 px-6 bg-[#1a1a1b] flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#818384] select-none z-30 shrink-0 border-b border-[#3a3a3c]">
          <div className="flex items-center gap-1.5">
            <span>AIS-Mobile</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          </div>
          
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-[#818384]" />
            <Wifi className="w-3.5 h-3.5 text-[#818384]" />
            <div className="flex items-center gap-0.5">
              <span>{batteryLevel}%</span>
              <div className="relative flex items-center">
                <Battery className={`w-4 h-4 text-[#818384] ${batteryLevel < 20 ? 'text-rose-500 fill-rose-500/20' : ''}`} />
                {isCharging && <Zap className="w-2.5 h-2.5 text-emerald-400 absolute left-[3.5px] top-[3.5px]" />}
              </div>
            </div>
            <span className="font-mono ml-0.5">{time || '15:35'}</span>
          </div>
        </div>

        {/* Screen View Area */}
        <div className="flex-1 w-full flex flex-col relative overflow-hidden bg-[#121213]">
          {children}
        </div>

        {/* Home gesture bar / soft keys at base */}
        <div className="h-6 bg-[#1a1a1b] flex items-center justify-center z-30 shrink-0 select-none border-t border-[#3a3a3c]">
          {/* Subtle Android Gesture indicator bar */}
          <div className="w-24 h-1 rounded-full bg-[#3a3a3c]" />
        </div>
      </div>
    </div>
  );
}
