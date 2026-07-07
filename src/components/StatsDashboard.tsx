'use client';

import { useCalendarStore } from '@/store/useCalendarStore';

export default function StatsDashboard() {
  const { blocks, focusMinutesLogged } = useCalendarStore();

  const totalTasks = blocks.length;
  const completedTasks = blocks.filter(b => b.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const focusHours = Math.floor(focusMinutesLogged / 60);
  const focusMins = focusMinutesLogged % 60;

  // ASCII Progress Bar logic
  const barLength = 20;
  const filledBars = Math.floor((completionRate / 100) * barLength);
  const emptyBars = barLength - filledBars;
  const asciiBar = '[' + '█'.repeat(Math.max(0, filledBars)) + '·'.repeat(Math.max(0, emptyBars)) + ']';

  return (
    <div className="flex-1 overflow-auto bg-background p-8 relative flex flex-col items-center">
      
      {/* Sci-Fi Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-foreground) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          backgroundPosition: 'center'
        }} 
      />

      <div className="z-10 w-full max-w-4xl border border-foreground/20 bg-surface/80 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 mt-12 relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-color-amber to-transparent opacity-70" />
        
        <h2 className="text-2xl font-bold tracking-widest text-color-amber mb-8 text-center uppercase">System Telemetry</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Task Metrics */}
          <div className="border border-foreground/30 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-widest text-foreground/50 uppercase border-b border-foreground/10 pb-2">Task Execution</h3>
            
            <div className="flex justify-between items-end mt-2">
              <span className="text-xs uppercase tracking-widest text-foreground/70">Scheduled</span>
              <span className="text-2xl font-black">{totalTasks}</span>
            </div>
            
            <div className="flex justify-between items-end">
              <span className="text-xs uppercase tracking-widest text-foreground/70">Completed</span>
              <span className="text-2xl font-black text-color-green">{completedTasks}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-foreground/10 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold tracking-widest">
                <span>SUCCESS RATE</span>
                <span className="text-color-amber">{completionRate}%</span>
              </div>
              <div className="text-color-amber text-lg tracking-widest font-bold">
                {asciiBar}
              </div>
            </div>
          </div>

          {/* Deep Work Metrics */}
          <div className="border border-foreground/30 p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            
            <h3 className="text-sm font-bold tracking-widest text-foreground/50 uppercase border-b border-foreground/10 pb-2">Deep Work State</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="text-xs uppercase tracking-widest text-foreground/70 mb-2">Total Time Logged</div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-color-red drop-shadow-[0_0_15px_rgba(204,34,0,0.3)]">{focusHours}</span>
                <span className="text-sm font-bold uppercase text-foreground/50">HRS</span>
                <span className="text-6xl font-black tracking-tighter text-color-red drop-shadow-[0_0_15px_rgba(204,34,0,0.3)]">{focusMins.toString().padStart(2, '0')}</span>
                <span className="text-sm font-bold uppercase text-foreground/50">MIN</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
