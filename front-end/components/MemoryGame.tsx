'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Suspense } from 'react'
import FlipCard from './FlipCard'
import GameScore from './GameScore'
import VictoryModal from './VictoryModal'
import Leaderboard from './Leaderboard'
import MyStats from './MyStats'
import DifficultySelector from './DifficultySelector'
import { useGameCards, useGameState, useStartGame, useFlipCard, useCheckMatch, useResetGame } from '@/lib/contract-service'
import { GAME_CONFIG, DifficultyLevel, DIFFICULTY_CONFIGS } from '@/lib/game-types'
import { Play, RotateCcw, Loader2, AlertCircle, Trophy, BarChart3, Pause, PlayCircle, Settings } from 'lucide-react'

// Types
interface MemoryGameProps {
  className?: string
}

// Loading component
function GameLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600">Loading game cards...</p>
      </div>
    </div>
  )
}

// Main component
export default function MemoryGame({ className = '' }: MemoryGameProps) {
  const [localGameState, setLocalGameState] = useState({
    moves: 0,
    matches: 0,
    timer: 0,
    isPlaying: false,
    isPaused: false,
    flippedCards: [] as number[],
    matchedCards: [] as number[],
    gameStarted: false,
    difficulty: GAME_CONFIG.DEFAULT_DIFFICULTY as DifficultyLevel
  })

  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'game' | 'leaderboard' | 'stats'>('game')
  const [showSettings, setShowSettings] = useState(false)
  const [windowFocused, setWindowFocused] = useState(true)
  
  // Refs for timer management
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)

  // Get current difficulty config
  const currentDifficulty = DIFFICULTY_CONFIGS[localGameState.difficulty]

  // Generate token IDs based on selected difficulty
  const sampleTokenIds = useMemo(() => {
    const uniqueTokenIds = Array.from({ length: currentDifficulty.pairsCount }, (_, i) => i + 1)
    const pairedTokenIds = [...uniqueTokenIds, ...uniqueTokenIds]
    return pairedTokenIds.sort(() => Math.random() - 0.5) // Shuffle the pairs
  }, [currentDifficulty.pairsCount]) // Re-shuffle when difficulty changes
  
  // TanStack Query hooks
  const { data: cards = [], isLoading: cardsLoading } = useGameCards(sampleTokenIds)
  const { data: contractGameState, isLoading: contractLoading } = useGameState()
  const startGameMutation = useStartGame()
  const flipCardMutation = useFlipCard()
  const checkMatchMutation = useCheckMatch()
  const resetGameMutation = useResetGame()

  // Enhanced timer management
  useEffect(() => {
    if (localGameState.isPlaying && !localGameState.isPaused) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - (localGameState.timer * 1000)
      }
      
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - (startTimeRef.current || now) - pausedTimeRef.current) / 1000)
        setLocalGameState(prev => ({ ...prev, timer: elapsed }))
      }, 100) // More precise timer updates
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [localGameState.isPlaying, localGameState.isPaused, localGameState.timer])

  // Sync contract state with local state
  useEffect(() => {
    if (contractGameState) {
      setLocalGameState(prev => ({
        ...prev,
        moves: contractGameState.moves,
        flippedCards: contractGameState.flippedCards
      }))
    }
  }, [contractGameState])

  // Event handlers
  const handleStartGame = useCallback(async () => {
    try {
      // Generate a game URI for demo (in real app, this would be uploaded to Gaia)
      const gameUri = `https://gaia.example.com/game-${Date.now()}.json`
      await startGameMutation.mutateAsync(gameUri)
      
      // Reset timer references
      startTimeRef.current = Date.now()
      pausedTimeRef.current = 0
      
      setLocalGameState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        gameStarted: true,
        timer: 0,
        moves: 0,
        matches: 0,
        flippedCards: [],
        matchedCards: []
      }))
      setShowSettings(false)
    } catch (error) {
      console.error('Failed to start game:', error)
    }
  }, [startGameMutation])

  const handlePause = useCallback(() => {
    if (!localGameState.isPlaying || localGameState.isPaused) return
    
    setLocalGameState(prev => ({ ...prev, isPaused: true, isPlaying: false }))
    if (startTimeRef.current) {
      pausedTimeRef.current += Date.now() - startTimeRef.current - (localGameState.timer * 1000)
    }
  }, [localGameState.isPlaying, localGameState.isPaused, localGameState.timer])

  const handleResume = useCallback(() => {
    if (!localGameState.gameStarted || !localGameState.isPaused) return
    
    startTimeRef.current = Date.now() - (localGameState.timer * 1000)
    setLocalGameState(prev => ({ ...prev, isPaused: false, isPlaying: true }))
  }, [localGameState.gameStarted, localGameState.isPaused, localGameState.timer])

  // Browser focus/blur detection for auto-pause
  useEffect(() => {
    const handleFocus = () => {
      setWindowFocused(true)
      if (localGameState.gameStarted && localGameState.isPaused && !localGameState.isPlaying) {
        // Auto-resume if game was auto-paused due to blur
        handleResume()
      }
    }

    const handleBlur = () => {
      setWindowFocused(false)
      if (localGameState.isPlaying && !localGameState.isPaused) {
        // Auto-pause when window loses focus
        handlePause()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur()
      } else {
        handleFocus()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [localGameState.isPlaying, localGameState.isPaused, localGameState.gameStarted, handlePause, handleResume])

  const handleCardClick = useCallback(async (cardId: number) => {
    if (!localGameState.isPlaying || localGameState.isPaused || localGameState.flippedCards.length >= 2 || localGameState.matchedCards.includes(cardId)) return

    try {
      await flipCardMutation.mutateAsync(cardId)
      
      const newFlippedCards = [...localGameState.flippedCards, cardId]
      setLocalGameState(prev => ({
        ...prev,
        flippedCards: newFlippedCards,
        moves: prev.moves + 1
      }))

      // Check for match when two cards are flipped
      if (newFlippedCards.length === 2) {
        setTimeout(async () => {
          try {
            // Call contract to check match
            await checkMatchMutation.mutateAsync()
            
            // Check if the two flipped cards have the same token ID (are a pair)
            const [card1, card2] = newFlippedCards
            const isMatch = cards[card1]?.tokenId === cards[card2]?.tokenId

            if (isMatch) {
              setLocalGameState(prev => ({
                ...prev,
                matches: prev.matches + 1,
                flippedCards: [],
                matchedCards: [...prev.matchedCards, card1, card2]
              }))
            } else {
              setLocalGameState(prev => ({
                ...prev,
                flippedCards: []
              }))
            }
          } catch (error) {
            console.error('Failed to check match:', error)
            // Reset flipped cards on error
            setLocalGameState(prev => ({
              ...prev,
              flippedCards: []
            }))
          }
        }, GAME_CONFIG.FLIP_DELAY)
      }
    } catch (error) {
      console.error('Failed to flip card:', error)
    }
  }, [localGameState.isPlaying, localGameState.isPaused, localGameState.flippedCards, localGameState.matchedCards, flipCardMutation, checkMatchMutation, cards])

  const handleResetGame = useCallback(async () => {
    try {
      await resetGameMutation.mutateAsync()
      
      // Reset timer references
      startTimeRef.current = null
      pausedTimeRef.current = 0
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      
      setLocalGameState(prev => ({
        ...prev,
        moves: 0,
        matches: 0,
        timer: 0,
        isPlaying: false,
        isPaused: false,
        flippedCards: [],
        matchedCards: [],
        gameStarted: false
      }))
    } catch (error) {
      console.error('Failed to reset game:', error)
    }
  }, [resetGameMutation])

  const handleDifficultyChange = useCallback((difficulty: DifficultyLevel) => {
    if (localGameState.gameStarted) {
      // If game is in progress, ask for confirmation
      if (!confirm('Changing difficulty will reset your current game. Continue?')) {
        return
      }
    }
    
    setLocalGameState(prev => ({
      ...prev,
      difficulty,
      // Reset game state when changing difficulty
      moves: 0,
      matches: 0,
      timer: 0,
      isPlaying: false,
      isPaused: false,
      flippedCards: [],
      matchedCards: [],
      gameStarted: false
    }))
    
    // Reset timer references
    startTimeRef.current = null
    pausedTimeRef.current = 0
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [localGameState.gameStarted])

  // Check if game is complete
  const isGameComplete = localGameState.matches === currentDifficulty.pairsCount
  
  // Stop timer and show victory modal when game is complete
  useEffect(() => {
    if (isGameComplete && (localGameState.isPlaying || localGameState.isPaused)) {
      setLocalGameState(prev => ({ ...prev, isPlaying: false, isPaused: false }))
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      // Show victory modal after a brief delay for celebration effect
      setTimeout(() => {
        setShowVictoryModal(true)
      }, 500)
    }
  }, [isGameComplete, localGameState.isPlaying, localGameState.isPaused])

  const handleNewGame = useCallback(() => {
    setShowVictoryModal(false)
    handleStartGame()
  }, [handleStartGame])

  // Loading states
  if (cardsLoading || contractLoading) {
    return <GameLoading />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Memory Game</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'game'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Game
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Hall of Fame
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            My Stats
          </button>
        </div>
      </div>

      {/* Game Tab */}
      {activeTab === 'game' && (
        <>
          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Game Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <DifficultySelector
                selectedDifficulty={localGameState.difficulty}
                onSelectDifficulty={handleDifficultyChange}
                disabled={localGameState.gameStarted && !isGameComplete}
              />
            </div>
          )}

          {/* Game Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {currentDifficulty.icon} {currentDifficulty.name} Mode
              </h3>
              {isGameComplete && (
                <div className="text-green-600 font-medium">🎉 Completed!</div>
              )}
              {localGameState.isPaused && !isGameComplete && (
                <div className="text-yellow-600 font-medium">⏸️ Paused</div>
              )}
              {!windowFocused && localGameState.gameStarted && (
                <div className="text-orange-600 font-medium text-sm">
                  🔍 Game auto-paused (window not focused)
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                disabled={localGameState.isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              
              {/* Pause/Resume Button */}
              {localGameState.gameStarted && !isGameComplete && (
                <button
                  onClick={localGameState.isPaused ? handleResume : handlePause}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  {localGameState.isPaused ? (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  )}
                </button>
              )}
              
              {/* Start/Reset Button */}
              {!localGameState.gameStarted ? (
                <button
                  onClick={handleStartGame}
                  disabled={startGameMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {startGameMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Start Game
                </button>
              ) : (
                <button
                  onClick={handleResetGame}
                  disabled={resetGameMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  {resetGameMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Contract Status */}
          {contractGameState && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                Contract State: {contractGameState.gameStarted ? 'Game Active' : 'No Active Game'}
              </span>
            </div>
          )}

          {/* Game Score */}
          <GameScore
            moves={localGameState.moves}
            matches={localGameState.matches}
            timer={localGameState.timer}
          />

          {/* Game Grid - Dynamic sizing based on difficulty */}
          <Suspense fallback={<GameLoading />}>
            <div 
              className={`grid gap-3 max-w-4xl mx-auto`}
              style={{ 
                gridTemplateColumns: `repeat(${currentDifficulty.gridCols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${currentDifficulty.gridCols}, minmax(0, 1fr))`
              }}
            >
              {cards.map((card) => (
                <FlipCard
                  key={card.id}
                  id={card.id}
                  imageUrl={card.imageUrl}
                  isFlipped={localGameState.flippedCards.includes(card.id) || localGameState.matchedCards.includes(card.id)}
                  isMatched={localGameState.matchedCards.includes(card.id)}
                  onClick={handleCardClick}
                  disabled={localGameState.isPaused || !localGameState.isPlaying}
                />
              ))}
            </div>
          </Suspense>

          {/* Error States */}
          {(startGameMutation.isError || flipCardMutation.isError || checkMatchMutation.isError) && (
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Transaction failed. Please try again.
              </p>
            </div>
          )}
        </>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <Leaderboard />
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <MyStats />
      )}

      {/* Victory Modal */}
      <VictoryModal
        isOpen={showVictoryModal}
        onClose={() => setShowVictoryModal(false)}
        moves={localGameState.moves}
        timeSeconds={localGameState.timer}
        difficulty={localGameState.difficulty}
        onNewGame={handleNewGame}
      />
    </div>
  )
} 