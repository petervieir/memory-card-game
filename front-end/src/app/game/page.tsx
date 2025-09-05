"use client";

import { GameBoard } from '@/components/game/GameBoard';
// import { usePointsStore } from '@/stores/usePointsStore';
import { PointsBadge } from '@/components/game/PointsBadge';
import { BalanceNetworkBadge } from '@/components/wallet/BalanceNetworkBadge';
import Link from 'next/link';

export default function GamePage() {
  // const { points, totalEarned } = usePointsStore();

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
          
          <h1 className="text-3xl font-bold mb-4">Memory Card Game</h1>
          
          {/* Points Display */}
          <div className="max-w-sm mx-auto mb-8 flex justify-center">
            <PointsBadge />
          </div>
        </div>

        {/* Game Instructions */}
        <div className="max-w-lg mx-auto mb-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold mb-2 text-center">How to Play</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Click cards to flip them over</li>
            <li>• Match pairs of identical emojis</li>
            <li>• Complete in fewer moves for bonus points</li>
            <li>• Base: 100 points + efficiency bonus</li>
          </ul>
        </div>

        {/* Game Board */}
        <GameBoard />
      </div>
    </main>
  );
}
