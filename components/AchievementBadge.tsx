'use client'

import { Trophy, Zap, Target } from 'lucide-react'
import { Card, CardContent } from './ui/card'

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  unlocked: boolean
  rarity: 'common' | 'rare' | 'legendary'
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600', 
  legendary: 'from-purple-400 to-yellow-500'
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 p-2',
    md: 'w-16 h-16 p-3',
    lg: 'w-20 h-20 p-4'
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  }

  const IconComponent = achievement.icon

  return (
    <div className="relative group">
      <Card 
        className={`${sizeClasses[size]} transition-all duration-300 hover:scale-105 cursor-pointer
          ${achievement.unlocked 
            ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} border-2 border-white/20 shadow-lg` 
            : 'bg-gray-800 border-gray-700 opacity-50'
          }`}
      >
        <CardContent className="p-0 flex items-center justify-center h-full">
          <IconComponent 
            className={`${iconSizes[size]} ${
              achievement.unlocked ? 'text-white' : 'text-gray-500'
            }`} 
          />
        </CardContent>
      </Card>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                      bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        <div className="font-semibold">{achievement.name}</div>
        <div className="text-xs text-gray-300">{achievement.description}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 
                        border-transparent border-t-black"></div>
      </div>
    </div>
  )
}

interface AchievementShowcaseProps {
  playerAchievements?: {
    'sub-60s': boolean
    'flawless': boolean
    'streak-10': boolean
  }
}

export function AchievementShowcase({ playerAchievements }: AchievementShowcaseProps) {
  const achievements: Achievement[] = [
    {
      id: 'sub-60s',
      name: 'Speed Demon',
      description: 'Complete a game in under 60 seconds',
      icon: Zap,
      unlocked: playerAchievements?.['sub-60s'] || false,
      rarity: 'rare'
    },
    {
      id: 'flawless',
      name: 'Flawless Victory',
      description: 'Complete a game with no mismatches',
      icon: Trophy,
      unlocked: playerAchievements?.['flawless'] || false,
      rarity: 'legendary'
    },
    {
      id: 'streak-10',
      name: 'Win Streak Master',
      description: 'Win 10 games in a row',
      icon: Target,
      unlocked: playerAchievements?.['streak-10'] || false,
      rarity: 'legendary'
    }
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Achievements</h3>
        <div className="text-sm text-gray-600">
          {unlockedCount}/{totalCount} Unlocked
        </div>
      </div>
      
      <div className="flex gap-3 flex-wrap">
        {achievements.map((achievement) => (
          <AchievementBadge 
            key={achievement.id} 
            achievement={achievement} 
            size="md"
          />
        ))}
      </div>
    </div>
  )
} 