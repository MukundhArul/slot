'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, format, addMonths 
} from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';

export default function Sidebar() {
  const { currentDate, setCurrentDate } = useCalendarStore();
  const [calendarDate, setCalendarDate] = useState(currentDate);

  // Calculate grid for mini calendar
  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => setCalendarDate(addMonths(calendarDate, 1));
  const prevMonth = () => setCalendarDate(addMonths(calendarDate, -1));

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <aside className="w-64 border-r border-foreground bg-surface flex flex-col flex-shrink-0">
      {/* Logo Area */}
      <div className="h-20 border-b border-foreground flex items-center gap-4 px-6 bg-surface-raised">
        <Image src="/logo.svg" alt="SLOT Logo" width={40} height={40} className="invert dark:invert-0" />
        <h1 className="text-2xl font-bold tracking-widest text-foreground">SLOT</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 border-b border-foreground flex flex-col gap-2">
        <button className="text-left px-3 py-2 bg-foreground text-background font-bold uppercase transition-colors">
          [ DAY PLANNER ]
        </button>
        <button className="text-left px-3 py-2 hover:bg-foreground/10 hover:text-color-amber font-bold uppercase transition-colors border border-transparent hover:border-foreground/20">
          FOCUS TIMER
        </button>
      </nav>

      {/* Mini Calendar */}
      <div className="p-4 border-b border-foreground">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-sm">{format(calendarDate, 'MMMM yyyy').toUpperCase()}</span>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="hover:text-color-amber">&lt;</button>
            <button onClick={nextMonth} className="hover:text-color-amber">&gt;</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-2 text-foreground/50">
          {weekDays.map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {days.map((day, idx) => {
            const isSelected = isSameDay(day, currentDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            return (
              <button
                key={idx}
                onClick={() => setCurrentDate(day)}
                className={`
                  aspect-square flex items-center justify-center border transition-colors
                  ${!isCurrentMonth ? 'text-foreground/30 border-transparent' : 'border-foreground/10 hover:border-foreground/50'}
                  ${isSelected ? 'bg-color-amber text-background border-color-amber' : ''}
                `}
              >
                {format(day, dateFormat)}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
