'use client'

import { Trophy, Clock, Target, Sparkles, X, Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useCompleteGame } from '@/lib/contract-service'
import { DifficultyLevel, DIFFICULTY_CONFIGS } from '@/lib/game-types'

interface VictoryModalProps {
  isOpen: boolean
  onClose: () => void
  moves: number
  timeSeconds: number
  difficulty: DifficultyLevel
  onNewGame?: () => void
}

export default function VictoryModal({ 
  isOpen, 
  onClose, 
  moves, 
  timeSeconds,
  difficulty,
  onNewGame 
}: VictoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const completeGameMutation = useCompleteGame()

  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty]

  if (!isOpen) return null

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function calculateScore(): number {
    // Lower score is better: base score from moves + time penalty
    return moves * 10 + timeSeconds
  }

  function getPerformanceRating(): { rating: string; color: string; message: string } {
    // Adjust performance thresholds based on difficulty
    const thresholds = {
      easy: { excellent: 12, great: 16, good: 24 },
      medium: { excellent: 25, great: 35, good: 50 },
      hard: { excellent: 45, great: 60, good: 80 }
    }

    const threshold = thresholds[difficulty]
    
    if (moves <= threshold.excellent) {
      return {
        rating: 'Excellent!',
        color: 'text-green-600',
        message: 'Outstanding memory skills!'
      }
    } else if (moves <= threshold.great) {
      return {
        rating: 'Great!',
        color: 'text-blue-600',
        message: 'Well done! Keep practicing!'
      }
    } else if (moves <= threshold.good) {
      return {
        rating: 'Good',
        color: 'text-yellow-600',
        message: 'Nice work! Room for improvement!'
      }
    } else {
      return {
        rating: 'Keep Trying!',
        color: 'text-orange-600',
        message: 'Practice makes perfect!'
      }
    }
  }

  const performance = getPerformanceRating()

  const handleSaveScore = async () => {
    try {
      setIsSubmitting(true)
      await completeGameMutation.mutateAsync({ moves, timeSeconds })
      onClose()
    } catch (error) {
      console.error('Failed to save score:', error)
      // Still close the modal even if saving fails
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const getShareText = () => {
    return `🧠 Just completed a ${difficultyConfig.name} Memory Game! ${difficultyConfig.icon}\n\n` +
           `📊 Final Score: ${calculateScore()}\n` +
           `🎯 Moves: ${moves}\n` +
           `⏱️ Time: ${formatTime(timeSeconds)}\n` +
           `🏆 Rating: ${performance.rating}\n\n` +
           `Can you beat my score? Play now! #MemoryGame #Blockchain`
  }

  const handleCopyScore = async () => {
    try {
      await navigator.clipboard.writeText(getShareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const handleShareTwitter = () => {
    const text = encodeURIComponent(getShareText())
    const url = `https://twitter.com/intent/tweet?text=${text}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(getShareText())
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${text}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-t-2xl p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-yellow-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="w-12 h-12 text-white" />
              <Sparkles className="w-6 h-6 text-white ml-2 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-yellow-100">
              You&apos;ve completed the memory game!
            </p>
            
            {/* Difficulty Badge */}
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium">
              <span>{difficultyConfig.icon}</span>
              <span>{difficultyConfig.name} Mode</span>
              <span>•</span>
              <span>{difficultyConfig.description}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6">
          {/* Performance Rating */}
          <div className="text-center mb-6">
            <div className={`text-2xl font-bold ${performance.color} mb-1`}>
              {performance.rating}
            </div>
            <p className="text-gray-600 text-sm">
              {performance.message}
            </p>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{moves}</span>
              </div>
              <div className="text-sm text-blue-700 font-medium">Moves</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{formatTime(timeSeconds)}</span>
              </div>
              <div className="text-sm text-green-700 font-medium">Time</div>
            </div>
          </div>

          {/* Score */}
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="text-lg text-gray-700 mb-1">Final Score</div>
            <div className="text-3xl font-bold text-gray-900">{calculateScore()}</div>
            <div className="text-xs text-gray-500 mt-1">
              Lower scores are better! (moves × 10 + seconds)
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Your Victory!
            </button>
            
            {showShareOptions && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShareTwitter}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    𝕏 Twitter
                  </button>
                  <button
                    onClick={handleShareLinkedIn}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    💼 LinkedIn
                  </button>
                </div>
                <button
                  onClick={handleCopyScore}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Score
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSaveScore}
              disabled={isSubmitting || completeGameMutation.isPending}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isSubmitting || completeGameMutation.isPending) ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Score...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  Save Score & Update Stats
                </>
              )}
            </button>

            <div className="flex gap-3">
              <button
                onClick={onNewGame}
                className="flex-1 bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                New Game
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Error Message */}
          {completeGameMutation.isError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">
                Failed to save score. Don&apos;t worry, you can still play again!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 