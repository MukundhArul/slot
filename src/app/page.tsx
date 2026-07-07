'use client';

import Sidebar from '@/components/Sidebar';
import CommandBar from '@/components/CommandBar';
import CalendarGrid from '@/components/CalendarGrid';
import FocusTimer from '@/components/FocusTimer';
import TaskModal from '@/components/TaskModal';
import StatsDashboard from '@/components/StatsDashboard';
import { useCalendarStore } from '@/store/useCalendarStore';
import { useEffect } from 'react';

export default function Home() {
  const { appMode, theme } = useCalendarStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <main className="flex flex-row h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <CommandBar />
        {appMode === 'PLANNER' && <CalendarGrid />}
        {appMode === 'TIMER' && <FocusTimer />}
        {appMode === 'STATS' && <StatsDashboard />}
      </div>
      <TaskModal />
    </main>
  );
}
