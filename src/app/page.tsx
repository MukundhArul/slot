'use client';

import Sidebar from '@/components/Sidebar';
import CommandBar from '@/components/CommandBar';
import CalendarGrid from '@/components/CalendarGrid';
import TaskModal from '@/components/TaskModal';

export default function Home() {
  return (
    <main className="flex flex-row h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <CommandBar />
        <CalendarGrid />
      </div>
      <TaskModal />
    </main>
  );
}
