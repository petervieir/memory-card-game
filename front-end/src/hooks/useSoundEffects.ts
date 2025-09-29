"use client";

import { useEffect, useRef, useCallback } from 'react';

// Sound effect types
export type SoundEffect = 
  | 'card_flip' 
  | 'card_match' 
  | 'card_mismatch'
  | 'game_complete'
  | 'achievement_unlock'
  | 'level_unlock'
  | 'button_click'
  | 'difficulty_select';

// Sound configuration with paths and volumes
const SOUND_CONFIG: Record<SoundEffect, { path: string; volume: number }> = {
  card_flip: { path: '/sounds/card-flip.mp3', volume: 0.3 },
  card_match: { path: '/sounds/card-match.mp3', volume: 0.4 },
  card_mismatch: { path: '/sounds/card-mismatch.mp3', volume: 0.3 },
  game_complete: { path: '/sounds/game-complete.mp3', volume: 0.5 },
  achievement_unlock: { path: '/sounds/achievement.mp3', volume: 0.6 },
  level_unlock: { path: '/sounds/level-unlock.mp3', volume: 0.5 },
  button_click: { path: '/sounds/button-click.mp3', volume: 0.2 },
  difficulty_select: { path: '/sounds/difficulty-select.mp3', volume: 0.3 },
};

interface UseSoundEffectsOptions {
  enabled?: boolean;
  masterVolume?: number;
}

/**
 * Hook for managing game sound effects
 * Handles audio loading, playback, and cleanup
 */
export function useSoundEffects(options: UseSoundEffectsOptions = {}) {
  const { enabled = true, masterVolume = 1.0 } = options;
  const audioRef = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());
  const loadedRef = useRef<Set<SoundEffect>>(new Set());

  // Initialize audio elements
  useEffect(() => {
    if (!enabled) return;

    const audioMap = audioRef.current;
    const loadedSet = loadedRef.current;

    // Create audio elements for each sound
    Object.entries(SOUND_CONFIG).forEach(([sound, config]) => {
      const audio = new Audio();
      audio.src = config.path;
      audio.volume = config.volume * masterVolume;
      audio.preload = 'auto';
      
      // Handle loading
      audio.addEventListener('canplaythrough', () => {
        loadedSet.add(sound as SoundEffect);
      });
      
      // Handle errors silently (sound files might not exist yet)
      audio.addEventListener('error', () => {
        console.debug(`Sound file not found: ${config.path}`);
      });

      audioMap.set(sound as SoundEffect, audio);
    });

    // Cleanup on unmount
    return () => {
      audioMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioMap.clear();
      loadedSet.clear();
    };
  }, [enabled, masterVolume]);

  // Update volumes when masterVolume changes
  useEffect(() => {
    if (!enabled) return;

    audioRef.current.forEach((audio, sound) => {
      const config = SOUND_CONFIG[sound];
      audio.volume = config.volume * masterVolume;
    });
  }, [masterVolume, enabled]);

  /**
   * Play a sound effect
   */
  const play_sound = useCallback((sound: SoundEffect) => {
    if (!enabled) return;

    const audio = audioRef.current.get(sound);
    if (!audio || !loadedRef.current.has(sound)) {
      return;
    }

    // Reset audio to start if already playing
    audio.currentTime = 0;
    
    // Play with error handling
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Handle autoplay policy errors silently
        console.debug('Audio play prevented:', error);
      });
    }
  }, [enabled]);

  /**
   * Stop a specific sound
   */
  const stop_sound = useCallback((sound: SoundEffect) => {
    const audio = audioRef.current.get(sound);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  /**
   * Stop all sounds
   */
  const stop_all_sounds = useCallback(() => {
    audioRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    play_sound,
    stop_sound,
    stop_all_sounds,
    isEnabled: enabled,
  };
}

/**
 * Background music hook
 * Manages looping background music with fade in/out
 */
export function useBackgroundMusic(options: UseSoundEffectsOptions & { musicPath?: string } = {}) {
  const { enabled = true, masterVolume = 0.3, musicPath = '/sounds/background-music.mp3' } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Create audio element
    const audio = new Audio(musicPath);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';

    // Handle errors silently
    audio.addEventListener('error', () => {
      console.debug(`Music file not found: ${musicPath}`);
    });

    audioRef.current = audio;

    // Cleanup
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [enabled, musicPath]);

  const fade_in = useCallback((duration = 2000) => {
    const audio = audioRef.current;
    if (!audio || !enabled) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    audio.volume = 0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          const targetVolume = masterVolume;
          const steps = 50;
          const volumeIncrement = targetVolume / steps;
          const timeIncrement = duration / steps;

          fadeIntervalRef.current = setInterval(() => {
            if (audio.volume < targetVolume - volumeIncrement) {
              audio.volume = Math.min(audio.volume + volumeIncrement, targetVolume);
            } else {
              audio.volume = targetVolume;
              if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
              }
            }
          }, timeIncrement);
        })
        .catch(error => {
          console.debug('Music autoplay prevented:', error);
        });
    }
  }, [enabled, masterVolume]);

  const fade_out = useCallback((duration = 1000) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audio.volume;
    const steps = 50;
    const volumeDecrement = startVolume / steps;
    const timeIncrement = duration / steps;

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > volumeDecrement) {
        audio.volume = Math.max(audio.volume - volumeDecrement, 0);
      } else {
        audio.volume = 0;
        audio.pause();
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      }
    }, timeIncrement);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && enabled) {
      audioRef.current.play().catch(error => {
        console.debug('Music play prevented:', error);
      });
    }
  }, [enabled]);

  return {
    fade_in,
    fade_out,
    pause,
    resume,
    isEnabled: enabled,
  };
}
