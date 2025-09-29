"use client";

import { ACHIEVEMENTS } from '@/types/game';
import { usePointsStore } from '@/stores/usePointsStore';
import { useEffect, useState } from 'react';

interface AchievementBadgeProps {
  readonly achievementId: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly showDescription?: boolean;
  readonly className?: string;
}

export function AchievementBadge({ 
  achievementId, 
  size = 'md', 
  showDescription = true,
  className = '' 
}: AchievementBadgeProps) {
  const { unlockedAchievements } = usePointsStore();
  const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
  const isUnlocked = (unlockedAchievements || []).includes(achievementId);
  
  if (!achievement) return null;

  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4'
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div 
      className={`
        inline-flex items-center gap-2 rounded-lg border transition-all
        ${isUnlocked 
          ? 'bg-green-500/20 border-green-500 text-green-400' 
          : 'bg-gray-500/20 border-gray-500 text-gray-400'
        }
        ${sizeClasses[size]} ${className}
      `}
      title={achievement.description}
    >
      <span className={`${iconSizes[size]} ${!isUnlocked && 'grayscale opacity-50'}`}>
        {achievement.icon}
      </span>
      <div className="flex flex-col">
        <span className="font-medium">{achievement.name}</span>
        {showDescription && (
          <span className="text-xs opacity-75">{achievement.description}</span>
        )}
      </div>
    </div>
  );
}

interface AchievementNotificationProps {
  readonly achievementId: string;
  readonly onClose: () => void;
}

export function AchievementNotification({ achievementId, onClose }: AchievementNotificationProps) {
  const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
  
  if (!achievement) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-500">
      <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 max-w-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{achievement.icon}</span>
          <div className="flex-1">
            <h4 className="font-bold text-green-400">Achievement Unlocked!</h4>
            <p className="text-sm font-medium">{achievement.name}</p>
            <p className="text-xs text-gray-300">{achievement.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

interface AchievementGridProps {
  readonly category?: 'moves' | 'difficulty' | 'milestone' | 'special' | 'all';
  readonly showLocked?: boolean;
}

export function AchievementGrid({ category = 'all', showLocked = true }: AchievementGridProps) {
  const { unlockedAchievements } = usePointsStore();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    // Return placeholder during SSR
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading achievements...</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-500/20 border border-gray-500 rounded-lg p-3 h-16" />
          ))}
        </div>
      </div>
    );
  }
  
  const achievements = unlockedAchievements || [];
  
  const filteredAchievements = Object.values(ACHIEVEMENTS).filter((achievement) => {
    if (category !== 'all' && achievement.category !== category) return false;
    if (!showLocked && !achievements.includes(achievement.id)) return false;
    return true;
  });

  const categoryNames = {
    moves: 'Move Efficiency',
    difficulty: 'Difficulty Mastery', 
    milestone: 'Milestones',
    special: 'Special',
    all: 'All Achievements'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{categoryNames[category]}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievementId={achievement.id}
            size="md"
            showDescription={true}
          />
        ))}
      </div>
      {filteredAchievements.length === 0 && (
        <p className="text-gray-400 text-center py-4">
          {showLocked ? 'No achievements in this category.' : 'No achievements unlocked yet.'}
        </p>
      )}
    </div>
  );
}

interface AchievementProgressProps {
  readonly showDetails?: boolean;
}

export function AchievementProgress({ showDetails = false }: AchievementProgressProps) {
  const { getAchievementProgress } = usePointsStore();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    // Return placeholder during SSR to prevent hydration mismatch
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Achievement Progress</h3>
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-0" />
        </div>
      </div>
    );
  }
  
  const progress = getAchievementProgress();
  const progressPercentage = Math.round((progress.unlocked / progress.total) * 100);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Achievement Progress</h3>
        <span className="text-sm text-gray-400">
          {progress.unlocked}/{progress.total} ({progressPercentage}%)
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-yellow-400">{progress.categories.moves}</div>
            <div className="text-gray-400">Moves</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-blue-400">{progress.categories.difficulty}</div>
            <div className="text-gray-400">Difficulty</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-green-400">{progress.categories.milestone}</div>
            <div className="text-gray-400">Milestones</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-purple-400">{progress.categories.special}</div>
            <div className="text-gray-400">Special</div>
          </div>
        </div>
      )}
    </div>
  );
}
