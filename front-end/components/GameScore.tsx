'use client'

import { Clock, Target, Trophy, Timer } from 'lucide-react'
import { GameStats } from '@/lib/game-types'

// Types
interface GameScoreProps {
  moves: number
  matches: number
  timer: number
  stats?: GameStats
  className?: string
}

// Helper functions
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatScore(moves: number, matches: number): number {
  if (matches === 0) return 0
  return Math.round((matches * 100) / Math.max(moves, 1))
}

// Main component
export default function GameScore({ 
  moves, 
  matches, 
  timer, 
  stats, 
  className = '' 
}: GameScoreProps) {
  const score = formatScore(moves, matches)

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Moves */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Moves</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{moves}</div>
        </div>

        {/* Matches */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Matches</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{matches}</div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {formatTime(timer)}
          </div>
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Timer className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{score}</div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Game Stats</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.totalGames}</div>
              <div className="text-xs text-gray-500">Games Played</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.bestScore}</div>
              <div className="text-xs text-gray-500">Best Score</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.averageMoves}</div>
              <div className="text-xs text-gray-500">Avg Moves</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 