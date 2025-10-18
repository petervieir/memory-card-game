"use client";

import { DIFFICULTIES, DIFFICULTY_ORDER, type DifficultyId } from '@/types/game';
import { useDifficultyStore } from '@/stores/useDifficultyStore';
import { useTimerStore } from '@/stores/useTimerStore';

interface DifficultySelectorProps {
  readonly selectedDifficulty: DifficultyId;
  readonly onDifficultyChange: (difficulty: DifficultyId) => void;
  readonly className?: string;
  readonly onTimerToggle?: () => void;
}

function getButtonClassName(unlocked: boolean, isSelected: boolean): string {
  if (!unlocked) {
    return 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed';
  }
  if (isSelected) {
    return 'border-blue-500 bg-blue-500/20 shadow-lg scale-105';
  }
  return 'border-gray-600 bg-white/5 hover:border-gray-500 hover:bg-white/10';
}

export function DifficultySelector({ 
  selectedDifficulty, 
  onDifficultyChange, 
  className = '',
  onTimerToggle
}: DifficultySelectorProps) {
  const { isUnlocked, hasCompletedLevel, getBestScore } = useDifficultyStore();
  const { timerEnabled, toggle_timer } = useTimerStore();
  
  const handleTimerToggle = () => {
    toggle_timer();
    if (onTimerToggle) {
      onTimerToggle();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center">Choose Difficulty</h3>
      
      {/* Timer Mode Toggle */}
      <div className="flex items-center justify-center gap-3 p-3 bg-white/5 rounded-lg border border-gray-600">
        <button
          onClick={handleTimerToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            timerEnabled
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <span className="text-xl">⏱️</span>
          <span>Timer Mode</span>
        </button>
        <div className="text-sm text-gray-400 max-w-xs">
          {timerEnabled ? (
            <span>⚡ Time Attack! Complete before time runs out for bonus points</span>
          ) : (
            <span>🎯 Classic mode - take your time to find all matches</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DIFFICULTY_ORDER.map((difficultyId) => {
          const difficulty = DIFFICULTIES[difficultyId];
          const isSelected = selectedDifficulty === difficultyId;
          const unlocked = isUnlocked(difficultyId);
          const completed = hasCompletedLevel(difficultyId);
          const bestScore = getBestScore(difficultyId);
          
          return (
            <button
              key={difficultyId}
              onClick={() => unlocked && onDifficultyChange(difficultyId)}
              disabled={!unlocked}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${getButtonClassName(unlocked, isSelected)}
              `}
            >
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="text-xl relative">
                  {difficulty.emoji}
                  {!unlocked && (
                    <div className="absolute -top-1 -right-1 text-xs">🔒</div>
                  )}
                  {completed && (
                    <div className="absolute -top-1 -right-1 text-xs">✅</div>
                  )}
                </div>
                <div className="font-medium text-xs">{difficulty.name}</div>
                <div className="text-xs text-gray-400">
                  {difficulty.pairs} pairs
                </div>
                {unlocked && (
                  <div className="text-xs text-gray-500">
                    {difficulty.basePoints} pts × {difficulty.multiplier}x
                  </div>
                )}
                {completed && bestScore > 0 && (
                  <div className="text-xs text-green-400">
                    Best: {bestScore}
                  </div>
                )}
              </div>
              
              {isSelected && unlocked && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="text-center p-3 bg-white/5 rounded-lg">
        <p className="text-sm text-gray-300">
          {isUnlocked(selectedDifficulty) ? (
            DIFFICULTIES[selectedDifficulty].description
          ) : (
            (() => {
              const currentIndex = DIFFICULTY_ORDER.indexOf(selectedDifficulty as any);
              const previousDifficulty = DIFFICULTY_ORDER[currentIndex - 1] as DifficultyId;
              return `🔒 Complete ${DIFFICULTIES[previousDifficulty]?.name} to unlock ${DIFFICULTIES[selectedDifficulty].name}`;
            })()
          )}
        </p>
      </div>
    </div>
  );
}
