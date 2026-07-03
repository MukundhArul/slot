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
    <header className="flex items-center justify-between border-b border-foreground p-4 bg-surface-raised uppercase text-sm font-bold shadow-md">
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
