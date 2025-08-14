"use client";

import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { usePointsStore } from "@/stores/usePointsStore";
import Link from "next/link";

export default function Home() {
  const { points, totalEarned } = usePointsStore();

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
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm mb-1">
                <span>Current Points:</span>
                <span className="font-bold text-green-400">{points}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Total Earned:</span>
                <span>{totalEarned}</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Link */}
        <div className="max-w-xl mx-auto mb-12 flex justify-center">
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
        </div>

        {/* Connect Wallet Section */}
        <div className="max-w-xl mx-auto flex justify-center">
          <ConnectWallet />
        </div>
      </div>
    </main>
  );
}
