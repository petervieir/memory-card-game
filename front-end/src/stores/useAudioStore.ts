import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  // Settings
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
  soundEffectsVolume: number;
  musicVolume: number;
  
  // Actions
  toggle_sound_effects: () => void;
  toggle_music: () => void;
  set_sound_effects_volume: (volume: number) => void;
  set_music_volume: (volume: number) => void;
  mute_all: () => void;
  unmute_all: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      // Default settings
      soundEffectsEnabled: true,
      musicEnabled: false, // Music disabled by default - player can enable
      soundEffectsVolume: 0.7,
      musicVolume: 0.3,
      
      toggle_sound_effects: () => {
        set((state) => ({ 
          soundEffectsEnabled: !state.soundEffectsEnabled 
        }));
      },
      
      toggle_music: () => {
        set((state) => ({ 
          musicEnabled: !state.musicEnabled 
        }));
      },
      
      set_sound_effects_volume: (volume: number) => {
        // Clamp between 0 and 1
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ soundEffectsVolume: clampedVolume });
      },
      
      set_music_volume: (volume: number) => {
        // Clamp between 0 and 1
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ musicVolume: clampedVolume });
      },
      
      mute_all: () => {
        set({ 
          soundEffectsEnabled: false,
          musicEnabled: false 
        });
      },
      
      unmute_all: () => {
        set({ 
          soundEffectsEnabled: true,
          musicEnabled: true 
        });
      },
    }),
    {
      name: 'memory-game-audio',
    }
  )
);
