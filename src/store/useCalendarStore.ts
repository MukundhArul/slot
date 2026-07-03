import { create } from 'zustand';
import { addDays, startOfWeek } from 'date-fns';

export type TimeBlock = {
  id: string;
  title: string;
  description: string;
  color: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // HH:mm format
  duration: number; // in minutes
};

interface CalendarState {
  blocks: TimeBlock[];
  currentDate: Date;
  viewMode: 'DAY' | 'WEEK';
  selectedBlockId: string | null;

  addBlock: (block: Omit<TimeBlock, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<TimeBlock>) => void;
  removeBlock: (id: string) => void;
  
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'DAY' | 'WEEK') => void;
  setSelectedBlockId: (id: string | null) => void;

  navigatePrevious: () => void;
  navigateNext: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  blocks: [],
  currentDate: new Date(),
  viewMode: 'WEEK',
  selectedBlockId: null,

  addBlock: (block) => set((state) => ({
    blocks: [...state.blocks, { ...block, id: Math.random().toString(36).substring(2, 9) }],
  })),

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

  navigatePrevious: () => set((state) => ({
    currentDate: addDays(state.currentDate, state.viewMode === 'DAY' ? -1 : -7)
  })),
  navigateNext: () => set((state) => ({
    currentDate: addDays(state.currentDate, state.viewMode === 'DAY' ? 1 : 7)
  })),
}));
