'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { format, addDays } from 'date-fns';
import { useEffect, useState } from 'react';

export default function CommandBar() {
  const { currentDate, viewMode, setViewMode, navigatePrevious, navigateNext, addBlock, duplicateDay, setMobileMenuOpen } = useCalendarStore();
  const [timeStr, setTimeStr] = useState('');
  
  const [showDupModal, setShowDupModal] = useState(false);
  const [sourceDate, setSourceDate] = useState(format(currentDate, 'yyyy-MM-dd'));
  const [targetDate, setTargetDate] = useState(format(addDays(currentDate, 1), 'yyyy-MM-dd'));

  useEffect(() => {
    const updateTime = () => setTimeStr(format(new Date(), 'HH:mm:ss'));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update modal defaults when current date changes
  useEffect(() => {
    if (!showDupModal) {
      setSourceDate(format(currentDate, 'yyyy-MM-dd'));
      setTargetDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'));
    }
  }, [currentDate, showDupModal]);

  return (
    <>
      <header className="flex h-auto min-h-20 py-4 items-center justify-between border-b border-foreground px-4 md:px-6 bg-surface-raised uppercase text-sm font-bold flex-wrap gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={() => setMobileMenuOpen(true)} 
          className="md:hidden flex items-center justify-center p-1 border border-foreground/50 text-foreground hover:bg-foreground hover:text-background transition-colors"
          title="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <span className="text-color-amber whitespace-nowrap">SYS.TIME {timeStr || '--:--:--'}</span>
        <span className="whitespace-nowrap">
          DATE: {format(currentDate, 'yyyy.MM.dd')}
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
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

      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <button
          onClick={() => setShowDupModal(true)}
          className="text-color-amber border border-color-amber/50 px-3 py-1 font-bold hover:bg-color-amber/10 transition-colors"
        >
          [ DUPLICATE DAY ]
        </button>
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

      {/* Duplicate Day Modal */}
      {showDupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border-2 border-foreground p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] flex flex-col gap-4 w-[350px] uppercase font-bold text-sm">
            <h2 className="text-color-amber text-lg">DUPLICATE DAY</h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-foreground/70">FROM DATE</label>
              <input 
                type="date" 
                value={sourceDate} 
                onChange={e => setSourceDate(e.target.value)} 
                className="bg-background border border-foreground/50 px-2 py-2 font-mono outline-none focus:border-color-amber text-foreground" 
              />
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-xs text-foreground/70">TO DATE</label>
              <input 
                type="date" 
                value={targetDate} 
                onChange={e => setTargetDate(e.target.value)} 
                className="bg-background border border-foreground/50 px-2 py-2 font-mono outline-none focus:border-color-amber text-foreground" 
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={() => setShowDupModal(false)} 
                className="text-foreground hover:bg-foreground/10 px-2 py-1 transition-colors"
              >
                [ CANCEL ]
              </button>
              <button 
                onClick={() => {
                  duplicateDay(sourceDate, targetDate);
                  setShowDupModal(false);
                }} 
                className="text-color-green hover:bg-color-green/10 px-2 py-1 transition-colors"
              >
                [ DUPLICATE ]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
