'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function CommandBar() {
  const { currentDate, viewMode, setViewMode, navigatePrevious, navigateNext } = useCalendarStore();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => setTimeStr(format(new Date(), 'HH:mm:ss'));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex h-20 items-center justify-between border-b border-foreground px-6 bg-surface-raised uppercase text-sm font-bold">
      <div className="flex gap-4">
        <span className="text-amber">SYS.TIME {timeStr || '--:--:--'}</span>
        <span className="opacity-50">DATE: {format(currentDate, 'yyyy.MM.dd')}</span>
      </div>

      <div className="flex gap-1 text-sm font-bold">
        <button 
          onClick={navigatePrevious}
          className="hover:text-amber hover:bg-foreground/10 px-2 py-1 transition-colors"
        >
          &lt; PREV
        </button>
        <button 
          onClick={navigateNext}
          className="hover:text-amber hover:bg-foreground/10 px-2 py-1 transition-colors"
        >
          NEXT &gt;
        </button>
      </div>

      <div className="flex gap-2 text-sm font-bold bg-foreground/10 p-1">
        <button 
          onClick={() => setViewMode('DAY')}
          className={`px-2 py-1 transition-colors ${viewMode === 'DAY' ? 'text-green' : 'hover:text-amber'}`}
        >
          DAY
        </button>
        <button 
          onClick={() => setViewMode('WEEK')}
          className={`px-2 py-1 transition-colors ${viewMode === 'WEEK' ? 'text-green' : 'hover:text-amber'}`}
        >
          WEEK
        </button>
      </div>
    </header>
  );
}
