'use client';

import { useXPStore } from '@/stores/useXPStore';

interface XPProgressBarProps {
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export function XPProgressBar({ showLabel = true, height = 'md' }: XPProgressBarProps) {
  const { level, currentXP, getXPToNextLevel } = useXPStore();
  const xpToNextLevel = getXPToNextLevel();
  const progress = (currentXP / xpToNextLevel) * 100;

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Level {level}</span>
          <span>{currentXP} / {xpToNextLevel} XP</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function DetailedXPProgress() {
  const { level, currentXP, totalXP, getXPToNextLevel } = useXPStore();
  const xpToNextLevel = getXPToNextLevel();
  const progress = (currentXP / xpToNextLevel) * 100;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Level {level}
        </h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Total XP: {totalXP.toLocaleString()}
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 ease-out flex items-center justify-end pr-2"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {progress > 30 && (
              <span className="text-xs font-bold text-white">
                {Math.floor(progress)}%
              </span>
            )}
          </div>
        </div>
        {progress <= 30 && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 dark:text-gray-400">
            {Math.floor(progress)}%
          </span>
        )}
      </div>
      
      <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP to next level
      </div>
    </div>
  );
}

