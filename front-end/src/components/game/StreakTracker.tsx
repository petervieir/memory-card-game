"use client";

import { ChallengeStreak } from '@/types/game';

interface StreakTrackerProps {
  readonly streak: ChallengeStreak;
  readonly className?: string;
}

interface MilestoneProps {
  readonly count: number;
  readonly label: string;
  readonly icon: string;
  readonly achieved: boolean;
  readonly current: boolean;
}

function Milestone({ count, label, icon, achieved, current }: MilestoneProps) {
  let containerClass = 'bg-gray-700/30 border-gray-600';
  if (achieved) {
    containerClass = 'bg-green-500/20 border-green-500/50';
  } else if (current) {
    containerClass = 'bg-yellow-500/20 border-yellow-500/50 animate-pulse';
  }

  const iconClass = achieved ? 'grayscale-0' : 'grayscale opacity-50';
  
  let countClass = 'text-gray-500';
  if (achieved) {
    countClass = 'text-green-400';
  } else if (current) {
    countClass = 'text-yellow-400';
  }

  let labelClass = 'text-gray-500';
  if (achieved) {
    labelClass = 'text-green-300';
  } else if (current) {
    labelClass = 'text-yellow-300';
  }

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${containerClass}`}>
      <div className={`text-3xl mb-1 ${iconClass}`}>
        {icon}
      </div>
      <div className={`text-xl font-bold ${countClass}`}>
        {count}
      </div>
      <div className={`text-xs ${labelClass}`}>
        {label}
      </div>
      {achieved && (
        <div className="text-xs text-green-400 mt-1">✓ Unlocked</div>
      )}
    </div>
  );
}

export function StreakTracker({ streak, className = '' }: StreakTrackerProps) {
  const currentStreak = streak.currentStreak;
  const longestStreak = streak.longestStreak;
  const totalCompleted = streak.totalChallengesCompleted;

  // Milestone thresholds
  const milestones = [
    { count: 3, label: '3 Days', icon: '🔥', achieved: currentStreak >= 3 || longestStreak >= 3 },
    { count: 7, label: '7 Days', icon: '🌟', achieved: currentStreak >= 7 || longestStreak >= 7 },
    { count: 14, label: '14 Days', icon: '💎', achieved: currentStreak >= 14 || longestStreak >= 14 },
    { count: 30, label: '30 Days', icon: '👑', achieved: currentStreak >= 30 || longestStreak >= 30 },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Streak Display */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10" />
        <div className="relative bg-gray-800/80 backdrop-blur-sm border-2 border-orange-500/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔥</span>
              <div>
                <h3 className="text-xl font-bold text-white">Current Streak</h3>
                <p className="text-sm text-gray-400">Keep it going!</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg border border-gray-600">
              <div className="text-4xl font-bold text-orange-400">{currentStreak}</div>
              <div className="text-sm text-gray-400 mt-1">Current</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-gray-600">
              <div className="text-4xl font-bold text-yellow-400">{longestStreak}</div>
              <div className="text-sm text-gray-400 mt-1">Best</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-gray-600">
              <div className="text-4xl font-bold text-blue-400">{totalCompleted}</div>
              <div className="text-sm text-gray-400 mt-1">Total</div>
            </div>
          </div>

          {currentStreak > 0 && (
            <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30 text-center">
              <p className="text-sm text-orange-300">
                {(() => {
                  if (currentStreak === 1) {
                    return "Great start! Come back tomorrow to continue your streak! 🚀";
                  }
                  if (currentStreak < 7) {
                    const daysRemaining = 7 - currentStreak;
                    return `Amazing! ${daysRemaining} more day${daysRemaining === 1 ? '' : 's'} to unlock Week Warrior! 💪`;
                  }
                  if (currentStreak < 30) {
                    const daysRemaining = 30 - currentStreak;
                    return `Incredible! ${daysRemaining} more day${daysRemaining === 1 ? '' : 's'} to unlock Monthly Master! 🏆`;
                  }
                  return "You're a legend! Keep the streak alive! 👑";
                })()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-gray-800/50 border-2 border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Milestones</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {milestones.map((milestone) => (
            <Milestone
              key={milestone.count}
              count={milestone.count}
              label={milestone.label}
              icon={milestone.icon}
              achieved={milestone.achieved}
              current={currentStreak === milestone.count}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

