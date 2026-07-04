'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TimeBlock as TimeBlockType, useCalendarStore } from '@/store/useCalendarStore';
import { HOUR_HEIGHT, MINUTE_HEIGHT } from '@/lib/constants';
import { timeToMinutes, snapToGrid } from '@/lib/utils';

interface TimeBlockProps {
  block: TimeBlockType;
  onClick: (id: string) => void;
  onResize: (id: string, deltaMins: number) => void;
  timeOffset: number;
}

export default function TimeBlock({ block, onClick, onResize, timeOffset }: TimeBlockProps) {
  const updateBlock = useCalendarStore(state => state.updateBlock);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
    data: { block },
  });

  const topPx = timeToMinutes(block.startTime) * MINUTE_HEIGHT + timeOffset;
  const heightPx = block.duration * MINUTE_HEIGHT;

  const handlePointerDownResize = (e: React.PointerEvent) => {
    e.stopPropagation(); // prevent drag
    const startY = e.clientY;
    const startDuration = block.duration;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaMins = deltaY / MINUTE_HEIGHT;
      const newDuration = Math.max(15, snapToGrid(startDuration + deltaMins));
      onResize(block.id, newDuration - startDuration);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        top: `${topPx}px`,
        height: `${heightPx}px`,
        left: '2px',
        right: '2px',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : 10,
        backgroundColor: block.color || 'var(--surface)',
        borderColor: 'var(--color-foreground)',
        borderWidth: '1px',
        borderStyle: 'solid',
        opacity: isDragging ? 0.8 : 1,
      }}
      className="flex flex-col overflow-hidden text-xs shadow-sm hover:z-20 transition-opacity relative group"
    >
      <div className="absolute top-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!isDragging) {
              updateBlock(block.id, { completed: !block.completed });
            }
          }}
          className="bg-background text-foreground border border-foreground/50 px-1 text-[10px] hover:bg-foreground hover:text-background transition-colors font-bold"
          title="Toggle Completion"
        >
          {block.completed ? '[ ↺ ]' : '[ ✓ ]'}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!isDragging) {
              onClick(block.id);
            }
          }}
          className="bg-background text-foreground border border-foreground/50 px-1 text-[10px] hover:bg-foreground hover:text-background transition-colors font-bold"
          title="Edit Task"
        >
          [ E ]
        </button>
      </div>
      <div 
        className="px-2 py-1 flex-1 min-h-0 overflow-hidden break-words text-foreground font-semibold"
        {...attributes}
        {...listeners}
      >
        <div className="font-bold border-b border-foreground/20 pb-1 mb-1 pr-14 truncate text-black flex items-center gap-2">
          {block.title}
          {block.completed && <span className="w-2 h-2 rounded-full bg-[#cc2200] shrink-0" title="Completed" />}
        </div>
        {block.duration >= 30 && <div className="text-black/80 line-clamp-2">{block.description}</div>}
      </div>

      <div
        onPointerDown={handlePointerDownResize}
        className="h-2 w-full cursor-ns-resize bg-foreground/10 hover:bg-color-amber transition-colors flex items-center justify-center border-t border-foreground/20"
      >
        <div className="w-4 h-[1px] bg-foreground/50"></div>
      </div>
    </div>
  );
}
