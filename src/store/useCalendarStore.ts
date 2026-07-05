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
};

interface CalendarState {
  blocks: TimeBlock[];
  currentDate: Date;
  viewMode: 'DAY' | 'WEEK';
  selectedBlockId: string | null;
  appMode: 'PLANNER' | 'TIMER';
  theme: Theme;
  mobileMenuOpen: boolean;

  addBlock: (block: Omit<TimeBlock, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<TimeBlock>) => void;
  removeBlock: (id: string) => void;
  
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'DAY' | 'WEEK') => void;
  setSelectedBlockId: (id: string | null) => void;
  setAppMode: (mode: 'PLANNER' | 'TIMER') => void;
  setTheme: (theme: Theme) => void;
  setMobileMenuOpen: (open: boolean) => void;

  navigatePrevious: () => void;
  navigateNext: () => void;

  duplicateDay: (sourceDate: string, targetDate: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      blocks: [],
      currentDate: new Date(),
      viewMode: 'WEEK',
      selectedBlockId: null,
      appMode: 'PLANNER',
      theme: 'PAPER',
      mobileMenuOpen: false,

      addBlock: (block) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          blocks: [...state.blocks, { ...block, id }],
          selectedBlockId: id,
        }));
      },

      updateBlock: (id, updates) => set((state) => ({
        blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b),
      })),

      removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter(b => b.id !== id),
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      })),

      setCurrentDate: (date) => set({ currentDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedBlockId: (id) => set({ selectedBlockId: id }),
      setAppMode: (mode) => set({ appMode: mode }),
      setTheme: (theme) => set({ theme }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

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
      partialize: (state) => ({ blocks: state.blocks, theme: state.theme }),
    }
  )
);
