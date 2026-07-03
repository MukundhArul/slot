'use client';

import { useMemo, useRef, useState } from 'react';
import { DndContext, DragEndEvent, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useCalendarStore } from '@/store/useCalendarStore';
import { HOURS, HOUR_HEIGHT, MINUTE_HEIGHT } from '@/lib/constants';
import { snapToGrid, timeToMinutes, minutesToTime } from '@/lib/utils';
import TimeBlock from './TimeBlock';

export default function CalendarGrid() {
  const { blocks, currentDate, viewMode, updateBlock, setSelectedBlockId, addBlock } = useCalendarStore();
  const gridRef = useRef<HTMLDivElement>(null);

  // Compute days to show (Sunday start)
  const days = useMemo(() => {
    if (viewMode === 'DAY') return [currentDate];
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 = Sunday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate, viewMode]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum drag distance before activating to avoid conflicting with clicks
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active || !gridRef.current) return;

    const block = active.data.current?.block;
    if (!block) return;

    const dayWidth = gridRef.current.clientWidth / days.length;
    const dayDelta = Math.round(delta.x / dayWidth);
    const minuteDelta = snapToGrid(delta.y / MINUTE_HEIGHT);

    if (dayDelta === 0 && minuteDelta === 0) return;

    // Calculate new date
    const blockDate = new Date(block.date);
    const newDate = addDays(blockDate, dayDelta);

    // Calculate new time
    const newStartMinutes = timeToMinutes(block.startTime) + minuteDelta;
    // ensure it stays within 0 to 24h
    const clampedMinutes = Math.max(0, Math.min(24 * 60 - block.duration, newStartMinutes));

    updateBlock(block.id, {
      date: format(newDate, 'yyyy-MM-dd'),
      startTime: minutesToTime(clampedMinutes)
    });
  };

  const handleResize = (id: string, deltaMins: number) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    const newDuration = Math.max(15, block.duration + deltaMins);
    updateBlock(id, { duration: newDuration });
  };

  const handleGridClick = (day: Date, hour: number, e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // ignore clicks on blocks

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = snapToGrid((y / HOUR_HEIGHT) * 60 + hour * 60);

    const newBlock = {
      title: 'NEW TASK',
      description: '',
      color: 'var(--color-green)', // default
      date: format(day, 'yyyy-MM-dd'),
      startTime: minutesToTime(minutes),
      duration: 60,
    };

    // Add and select
    addBlock(newBlock);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {/* Grid Scroll Area */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          
          {/* Day Headers (Sticky) */}
          <div className="flex border-b border-foreground/50 bg-surface pl-16 sticky top-0 z-30">
            {days.map((day) => (
              <div key={day.toISOString()} className="flex-1 text-center py-2 border-r border-foreground/20 text-sm font-bold truncate">
                {format(day, 'EEE MM/dd').toUpperCase()}
              </div>
            ))}
          </div>

          {/* Grid Content */}
          <div className="flex-1 flex mt-4">
            {/* Time Y-Axis */}
            <div className="w-16 relative border-r border-foreground/50 bg-surface sticky left-0 z-20" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute w-full text-xs text-right pr-2 font-bold text-foreground/70"
                  style={{ top: `${hour * HOUR_HEIGHT}px`, transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <span className="bg-surface px-1">{hour.toString().padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>

            {/* Grid Area */}
            <div className="flex-1 flex" ref={gridRef}>
              {days.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const dayBlocks = blocks.filter(b => b.date === dayStr);

                return (
                  <div key={dayStr} className="flex-1 relative border-r border-foreground/20 min-w-0" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
                    {/* Grid Lines and Clickable Area */}
                    {HOURS.map(hour => (
                      <div
                        key={hour}
                        className="absolute w-full border-t border-foreground/10 border-dashed cursor-crosshair"
                        style={{ top: `${hour * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                        onClick={(e) => handleGridClick(day, hour, e)}
                      />
                    ))}

                    {/* Render Blocks */}
                    {dayBlocks.map(block => (
                      <TimeBlock
                        key={block.id}
                        block={block}
                        onClick={setSelectedBlockId}
                        onResize={handleResize}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
