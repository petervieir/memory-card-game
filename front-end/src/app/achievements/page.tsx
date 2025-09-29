"use client";

import { AchievementGrid, AchievementProgress } from "@/components/game/AchievementBadge";
import { BalanceNetworkBadge } from "@/components/wallet/BalanceNetworkBadge";
import { usePointsStore } from "@/stores/usePointsStore";
import Link from "next/link";
import { useState } from "react";

type CategoryFilter = 'all' | 'moves' | 'difficulty' | 'milestone' | 'special';

export default function AchievementsPage() {
  const { totalEarned } = usePointsStore();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const categories: { id: CategoryFilter; name: string; icon: string }[] = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'moves', name: 'Efficiency', icon: '⚡' },
    { id: 'difficulty', name: 'Mastery', icon: '🎯' },
    { id: 'milestone', name: 'Milestones', icon: '🎮' },
    { id: 'special', name: 'Special', icon: '⭐' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-block text-sm text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Back to Home
          </Link>
          
          {/* Balance and Network Badge */}
          <div className="flex justify-center mb-4">
            <BalanceNetworkBadge />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">🏆 Achievements</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Track your progress and unlock achievements by playing the memory card game.
          </p>
        </div>

        {/* Achievement Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <AchievementProgress showDetails={true} />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }
              `}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        {totalEarned > 0 ? (
          <div className="max-w-4xl mx-auto">
            <AchievementGrid 
              category={activeCategory} 
              showLocked={true} 
            />
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center p-8">
            <div className="p-6 bg-yellow-500/20 border border-yellow-500 rounded-lg">
              <div className="text-xl mb-2">🔒</div>
              <h3 className="font-bold text-yellow-400 mb-2">Start Playing to Unlock Achievements</h3>
              <p className="text-sm text-gray-300 mb-4">
                Connect your wallet and play the memory card game to start earning achievements.
              </p>
              <Link 
                href="/game"
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Play Now
              </Link>
            </div>
          </div>
        )}

        {/* Back to Game */}
        <div className="text-center mt-12">
          <Link
            href="/game"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            🎮 Play Memory Game
          </Link>
        </div>
      </div>
    </main>
  );
}
