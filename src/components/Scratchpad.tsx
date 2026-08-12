import React, { useState } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCalendarStore } from '@/store/useCalendarStore';

export default function Scratchpad() {
  const { scratchpads, currentDate, updateScratchpad, scratchpadOpen, setScratchpadOpen } = useCalendarStore();
  const [mode, setMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  
  if (!scratchpadOpen) return null;

  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const content = scratchpads[dateStr] || '';

  return (
    <div className="w-80 border-l border-foreground/20 flex flex-col h-full bg-background z-20 shrink-0 shadow-[-10px_0_20px_rgba(0,0,0,0.1)] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-foreground/20 p-4 shrink-0">
        <h2 className="font-bold flex items-center gap-2">
          [ NOTES ]
        </h2>
        <div className="flex items-center gap-2">
          <button 
            className="hover:bg-foreground/10 px-2 py-1 text-xs font-bold transition-colors"
            onClick={() => setMode(mode === 'EDIT' ? 'PREVIEW' : 'EDIT')}
          >
            {mode === 'EDIT' ? '[ PREVIEW ]' : '[ EDIT ]'}
          </button>
          <button 
            className="hover:bg-foreground/10 px-2 py-1 text-xs font-bold transition-colors"
            onClick={() => setScratchpadOpen(false)}
            title="Close"
          >
            [X]
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 flex flex-col min-h-0 relative">
        {mode === 'EDIT' ? (
          <textarea
            className="w-full h-full bg-transparent border-none resize-none focus:outline-none font-mono text-sm"
            placeholder="Jot down notes, thoughts, or markdown for the day..."
            value={content}
            onChange={(e) => updateScratchpad(dateStr, e.target.value)}
          />
        ) : (
          <div className="prose prose-sm prose-invert max-w-none text-foreground prose-a:text-color-amber prose-a:font-bold prose-headings:font-bold prose-pre:bg-foreground/5 prose-code:text-color-green">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '*No notes for today.*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
