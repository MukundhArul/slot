'use client';

import Sidebar from '@/components/Sidebar';
import CommandBar from '@/components/CommandBar';
import CalendarGrid from '@/components/CalendarGrid';
import FocusTimer from '@/components/FocusTimer';
import TaskModal from '@/components/TaskModal';
import StatsDashboard from '@/components/StatsDashboard';
import CommandLineInterface from '@/components/CommandLineInterface';
import { useCalendarStore } from '@/store/useCalendarStore';
import { playTerminalBeep, sendDesktopNotification } from '@/lib/notifications';
import { useEffect, useState } from 'react';

export default function Home() {
  const { 
    appMode, 
    theme, 
    timerIsActive, 
    timerTimeLeft, 
    timerMode, 
    timerDuration, 
    setTimerState, 
    addFocusMinutes,
    controlMode
  } = useCalendarStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global background timer ticking
  useEffect(() => {
    if (!mounted) return;
    let interval: NodeJS.Timeout;
    if (timerIsActive && timerTimeLeft > 0) {
      interval = setInterval(() => {
        setTimerState({ timerTimeLeft: timerTimeLeft - 1 });
      }, 1000);
    } else if (timerIsActive && timerTimeLeft === 0) {
      setTimerState({ timerIsActive: false });
      
      playTerminalBeep();
      if (timerMode === 'FOCUS') {
        sendDesktopNotification('FOCUS COMPLETE', `You logged ${timerDuration} minutes of deep work! Time for a break.`);
        addFocusMinutes(timerDuration);
      } else {
        sendDesktopNotification('BREAK COMPLETE', 'Break time is over. Ready to focus?');
      }
    }
    return () => clearInterval(interval);
  }, [timerIsActive, timerTimeLeft, timerMode, timerDuration, setTimerState, addFocusMinutes, mounted]);

  if (!mounted) {
    return (
      <main className="flex flex-row h-screen w-full bg-background items-center justify-center text-foreground font-mono text-sm font-bold">
        [ SYSTEM BOOTING... ]
      </main>
    );
  }

  return (
    <main className="flex flex-row h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <CommandBar />
        
        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto min-h-0 relative">
          {appMode === 'PLANNER' && <CalendarGrid />}
          {appMode === 'TIMER' && <FocusTimer />}
          {appMode === 'STATS' && <StatsDashboard />}
        </div>

        {/* Collapsible Full-Width CLI Drawer */}
        {controlMode === 'CLI' && <CommandLineInterface />}
      </div>
      <TaskModal />
    </main>
  );
}
