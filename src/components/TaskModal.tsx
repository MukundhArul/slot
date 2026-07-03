'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { timeToMinutes, minutesToTime } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function TaskModal() {
  const { blocks, selectedBlockId, updateBlock, removeBlock, setSelectedBlockId } = useCalendarStore();
  const block = blocks.find(b => b.id === selectedBlockId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setDescription(block.description);
      setStartTime(block.startTime);
      const startMins = timeToMinutes(block.startTime);
      setEndTime(minutesToTime(startMins + block.duration));
      setColor(block.color);
    }
  }, [block]);

  if (!block) return null;

  const handleUpdate = () => {
    const startMins = timeToMinutes(startTime);
    let endMins = timeToMinutes(endTime);
    if (endMins <= startMins) {
      endMins = startMins + 15; // default to 15m if invalid
    }
    const duration = endMins - startMins;

    updateBlock(block.id, { title, description, startTime, duration, color });
    setSelectedBlockId(null);
  };

  const handleDelete = () => {
    removeBlock(block.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div 
        className="w-[400px] border border-color-green bg-surface-raised shadow-lg shadow-color-green/20"
      >
        <div className="bg-color-green text-[#050505] px-4 py-2 font-bold uppercase flex justify-between">
          <span>&gt; EDIT_TASK.exe</span>
          <button onClick={() => setSelectedBlockId(null)} className="text-[#cc2200] hover:bg-[#cc2200]/20 px-1 font-bold">[ X ]</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs text-foreground/70 mb-1">TITLE</label>
            <input 
              className="w-full bg-background border border-foreground/50 p-2 text-foreground focus:outline-none focus:border-color-green transition-colors"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter title..."
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-foreground/70 mb-1">FROM</label>
              <input 
                type="time"
                className="w-full bg-background border border-foreground/50 p-2 text-foreground focus:outline-none focus:border-color-green transition-colors"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-foreground/70 mb-1">TO</label>
              <input 
                type="time"
                className="w-full bg-background border border-foreground/50 p-2 text-foreground focus:outline-none focus:border-color-green transition-colors"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-foreground/70 mb-1">DESCRIPTION</label>
            <textarea 
              className="w-full bg-background border border-foreground/50 p-2 text-foreground focus:outline-none focus:border-color-green transition-colors resize-none h-24"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter description..."
            />
          </div>

          <div>
            <label className="block text-xs text-foreground/70 mb-1">BLOCK COLOR</label>
            <div className="flex gap-2 flex-wrap">
              {LEGACY_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 border ${color === c.value ? 'border-foreground shadow-sm shadow-foreground/50 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-foreground/20 text-sm">
            <button 
              onClick={handleDelete}
              className="text-color-red hover:bg-color-red/10 px-2 py-1 transition-colors"
            >
              [ DELETE ]
            </button>
            <button 
              onClick={handleUpdate}
              className="text-color-green hover:bg-color-green/10 px-2 py-1 font-bold transition-colors"
            >
              [ UPDATE ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
