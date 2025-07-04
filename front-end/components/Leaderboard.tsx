'use client'

import { Trophy, Users, Clock, Target, BarChart3 } from 'lucide-react'
import { useLeaderboard } from '@/lib/contract-service'

interface LeaderboardProps {
  className?: string
}

export default function Leaderboard({ className = '' }: LeaderboardProps) {
  // Mock player addresses for demo - in production, this would come from your app's user base
  const playerAddresses = [
    'ST1PLAYER1...',
    'ST2PLAYER2...',
    'ST3PLAYER3...'
  ]
  
  const { data: leaderboard = [], isLoading, error } = useLeaderboard(playerAddresses)

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="text-right">
                <div className="w-12 h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-10 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
        </div>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Failed to load leaderboard</p>
        </div>
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
        </div>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No players yet</p>
          <p className="text-sm text-gray-400">Complete a game to appear on the leaderboard!</p>
        </div>
      </div>
    )
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  function getRankIcon(index: number) {
    switch (index) {
      case 0:
        return <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
      case 1:
        return <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
      case 2:
        return <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
      default:
        return <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">{index + 1}</div>
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Hall of Fame</h3>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.player}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
              index === 0 
                ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' 
                : index === 1
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                : index === 2
                ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Rank */}
            <div className="flex-shrink-0">
              {getRankIcon(index)}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 truncate">
                  {formatAddress(entry.player)}
                </span>
                {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
              </div>
              <div className="text-sm text-gray-500">
                {entry.totalGames} games • {entry.totalWins} wins
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <Target className="w-3 h-3" />
                  <span className="font-medium">{entry.bestMoves}</span>
                </div>
                <div className="text-xs text-gray-500">moves</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">{formatTime(entry.bestTime)}</span>
                </div>
                <div className="text-xs text-gray-500">time</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Rankings based on fewest moves, then fastest time
        </p>
      </div>
    </div>
  )
} 