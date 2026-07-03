'use client';

import CommandBar from '@/components/CommandBar';
import CalendarGrid from '@/components/CalendarGrid';
import TaskModal from '@/components/TaskModal';

export default function Home() {
  return (
    <main className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <CommandBar />
      <CalendarGrid />
      <TaskModal />
    </main>
  );
}
