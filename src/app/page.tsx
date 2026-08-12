'use client';

import Sidebar from '@/components/Sidebar';
import CommandBar from '@/components/CommandBar';
import CalendarGrid from '@/components/CalendarGrid';
import TaskModal from '@/components/TaskModal';
import CommandLineInterface from '@/components/CommandLineInterface';
import Scratchpad from '@/components/Scratchpad';
import { useCalendarStore } from '@/store/useCalendarStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const { 
    theme, 
    controlMode
  } = useCalendarStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
        <div className="flex-1 overflow-auto min-h-0 relative flex">
          <CalendarGrid />
          <Scratchpad />
        </div>

        {/* Collapsible Full-Width CLI Drawer */}
        {controlMode === 'CLI' && <CommandLineInterface />}
      </div>
      <TaskModal />
    </main>
  );
}
