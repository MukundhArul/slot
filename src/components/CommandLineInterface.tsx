'use client';

import { useState, useEffect, useRef } from 'react';
import { useCalendarStore } from '@/store/useCalendarStore';
import { format } from 'date-fns';

type LogEntry = {
  text: string;
  type: 'info' | 'success' | 'error' | 'input';
};

export default function CommandLineInterface() {
  const {
    currentDate,
    blocks,
    addBlock,
    updateBlock,
    removeBlock,
    setViewMode,
    setTheme,
    navigatePrevious,
    navigateNext,
    setMobileMenuOpen,
    setCliOpen,
    controlMode
  } = useCalendarStore();

  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: 'SLOT TERMINAL SHELL V1.0.0', type: 'info' },
    { text: controlMode === 'CLI' ? "TYPE '/help' FOR COMMANDS." : "PRESS '/' KEY TO FOCUS. TYPE '/help' FOR COMMANDS.", type: 'info' }
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Global keydown to focus CLI on '/'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        if (controlMode !== 'CLI') {
          setCliOpen(true);
        }
        // open mobile sidebar if active on small screen
        if (window.innerWidth < 768) {
          setMobileMenuOpen(true);
        }
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [setMobileMenuOpen, setCliOpen, controlMode]);

  // Helper: parse duration string (e.g. 1.5h, 45m, 60) to minutes
  const parseDuration = (str: string): number => {
    const cleaned = str.trim().toLowerCase();
    const num = parseFloat(cleaned);
    if (isNaN(num)) return 30; // default 30m
    if (cleaned.includes('h') || cleaned.includes('hour')) {
      return Math.round(num * 60);
    }
    return Math.round(num);
  };

  const executeCommand = (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    // Add to input log
    const newLogs = [...logs, { text: `> ${trimmed}`, type: 'input' as const }];
    setLogs(newLogs);

    // Save to typed history
    const updatedHistory = [trimmed, ...cmdHistory.filter(h => h !== trimmed)].slice(0, 50);
    setCmdHistory(updatedHistory);
    setHistoryIndex(-1);

    const logOutput = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
      setLogs(prev => [...prev, { text, type }]);
    };

    // Parse commands
    const parts = trimmed.split(/\s+/);
    const mainCommand = parts[0].toLowerCase();

    if (mainCommand === '/help') {
      logOutput('HELP - AVAILABLE COMMANDS:', 'info');
      logOutput('  /add "<title>" HH:MM [dur] -> Add task (e.g. 1.5h, 45m)', 'info');
      logOutput('  /done "<title>" or /complete "<title>" -> Complete task', 'info');
      logOutput('  /undone "<title>" or /uncomplete "<title>" -> Reactivate task', 'info');
      logOutput('  /rm "<title>" or /remove "<title>" -> Remove task', 'info');
      logOutput('  /theme <paper | dark_amber | e_ink>', 'info');
      logOutput('  /view <day | week>', 'info');
      logOutput('  /next | /prev -> Navigate active date', 'info');
      logOutput('  /clear -> Clears tasks scheduled on active date', 'info');
      if (controlMode !== 'CLI') {
        logOutput('  /close | /exit -> Minimizes/closes the shell panel', 'info');
      }
      return;
    }

    if (mainCommand === '/close' || mainCommand === '/exit') {
      if (controlMode === 'CLI') {
        logOutput('ERR: SHELL CANNOT BE CLOSED IN CLI CONTROL MODE', 'error');
      } else {
        setCliOpen(false);
      }
      return;
    }

    if (mainCommand === '/add') {
      // Match: /add "title" HH:MM [duration]
      const regex = /^\/add\s+"([^"]+)"\s+(\d{1,2}:\d{2})(?:\s+(\S+))?$/i;
      const match = trimmed.match(regex);

      if (!match) {
        logOutput('ERR: FORMAT MUST BE: /add "Title" HH:MM [duration]', 'error');
        logOutput('  E.G., /add "Review PRs" 14:30 1.5h', 'info');
        return;
      }

      const title = match[1];
      const timeStr = match[2];
      const durStr = match[3] || '30m';
      const duration = parseDuration(durStr);
      const dateStr = format(currentDate, 'yyyy-MM-dd');

      addBlock({
        title,
        description: '',
        color: 'bg-color-amber/10',
        date: dateStr,
        startTime: timeStr,
        duration
      });

      logOutput(`SUCCESS: ADDED "${title.toUpperCase()}" AT ${timeStr} FOR ${durStr}`, 'success');
      return;
    }

    if (mainCommand === '/complete' || mainCommand === '/done') {
      const regex = /^\/(?:complete|done)\s+"([^"]+)"$/i;
      const match = trimmed.match(regex);
      if (!match) {
        logOutput('ERR: FORMAT MUST BE: /done "Title" or /complete "Title"', 'error');
        return;
      }
      const title = match[1];
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const task = blocks.find(b => b.date === dateStr && b.title.toLowerCase() === title.toLowerCase());
      if (!task) {
        logOutput(`ERR: TASK NOT FOUND: "${title}" ON THIS DATE`, 'error');
      } else {
        updateBlock(task.id, { completed: true });
        logOutput(`SUCCESS: TASK "${title.toUpperCase()}" COMPLETED`, 'success');
      }
      return;
    }

    if (mainCommand === '/uncomplete' || mainCommand === '/undone') {
      const regex = /^\/(?:uncomplete|undone)\s+"([^"]+)"$/i;
      const match = trimmed.match(regex);
      if (!match) {
        logOutput('ERR: FORMAT MUST BE: /undone "Title" or /uncomplete "Title"', 'error');
        return;
      }
      const title = match[1];
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const task = blocks.find(b => b.date === dateStr && b.title.toLowerCase() === title.toLowerCase());
      if (!task) {
        logOutput(`ERR: TASK NOT FOUND: "${title}" ON THIS DATE`, 'error');
      } else {
        updateBlock(task.id, { completed: false });
        logOutput(`SUCCESS: TASK "${title.toUpperCase()}" MARKED ACTIVE`, 'success');
      }
      return;
    }

    if (mainCommand === '/remove' || mainCommand === '/rm') {
      const regex = /^\/(?:remove|rm)\s+"([^"]+)"$/i;
      const match = trimmed.match(regex);
      if (!match) {
        logOutput('ERR: FORMAT MUST BE: /rm "Title" or /remove "Title"', 'error');
        return;
      }
      const title = match[1];
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const task = blocks.find(b => b.date === dateStr && b.title.toLowerCase() === title.toLowerCase());
      if (!task) {
        logOutput(`ERR: TASK NOT FOUND: "${title}" ON THIS DATE`, 'error');
      } else {
        removeBlock(task.id);
        logOutput(`SUCCESS: REMOVED TASK "${title.toUpperCase()}"`, 'success');
      }
      return;
    }

    if (mainCommand === '/theme') {
      const themeArg = parts[1]?.toLowerCase();
      if (!themeArg) {
        logOutput('ERR: CHOOSE A THEME (paper, dark_amber, e_ink)', 'error');
        return;
      }

      const normalized = themeArg.replace('-', '_').toUpperCase();
      if (normalized === 'PAPER' || normalized === 'DARK_AMBER' || normalized === 'E_INK') {
        setTheme(normalized as any);
        logOutput(`SUCCESS: THEME SWITCHED TO ${normalized}`, 'success');
      } else {
        logOutput(`ERR: UNKNOWN THEME: "${themeArg}"`, 'error');
      }
      return;
    }


    if (mainCommand === '/view') {
      const viewArg = parts[1]?.toLowerCase();
      if (!viewArg) {
        logOutput('ERR: CHOOSE A PLANNER VIEW (day, week)', 'error');
        return;
      }

      const normalized = viewArg.toUpperCase();
      if (normalized === 'DAY' || normalized === 'WEEK') {
        setViewMode(normalized as any);
        logOutput(`SUCCESS: PLANNER VIEW SET TO ${normalized}`, 'success');
      } else {
        logOutput(`ERR: UNKNOWN VIEW: "${viewArg}"`, 'error');
      }
      return;
    }

    if (mainCommand === '/next') {
      navigateNext();
      logOutput('SUCCESS: NAVIGATED TO NEXT INTERVAL', 'success');
      return;
    }

    if (mainCommand === '/prev') {
      navigatePrevious();
      logOutput('SUCCESS: NAVIGATED TO PREVIOUS INTERVAL', 'success');
      return;
    }

    if (mainCommand === '/clear') {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const todayBlocks = blocks.filter(b => b.date === dateStr);
      if (todayBlocks.length === 0) {
        logOutput(`INFO: NO BLOCKS SCHEDULED ON ${dateStr}`, 'info');
      } else {
        todayBlocks.forEach(b => removeBlock(b.id));
        logOutput(`SUCCESS: CLEARED ${todayBlocks.length} BLOCKS ON ${dateStr}`, 'success');
      }
      return;
    }

    // Default error for any slash command
    if (command.startsWith('/')) {
      logOutput(`ERR: COMMAND NOT FOUND: "${mainCommand}"`, 'error');
      logOutput('TYPE /help TO SEE THE COMPLETE LIST', 'info');
    } else {
      logOutput('ERR: COMMANDS MUST START WITH "/"', 'error');
      logOutput('TYPE /help FOR INSTRUCTIONS', 'info');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (controlMode !== 'CLI') {
        setCliOpen(false);
      }
      inputRef.current?.blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="w-full p-4 border-t border-foreground bg-background flex flex-col gap-2 font-mono h-52 md:h-56 select-none flex-shrink-0 z-20">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-foreground/15 pb-1.5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-color-amber">SLOT SHELL</span>
          <span className="text-foreground/40 font-light">SYS: READY ({controlMode} MODE)</span>
        </div>
        {controlMode !== 'CLI' && (
          <button 
            onClick={() => setCliOpen(false)}
            className="text-foreground/40 hover:text-color-red transition-colors font-bold cursor-pointer"
            title="Minimize Shell"
          >
            [ COLLAPSE ]
          </button>
        )}
      </div>

      {/* Log list output */}
      <div className="flex-1 overflow-y-auto text-[11px] leading-relaxed flex flex-col gap-1 pr-1 custom-scrollbar">
        {logs.map((log, idx) => {
          let colorClass = 'text-foreground/70';
          if (log.type === 'success') colorClass = 'text-color-green font-bold';
          if (log.type === 'error') colorClass = 'text-color-red font-bold';
          if (log.type === 'input') colorClass = 'text-color-amber';

          return (
            <div key={idx} className={`${colorClass} break-all whitespace-pre-wrap`}>
              {log.text}
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>

      {/* CLI Input */}
      <div className="flex items-center gap-2 border border-foreground/20 px-3 py-1.5 flex-shrink-0 bg-surface">
        <span className="text-color-amber text-xs font-bold font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={controlMode === 'CLI' ? "TYPE A COMMAND... (/HELP FOR LIST)" : "TYPE A COMMAND... (ESC TO COLLAPSE, /HELP FOR LIST)"}
          className="flex-1 bg-transparent text-xs text-foreground focus:outline-none placeholder-foreground/25 font-bold font-mono"
          maxLength={100}
        />
      </div>
    </div>
  );
}
