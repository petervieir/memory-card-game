'use client'

import { useState } from 'react'
import { Coins, Trophy, Users, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useEntryFeeStatus, useSetEntryFee, useStartGameEnhanced } from '@/lib/contract-service'

interface EntryFeePanelProps {
  onGameStart?: (gameUri: string, shuffleCommit: string) => void
  disabled?: boolean
}

export function EntryFeePanel({ onGameStart, disabled }: EntryFeePanelProps) {
  const [isAdmin] = useState(false) // In real app, check if user is contract owner
  const [newFee, setNewFee] = useState('')
  
  const { data: entryFeeStatus, isLoading } = useEntryFeeStatus()
  const setEntryFeeMutation = useSetEntryFee()
  const startGameMutation = useStartGameEnhanced()

  const handleSetFee = async () => {
    if (!newFee || isNaN(Number(newFee))) return
    
    try {
      await setEntryFeeMutation.mutateAsync(Number(newFee) * 1000000) // Convert to micro-STX
      setNewFee('')
    } catch (error) {
      console.error('Failed to set entry fee:', error)
    }
  }

  const handleStartGame = async () => {
    try {
      // Generate shuffle commitment (in real app, this would be cryptographically secure)
      const shuffleCommit = Math.random().toString(36).substring(2, 34)
      const gameUri = `gaia://game-${Date.now()}.json`
      
      await startGameMutation.mutateAsync({ gameUri, shuffleCommit })
      onGameStart?.(gameUri, shuffleCommit)
    } catch (error) {
      console.error('Failed to start enhanced game:', error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading entry fee status...</div>
        </CardContent>
      </Card>
    )
  }

  const feeInSTX = entryFeeStatus ? entryFeeStatus.feeRequired / 1000000 : 0
  const prizePoolInSTX = entryFeeStatus ? entryFeeStatus.prizePool / 1000000 : 0

  return (
    <div className="space-y-4">
      {/* Entry Fee Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Entry Fee & Prize Pool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{feeInSTX}</div>
              <div className="text-sm text-gray-600">STX Entry Fee</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{prizePoolInSTX}</div>
              <div className="text-sm text-gray-600">STX Prize Pool</div>
            </div>
          </div>

          {entryFeeStatus?.feeRequired && entryFeeStatus.feeRequired > 0 && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <div className="text-sm">
                {entryFeeStatus.hasPaid 
                  ? '✅ Entry fee paid! You can play this round.'
                  : `⚠️ Entry fee required: ${feeInSTX} STX`
                }
              </div>
            </div>
          )}

          <button
            onClick={handleStartGame}
            disabled={disabled || startGameMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 
                     rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {startGameMutation.isPending ? 'Starting Game...' : 'Start Enhanced Game'}
          </button>
        </CardContent>
      </Card>

      {/* Admin Panel */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="number"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                placeholder="Entry fee in STX"
                className="flex-1 px-3 py-2 border rounded-lg"
                step="0.01"
                min="0"
              />
              <button
                onClick={handleSetFee}
                disabled={setEntryFeeMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {setEntryFeeMutation.isPending ? 'Setting...' : 'Set Fee'}
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              Setting entry fee to 0 makes the game free to play.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prize Pool Info */}
      {prizePoolInSTX > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <Trophy className="w-4 h-4" />
              <div className="text-sm font-medium">
                Current prize pool: {prizePoolInSTX} STX
              </div>
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Winner takes the prize pool at the end of the tournament!
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 