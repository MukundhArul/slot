import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, startOfWeek } from 'date-fns';

export type Theme = 'PAPER' | 'DARK_AMBER' | 'E_INK';

export type TimeBlock = {
  id: string;
  title: string;
  description: string;
  color: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // HH:mm format
  duration: number; // in minutes
  completed?: boolean;
  tags?: string[];
  isRoutine?: boolean;
  routineId?: string;
  deleted?: boolean;
};

export type Routine = {
  id: string;
  title: string;
  color: string;
  startTime: string; // HH:mm
  duration: number; // in mins
  daysOfWeek: number[]; // 0=Sun, 1=Mon, etc.
  startDate: string; // YYYY-MM-DD
  tags?: string[];
};

interface CalendarState {
  blocks: TimeBlock[];
  routines: Routine[];
  currentDate: Date;
  viewMode: 'DAY' | 'WEEK';
  selectedBlockId: string | null;
  theme: Theme;
  mobileMenuOpen: boolean;
  activeTagFilter: string | null;

  addBlock: (block: Omit<TimeBlock, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<TimeBlock>) => void;
  removeBlock: (id: string) => void;

  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  removeRoutine: (id: string) => void;
  
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'DAY' | 'WEEK') => void;
  setSelectedBlockId: (id: string | null) => void;
  setTheme: (theme: Theme) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveTagFilter: (tag: string | null) => void;

  navigatePrevious: () => void;
  navigateNext: () => void;

  duplicateDay: (sourceDate: string, targetDate: string) => void;
  cliOpen: boolean;
  setCliOpen: (open: boolean) => void;

  controlMode: 'GUI' | 'CLI';
  setControlMode: (mode: 'GUI' | 'CLI') => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      blocks: [],
      routines: [],
      currentDate: new Date(),
      viewMode: 'WEEK',
      selectedBlockId: null,
      theme: 'PAPER',
      mobileMenuOpen: false,
      activeTagFilter: null,

      cliOpen: true,
      setCliOpen: (open) => set({ cliOpen: open }),

      controlMode: 'GUI',
      setControlMode: (mode) => set({ controlMode: mode }),

      addBlock: (block) => set((state) => ({ 
        blocks: [...state.blocks, { ...block, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      updateBlock: (id, updates) => set((state) => {
        const existing = state.blocks.find(b => b.id === id);
        if (existing) {
          return { blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b) };
        } else if (id.startsWith('routine_')) {
          // Materialize virtual block
          const [_, routineId, dateStr] = id.split('_');
          const routine = state.routines.find(r => r.id === routineId);
          if (routine) {
            const newBlock: TimeBlock = {
              id,
              title: routine.title,
              description: '',
              color: routine.color,
              date: dateStr,
              startTime: routine.startTime,
              duration: routine.duration,
              tags: routine.tags,
              isRoutine: true,
              routineId: routine.id,
              ...updates
            };
            return { blocks: [...state.blocks, newBlock] };
          }
        }
        return state;
      }),
      removeBlock: (id) => set((state) => {
        const existing = state.blocks.find(b => b.id === id);
        if (existing) {
          if (existing.isRoutine) {
            // Soft delete materialized routine instance
            return { blocks: state.blocks.map(b => b.id === id ? { ...b, deleted: true } : b) };
          }
          return { blocks: state.blocks.filter(b => b.id !== id) };
        } else if (id.startsWith('routine_')) {
          // Materialize as deleted
          const [_, routineId, dateStr] = id.split('_');
          const routine = state.routines.find(r => r.id === routineId);
          if (routine) {
            const deletedBlock: TimeBlock = {
              id,
              title: routine.title,
              description: '',
              color: routine.color,
              date: dateStr,
              startTime: routine.startTime,
              duration: routine.duration,
              tags: routine.tags,
              isRoutine: true,
              routineId: routine.id,
              deleted: true
            };
            return { blocks: [...state.blocks, deletedBlock] };
          }
        }
        return state;
      }),
      
      addRoutine: (routine) => set((state) => ({
        routines: [...state.routines, { ...routine, id: Math.random().toString(36).substr(2, 9) }]
      })),
      removeRoutine: (id) => set((state) => ({
        routines: state.routines.filter(r => r.id !== id),
      })),

      setCurrentDate: (date) => set({ currentDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedBlockId: (id) => set({ selectedBlockId: id }),
      setTheme: (theme) => set({ theme }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setActiveTagFilter: (tag) => set({ activeTagFilter: tag }),

      navigatePrevious: () => set((state) => ({
        currentDate: addDays(state.currentDate, state.viewMode === 'DAY' ? -1 : -7)
      })),
      navigateNext: () => set((state) => ({
        currentDate: addDays(state.currentDate, state.viewMode === 'DAY' ? 1 : 7)
      })),

      duplicateDay: (sourceDate: string, targetDate: string) => set((state) => {
        const sourceBlocks = state.blocks.filter(b => b.date === sourceDate);
        if (sourceBlocks.length === 0) return state; // nothing to copy
        
        const duplicatedBlocks = sourceBlocks.map(b => ({
          ...b,
          id: Math.random().toString(36).substring(2, 9),
          date: targetDate,
          completed: false, // reset completion for new tasks
        }));
        
        return {
          blocks: [...state.blocks, ...duplicatedBlocks]
        };
      }),
    }),
    {
      name: 'slot-storage',
      partialize: (state) => ({ 
        blocks: state.blocks,
        routines: state.routines,
        theme: state.theme,
        cliOpen: state.cliOpen,
        controlMode: state.controlMode
      }),
    }
  )
);
