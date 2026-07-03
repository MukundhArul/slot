'use client';

import { useState, useEffect } from 'react';

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Timer finished!
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'FOCUS' | 'BREAK') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Progress bar logic
  const totalSeconds = mode === 'FOCUS' ? 25 * 60 : 5 * 60;
  const progress = 1 - (timeLeft / totalSeconds);
  const barLength = 40;
  const filledBars = Math.floor(progress * barLength);
  const emptyBars = barLength - filledBars;
  const asciiBar = '[' + '█'.repeat(Math.max(0, filledBars)) + '·'.repeat(Math.max(0, emptyBars)) + ']';

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Sci-Fi Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-foreground) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          backgroundPosition: 'center'
        }} 
      />
      
      {/* Timer Container */}
      <div className="z-10 flex flex-col items-center gap-12 p-16 border border-foreground/20 bg-surface/80 backdrop-blur-md relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Glowing top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-color-amber to-transparent opacity-70" />
        
        {/* Mode Selector */}
        <div className="flex gap-6">
          <button 
            onClick={() => switchMode('FOCUS')}
            className={`px-6 py-2 font-bold tracking-widest text-sm transition-all border ${mode === 'FOCUS' ? 'bg-color-red text-black border-color-red' : 'border-foreground/30 text-foreground/50 hover:border-foreground hover:text-foreground'}`}
          >
            {mode === 'FOCUS' ? '[ FOCUS ]' : 'FOCUS'}
          </button>
          <button 
            onClick={() => switchMode('BREAK')}
            className={`px-6 py-2 font-bold tracking-widest text-sm transition-all border ${mode === 'BREAK' ? 'bg-color-blue text-black border-color-blue' : 'border-foreground/30 text-foreground/50 hover:border-foreground hover:text-foreground'}`}
          >
            {mode === 'BREAK' ? '[ BREAK ]' : 'BREAK'}
          </button>
        </div>

        {/* Countdown Display */}
        <div className="flex flex-col items-center">
          <div className="text-[10rem] leading-none font-black tracking-tighter text-foreground drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="mt-8 text-color-amber font-bold tracking-widest text-lg">
            {asciiBar}
          </div>
          <div className="mt-4 text-xs text-foreground/50 tracking-widest uppercase flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-color-amber animate-pulse shadow-[0_0_8px_var(--color-amber)]' : 'bg-foreground/30'}`}></span>
            SYSTEM STATUS: {isActive ? 'ACTIVE' : 'STANDBY'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-8 mt-4">
          <button 
            onClick={toggleTimer}
            className="px-10 py-4 bg-foreground text-background font-bold tracking-widest hover:bg-color-amber hover:text-black transition-all border border-foreground hover:border-color-amber shadow-[0_0_10px_transparent] hover:shadow-[0_0_20px_var(--color-amber)] uppercase text-lg"
          >
            {isActive ? '[ PAUSE ]' : '[ START ]'}
          </button>
          <button 
            onClick={resetTimer}
            className="px-10 py-4 bg-transparent text-foreground font-bold tracking-widest hover:bg-color-red hover:text-background transition-all border border-foreground/30 hover:border-color-red uppercase text-lg"
          >
            [ RESET ]
          </button>
        </div>
      </div>
    </div>
  );
}
