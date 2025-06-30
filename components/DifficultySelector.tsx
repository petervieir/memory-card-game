'use client'

import { Check } from 'lucide-react'
import { DifficultyLevel, DifficultyConfig, DIFFICULTY_CONFIGS } from '@/lib/game-types'

interface DifficultySelectorProps {
  selectedDifficulty: DifficultyLevel
  onSelectDifficulty: (difficulty: DifficultyLevel) => void
  disabled?: boolean
  className?: string
}

export default function DifficultySelector({
  selectedDifficulty,
  onSelectDifficulty,
  disabled = false,
  className = ''
}: DifficultySelectorProps) {
  const difficulties = Object.values(DIFFICULTY_CONFIGS)

  function getDifficultyStyle(config: DifficultyConfig, isSelected: boolean): string {
    const baseStyle = "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
    
    if (disabled) {
      return `${baseStyle} opacity-50 cursor-not-allowed border-gray-200 bg-gray-50`
    }
    
    if (isSelected) {
      switch (config.level) {
        case 'easy':
          return `${baseStyle} border-green-400 bg-green-50 shadow-md`
        case 'medium':
          return `${baseStyle} border-yellow-400 bg-yellow-50 shadow-md`
        case 'hard':
          return `${baseStyle} border-red-400 bg-red-50 shadow-md`
        default:
          return `${baseStyle} border-blue-400 bg-blue-50 shadow-md`
      }
    }
    
    return `${baseStyle} border-gray-200 bg-white hover:border-gray-300`
  }

  function getTextColor(config: DifficultyConfig, isSelected: boolean): string {
    if (disabled) return 'text-gray-400'
    
    if (isSelected) {
      switch (config.level) {
        case 'easy':
          return 'text-green-700'
        case 'medium':
          return 'text-yellow-700'
        case 'hard':
          return 'text-red-700'
        default:
          return 'text-blue-700'
      }
    }
    
    return 'text-gray-700'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Difficulty</h3>
        <p className="text-sm text-gray-600">Select your preferred board size</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((config) => {
          const isSelected = selectedDifficulty === config.level
          
          return (
            <button
              key={config.level}
              onClick={() => !disabled && onSelectDifficulty(config.level)}
              disabled={disabled}
              className={getDifficultyStyle(config, isSelected)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              {/* Difficulty Info */}
              <div className="text-center">
                <div className="text-2xl mb-2">{config.icon}</div>
                <div className={`font-bold text-lg mb-1 ${getTextColor(config, isSelected)}`}>
                  {config.name}
                </div>
                <div className={`text-sm mb-2 ${getTextColor(config, isSelected)}`}>
                  {config.description}
                </div>
                <div className={`text-xs ${getTextColor(config, isSelected)}`}>
                  {config.pairsCount} pairs to match
                </div>
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Higher difficulties require more memory and concentration
        </p>
      </div>
    </div>
  )
} 