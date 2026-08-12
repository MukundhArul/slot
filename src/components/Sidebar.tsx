'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, format, addMonths, addDays
} from 'date-fns';
import { useState } from 'react';

export default function Sidebar() {
  const { currentDate, setCurrentDate, theme, setTheme, mobileMenuOpen, setMobileMenuOpen, controlMode, setControlMode } = useCalendarStore();
  const [calendarDate, setCalendarDate] = useState(currentDate);

  // Calculate grid for mini calendar
  const monthStart = startOfMonth(calendarDate);
  const startDate = startOfWeek(monthStart);
  
  // Guarantee 42 days (6 weeks) for consistent calendar height
  const endDate = addDays(startDate, 41);

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => setCalendarDate(addMonths(calendarDate, 1));
  const prevMonth = () => setCalendarDate(addMonths(calendarDate, -1));

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <>
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside className={`w-64 border-r border-foreground bg-surface flex flex-col flex-shrink-0 absolute md:relative z-40 h-full transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Logo Area */}
        <div className="py-4 border-b border-foreground flex flex-col justify-center gap-3 px-6 bg-surface-raised flex-shrink-0 min-h-[5rem]">
          <div className="flex items-center gap-4">
            <svg className="w-10 h-10 theme-logo" viewBox="0 0 108.89 108.89" xmlns="http://www.w3.org/2000/svg">
              <g>
                <rect x="18.15" width="18.15" height="18.15"/>
                <rect x="18.15" y="36.3" width="18.15" height="36.3"/>
                <rect x="18.15" y="90.74" width="18.15" height="18.15"/>
                <rect x="72.6" width="18.15" height="18.15"/>
                <rect x="72.6" y="36.3" width="18.15" height="36.3"/>
                <rect x="72.6" y="90.74" width="18.15" height="18.15"/>
                <rect x="0" y="18.15" width="18.15" height="18.15"/>
                <rect x="36.3" y="18.15" width="36.3" height="18.15"/>
                <rect x="90.74" y="18.15" width="18.15" height="18.15"/>
                <rect x="0" y="72.6" width="18.15" height="18.15"/>
                <rect x="36.3" y="72.6" width="36.3" height="18.15"/>
                <rect x="90.74" y="72.6" width="18.15" height="18.15"/>
              </g>
            </svg>
            <h1 className="text-2xl font-bold tracking-widest text-foreground">SLOT</h1>
          </div>
          <button
            onClick={() => setControlMode(controlMode === 'GUI' ? 'CLI' : 'GUI')}
            className="text-[10px] font-bold self-start border border-foreground/30 px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors"
          >
            MODE: {controlMode === 'GUI' ? '[ GUI ]' : '[ CLI ]'}
          </button>
        </div>

        {/* Scrollable middle container */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 custom-scrollbar">

          {/* Mini Calendar */}
          <div className="p-4 mt-auto flex-shrink-0 border-t border-foreground/10">
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
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, monthStart);
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentDate(day)}
                    className={`
                      aspect-square flex items-center justify-center transition-colors relative
                      ${!isCurrentMonth ? 'text-foreground/30' : 'hover:bg-foreground/10'}
                      ${isSelected ? 'bg-foreground/20 font-black' : ''}
                      ${isToday ? 'rounded-full border text-foreground bg-transparent' : ''}
                    `}
                    style={{
                      borderColor: isToday ? 'var(--color-red)' : 'transparent'
                    }}
                  >
                    {format(day, dateFormat)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Themes */}
          {controlMode !== 'CLI' && (
            <div className="p-4 border-t border-foreground/20 flex-shrink-0">
              <h3 className="text-xs font-bold text-foreground/50 mb-2">THEME</h3>
              <div className="flex flex-col gap-1">
                <button onClick={() => setTheme('PAPER')} className={`text-left px-2 py-1 text-xs font-bold ${theme === 'PAPER' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}>[ PAPER ]</button>
                <button onClick={() => setTheme('DARK_AMBER')} className={`text-left px-2 py-1 text-xs font-bold ${theme === 'DARK_AMBER' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}>[ DARK AMBER ]</button>
                <button onClick={() => setTheme('E_INK')} className={`text-left px-2 py-1 text-xs font-bold ${theme === 'E_INK' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}>[ E-INK ]</button>
              </div>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
