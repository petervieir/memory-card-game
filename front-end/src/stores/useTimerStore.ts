import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  // Settings
  timerEnabled: boolean;
  
  // Actions
  enable_timer: () => void;
  disable_timer: () => void;
  toggle_timer: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      // Default settings - timer disabled by default
      timerEnabled: false,
      
      enable_timer: () => {
        set({ timerEnabled: true });
      },
      
      disable_timer: () => {
        set({ timerEnabled: false });
      },
      
      toggle_timer: () => {
        set((state) => ({ timerEnabled: !state.timerEnabled }));
      },
    }),
    {
      name: 'memory-game-timer',
    }
  )
);

