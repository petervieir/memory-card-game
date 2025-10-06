"use client";

import { useState } from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';

/**
 * Audio settings control panel
 * Allows users to toggle sound effects, music, and adjust volumes
 */
export function AudioSettings() {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    soundEffectsEnabled,
    musicEnabled,
    soundEffectsVolume,
    musicVolume,
    toggle_sound_effects,
    toggle_music,
    set_sound_effects_volume,
    set_music_volume,
  } = useAudioStore();

  const { play_sound } = useSoundEffects({ 
    enabled: soundEffectsEnabled,
    masterVolume: soundEffectsVolume 
  });

  const handleSoundToggle = () => {
    toggle_sound_effects();
    if (!soundEffectsEnabled) {
      // Play a test sound when enabling
      setTimeout(() => play_sound('button_click'), 100);
    }
  };

  const handleVolumeChange = (type: 'sound' | 'music', value: number) => {
    if (type === 'sound') {
      set_sound_effects_volume(value);
      play_sound('button_click');
    } else {
      set_music_volume(value);
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          play_sound('button_click');
        }}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        aria-label="Audio settings"
        title="Audio settings"
      >
        {soundEffectsEnabled || musicEnabled ? '🔊' : '🔇'}
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default" 
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
            aria-label="Close audio settings"
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 p-4 bg-gray-900 border border-white/20 rounded-lg shadow-xl z-50">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Audio Settings</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Sound Effects Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sound Effects</span>
                  <button
                    onClick={handleSoundToggle}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${soundEffectsEnabled ? 'bg-blue-500' : 'bg-gray-600'}
                    `}
                    role="switch"
                    aria-checked={soundEffectsEnabled}
                    aria-label="Toggle sound effects"
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${soundEffectsEnabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {soundEffectsEnabled && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Volume</span>
                      <span>{Math.round(soundEffectsVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundEffectsVolume * 100}
                      onChange={(e) => handleVolumeChange('sound', parseInt(e.target.value) / 100)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>

              {/* Background Music Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Background Music</span>
                  <button
                    onClick={() => {
                      toggle_music();
                      play_sound('button_click');
                    }}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${musicEnabled ? 'bg-blue-500' : 'bg-gray-600'}
                    `}
                    role="switch"
                    aria-checked={musicEnabled}
                    aria-label="Toggle background music"
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${musicEnabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {musicEnabled && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Volume</span>
                      <span>{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume * 100}
                      onChange={(e) => handleVolumeChange('music', parseInt(e.target.value) / 100)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  🎮 Sounds enhance your gaming experience!
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Slider Styles */}
      <style>
        {`.slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }`}
      </style>
    </div>
  );
}

/**
 * Compact audio toggle button (for mobile/minimal UI)
 */
export function AudioToggle() {
  const { soundEffectsEnabled, toggle_sound_effects } = useAudioStore();
  
  return (
    <button
      onClick={toggle_sound_effects}
      className="p-2 text-2xl hover:scale-110 transition-transform"
      aria-label={soundEffectsEnabled ? 'Mute sounds' : 'Unmute sounds'}
      title={soundEffectsEnabled ? 'Mute sounds' : 'Unmute sounds'}
    >
      {soundEffectsEnabled ? '🔊' : '🔇'}
    </button>
  );
}
