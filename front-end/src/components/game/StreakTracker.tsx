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
  let containerClass = 'bg-white/5 border-white/10';
  if (achieved) {
    containerClass = 'bg-solv-gold/10 border-solv-gold/50';
  } else if (current) {
    containerClass = 'bg-solv-gold/15 border-solv-gold/60 animate-pulse';
  }

  const iconClass = achieved ? 'grayscale-0' : 'grayscale opacity-50';
  
  let countClass = 'text-muted-foreground';
  if (achieved) {
    countClass = 'text-solv-gold';
  } else if (current) {
    countClass = 'text-solv-gold';
  }

  let labelClass = 'text-muted-foreground';
  if (achieved) {
    labelClass = 'text-solv-gold/80';
  } else if (current) {
    labelClass = 'text-solv-gold/80';
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
        <div className="text-xs text-solv-gold mt-1">✓ Unlocked</div>
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
        <div className="absolute inset-0 bg-gradient-to-r from-solv-navy via-solv-midnight to-solv-slate" />
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔥</span>
              <div>
                <h3 className="text-xl font-bold text-white">Current Streak</h3>
                <p className="text-sm text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl font-bold text-solv-gold">{currentStreak}</div>
              <div className="text-sm text-muted-foreground mt-1">Current</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl font-bold text-white">{longestStreak}</div>
              <div className="text-sm text-muted-foreground mt-1">Best</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl font-bold text-white">{totalCompleted}</div>
              <div className="text-sm text-muted-foreground mt-1">Total</div>
            </div>
          </div>

          {currentStreak > 0 && (
            <div className="mt-4 p-3 bg-solv-gold/10 rounded-lg border border-solv-gold/30 text-center">
              <p className="text-sm text-solv-gold/80">
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
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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

