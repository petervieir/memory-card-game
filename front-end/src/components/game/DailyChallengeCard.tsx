"use client";

import { DailyChallenge, DailyChallengeCompletion, DIFFICULTIES } from '@/types/game';

interface DailyChallengeCardProps {
  readonly challenge: DailyChallenge;
  readonly completion?: DailyChallengeCompletion | null;
  readonly onStartChallenge: () => void;
  readonly className?: string;
}

function get_condition_icon(conditionType: string): string {
  switch (conditionType) {
    case 'max_moves':
      return '🎯';
    case 'timer':
      return '⏱️';
    case 'no_hints':
      return '🧩';
    case 'perfect_accuracy':
      return '🎪';
    case 'combo_streak':
      return '🔥';
    default:
      return '✨';
  }
}

export function DailyChallengeCard({ 
  challenge, 
  completion, 
  onStartChallenge,
  className = '' 
}: DailyChallengeCardProps) {
  const isCompleted = completion?.completed || false;
  const conditionMet = completion?.conditionMet || false;
  const difficulty = DIFFICULTIES[challenge.difficulty];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
      
      {/* Border animation for active challenge */}
      {!isCompleted && (
        <div className="absolute inset-0 border-2 border-purple-500/50 rounded-xl animate-pulse" />
      )}
      
      <div className="relative bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700 rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <h3 className="text-xl font-bold text-white">Daily Challenge</h3>
              <p className="text-sm text-gray-400">{challenge.date}</p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
              <span className="text-lg">✓</span>
              <span className="text-sm font-medium text-green-400">Completed</span>
            </div>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-gray-600">
          <span className="text-2xl">{difficulty.emoji}</span>
          <div className="flex-1">
            <div className="font-semibold text-white">{difficulty.name} Difficulty</div>
            <div className="text-sm text-gray-400">{difficulty.pairs} pairs • {difficulty.totalCards} cards</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-yellow-400">+{challenge.bonusPoints}</div>
            <div className="text-xs text-gray-400">bonus pts</div>
          </div>
        </div>

        {/* Special Condition */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{get_condition_icon(challenge.specialCondition.type)}</span>
            <div className="flex-1">
              <div className="text-xs text-purple-300 font-medium uppercase tracking-wider mb-1">
                Special Condition
              </div>
              <div className="text-white font-medium">{challenge.specialCondition.description}</div>
            </div>
            {isCompleted && (
              <div className="text-2xl">
                {conditionMet ? '✨' : '❌'}
              </div>
            )}
          </div>
        </div>

        {/* Completion Stats */}
        {isCompleted && completion && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg border border-gray-600 text-center">
              <div className="text-2xl font-bold text-blue-400">{completion.moves}</div>
              <div className="text-xs text-gray-400">Moves</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-gray-600 text-center">
              <div className="text-2xl font-bold text-yellow-400">{completion.score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isCompleted && (
          <button
            onClick={onStartChallenge}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Challenge 🚀
          </button>
        )}

        {isCompleted && (
          <div className="text-center text-sm text-gray-400">
            Come back tomorrow for a new challenge! 🌟
          </div>
        )}
      </div>
    </div>
  );
}

