'use client'

import { BarChart3, Clock, Target, Calendar, TrendingUp, History } from 'lucide-react'
import { useGameHistory } from '@/lib/contract-service'

interface MyStatsProps {
  className?: string
}

export default function MyStats({ className = '' }: MyStatsProps) {
  const { data: gameHistory, isLoading, error } = useGameHistory()

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">My Stats</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-8 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">My Stats</h3>
        </div>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Failed to load your stats</p>
        </div>
      </div>
    )
  }

  if (!gameHistory || gameHistory.results.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">My Stats</h3>
        </div>
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No games played yet</p>
          <p className="text-sm text-gray-400">Complete a game to see your stats here!</p>
        </div>
      </div>
    )
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getScoreColor(score: number): string {
    if (score <= 120) return 'text-green-600 bg-green-50 border-green-200'
    if (score <= 180) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score <= 250) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const completedGames = gameHistory.results.filter(g => g.completed)
  const winRate = gameHistory.totalGames > 0 ? Math.round((completedGames.length / gameHistory.totalGames) * 100) : 0

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">My Stats</h3>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{gameHistory.totalGames}</span>
          </div>
          <div className="text-sm text-blue-700 font-medium">Games Played</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center gap-1 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{winRate}%</span>
          </div>
          <div className="text-sm text-green-700 font-medium">Win Rate</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {gameHistory.bestMoves || '-'}
            </span>
          </div>
          <div className="text-sm text-purple-700 font-medium">Best Moves</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">
              {gameHistory.bestTime ? formatTime(gameHistory.bestTime) : '-'}
            </span>
          </div>
          <div className="text-sm text-orange-700 font-medium">Best Time</div>
        </div>
      </div>

      {/* Recent Games */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-4 h-4" />
          Recent Games
        </h4>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {gameHistory.results.map((game, index) => (
            <div
              key={game.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              {/* Game Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                {gameHistory.results.length - index}
              </div>

              {/* Game Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium">{game.moves} moves</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium">{formatTime(game.timeSeconds)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(game.timestamp)}
                </div>
              </div>

              {/* Score and Status */}
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-xs font-medium border ${getScoreColor(game.score)}`}>
                  {game.score}
                </div>
                {game.completed && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Showing your last {gameHistory.results.length} games • Score = moves × 10 + seconds
        </p>
      </div>
    </div>
  )
} 