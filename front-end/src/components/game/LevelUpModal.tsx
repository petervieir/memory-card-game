'use client';

import { useEffect, useState } from 'react';
import { useXPStore } from '@/stores/useXPStore';
import { UNLOCKABLES, PLAYER_TITLES } from '@/types/game';
import { useSoundEffects } from '@/hooks/useSoundEffects';

/**
 * Modal displayed when player levels up
 * Shows new level, rewards, and unlocked items
 */
export function LevelUpModal() {
  const { levelUpNotifications, clearLevelUpNotifications } = useXPStore();
  const [currentNotification, setCurrentNotification] = useState<typeof levelUpNotifications[0] | null>(null);
  const { play_sound } = useSoundEffects();

  useEffect(() => {
    if (levelUpNotifications.length > 0 && !currentNotification) {
      setCurrentNotification(levelUpNotifications[0]);
      play_sound('level_unlock');
    }
  }, [levelUpNotifications, currentNotification, play_sound]);

  function handleClose() {
    const remaining = levelUpNotifications.slice(1);
    if (remaining.length > 0) {
      setCurrentNotification(remaining[0]);
      play_sound('level_unlock');
    } else {
      setCurrentNotification(null);
      clearLevelUpNotifications();
    }
  }

  if (!currentNotification) return null;

  const { level, rewards } = currentNotification;
  const hasRewards = rewards.unlockables?.length > 0 || rewards.title || rewards.specialReward;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
            Level Up!
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold text-gray-800 dark:text-gray-200">
              {level}
            </span>
          </div>
        </div>

        {/* Rewards */}
        {hasRewards && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
              New Rewards Unlocked!
            </h3>

            {/* Title Reward */}
            {rewards.title && (
              <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      New Title
                    </p>
                    <p 
                      className="text-sm font-bold"
                      style={{ color: PLAYER_TITLES[rewards.title.toUpperCase()]?.color || '#9ca3af' }}
                    >
                      {PLAYER_TITLES[rewards.title.toUpperCase()]?.name || rewards.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Unlockables */}
            {rewards.unlockables && rewards.unlockables.length > 0 && (
              <div className="space-y-2">
                {rewards.unlockables.map(unlockableId => {
                  const unlockable = UNLOCKABLES[unlockableId.toUpperCase()];
                  if (!unlockable) return null;
                  
                  return (
                    <div 
                      key={unlockableId}
                      className="p-3 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{unlockable.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {unlockable.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {unlockable.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Special Reward */}
            {rewards.specialReward && (
              <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {rewards.specialReward}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          {levelUpNotifications.length > 1 ? 'Next' : 'Awesome!'}
        </button>

        {levelUpNotifications.length > 1 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {levelUpNotifications.length - 1} more level{levelUpNotifications.length > 2 ? 's' : ''} up!
          </p>
        )}
      </div>
    </div>
  );
}

