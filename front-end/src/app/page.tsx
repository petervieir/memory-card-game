"use client";

import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { PointsBadge } from "@/components/game/PointsBadge";
import { AchievementProgress } from "@/components/game/AchievementBadge";
import { usePointsStore } from "@/stores/usePointsStore";
import Link from "next/link";

export default function Home() {
  const { totalEarned } = usePointsStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 stacks-gradient bg-clip-text text-transparent">
            Memory Card Game
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Play a simple memory card game on Stacks. Connect your wallet to earn
            points you can use in the store.
          </p>

          {/* Points Display */}
          {totalEarned > 0 && (
            <div className="max-w-md mx-auto mb-8 flex justify-center">
              <PointsBadge />
            </div>
          )}

          {/* Achievement Progress */}
          {totalEarned > 0 && (
            <div className="max-w-md mx-auto mb-8">
              <AchievementProgress showDetails={true} />
            </div>
          )}
        </div>

        {/* Game Links */}
        <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/game"
            className="group block p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-lg font-semibold mb-2">Play Memory Game</h3>
              <p className="text-sm text-muted-foreground">
                Match cards to earn points. Complete faster for bonus points!
              </p>
            </div>
          </Link>

          <Link
            href="/endless"
            className="group block p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg border-2 border-cyan-500/30 hover:border-cyan-500/50 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 text-xs bg-cyan-500 text-white px-2 py-1 rounded-full font-bold">
              NEW
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌊</div>
              <h3 className="text-lg font-semibold mb-2">Endless Mode</h3>
              <p className="text-sm text-muted-foreground">
                Test your skills with increasing difficulty. 3 mistakes = Game Over!
              </p>
            </div>
          </Link>

          <Link
            href="/challenges"
            className="group block p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors relative overflow-hidden"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-semibold mb-2">Daily Challenges</h3>
              <p className="text-sm text-muted-foreground">
                Complete daily challenges for bonus rewards and streak bonuses!
              </p>
            </div>
          </Link>

          <Link
            href="/stats"
            className="group block p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2">Personal Statistics</h3>
              <p className="text-sm text-muted-foreground">
                View your performance metrics and track your improvement over time.
              </p>
            </div>
          </Link>

          <Link
            href="/achievements"
            className="group block p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold mb-2">View Achievements</h3>
              <p className="text-sm text-muted-foreground">
                Track your progress and unlock achievements by playing games.
              </p>
            </div>
          </Link>
        </div>

        {/* Connect Wallet Section */}
        <div className="max-w-xl mx-auto flex justify-center">
          <ConnectWallet />
        </div>
      </div>
    </main>
  );
}
