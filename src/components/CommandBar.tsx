'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function CommandBar() {
  const { currentDate, viewMode, setViewMode, navigatePrevious, navigateNext, addBlock } = useCalendarStore();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => setTimeStr(format(new Date(), 'HH:mm:ss'));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex h-20 items-center justify-between border-b border-foreground px-6 bg-surface-raised uppercase text-sm font-bold">
      <div className="flex items-center gap-6">
        <span className="text-color-amber">SYS.TIME {timeStr || '--:--:--'}</span>
        <span>
          DATE: {format(currentDate, 'yyyy.MM.dd')}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={navigatePrevious}
          className="hover:text-color-amber hover:bg-foreground/10 px-2 py-1 transition-colors"
        >
          &lt; PREV
        </button>
        <button 
          onClick={navigateNext}
          className="hover:text-color-amber hover:bg-foreground/10 px-2 py-1 transition-colors"
        >
          NEXT &gt;
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            addBlock({
              title: 'NEW TASK',
              description: '',
              color: 'var(--color-green)',
              date: format(currentDate, 'yyyy-MM-dd'),
              startTime: '12:00',
              duration: 60,
            });
          }}
          className="bg-color-green text-[#050505] px-3 py-1 font-bold hover:scale-105 transition-transform"
        >
          [ + ADD TASK ]
        </button>
        <button 
          onClick={() => setViewMode('DAY')}
          className={`px-2 py-1 transition-colors ${viewMode === 'DAY' ? 'text-color-green' : 'hover:text-color-amber'}`}
        >
          {viewMode === 'DAY' ? '[ DAY ]' : 'DAY'}
        </button>
        <button 
          onClick={() => setViewMode('WEEK')}
          className={`px-2 py-1 transition-colors ${viewMode === 'WEEK' ? 'text-color-green' : 'hover:text-color-amber'}`}
        >
          {viewMode === 'WEEK' ? '[ WEEK ]' : 'WEEK'}
        </button>
      </div>
    </header>
  );
}
