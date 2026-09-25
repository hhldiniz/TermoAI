import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

// Full-screen on phones; a phone-shaped card centered on larger screens.
export default function AndroidFrame({ children }: AndroidFrameProps) {
  return (
    <div id="android-canvas-container" className="relative min-h-screen bg-app flex items-center justify-center p-0 md:p-6 select-none font-sans overflow-hidden">
      {/* Visual background ambient glow behind the phone mockup on desktop */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div
        id="android-device-wrapper"
        className="relative w-full h-dvh md:h-[860px] md:max-h-[calc(100dvh-3rem)] md:w-[410px] md:rounded-[24px] md:border-[12px] md:border-line md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] md:ring-4 md:ring-line/50 bg-app flex flex-col overflow-hidden"
      >
        <div className="flex-1 w-full flex flex-col relative overflow-hidden bg-app">
          {children}
        </div>
      </div>
    </div>
  );
}
