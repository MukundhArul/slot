'use client';

import Sidebar from '@/components/Sidebar';
import CommandBar from '@/components/CommandBar';
import CalendarGrid from '@/components/CalendarGrid';
import FocusTimer from '@/components/FocusTimer';
import TaskModal from '@/components/TaskModal';
import { useCalendarStore } from '@/store/useCalendarStore';

export default function Home() {
  const { appMode } = useCalendarStore();

  return (
    <main className="flex flex-row h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <CommandBar />
        {appMode === 'PLANNER' ? <CalendarGrid /> : <FocusTimer />}
      </div>
      <TaskModal />
    </main>
  );
}
