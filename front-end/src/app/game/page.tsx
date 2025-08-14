"use client";

import { GameBoard } from '@/components/game/GameBoard';
import { usePointsStore } from '@/stores/usePointsStore';
import Link from 'next/link';

export default function GamePage() {
  const { points, totalEarned } = usePointsStore();

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
          <h1 className="text-3xl font-bold mb-4">Memory Card Game</h1>
          
          {/* Points Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-sm mx-auto mb-8">
            <div className="flex justify-between text-sm mb-1">
              <span>Current Points:</span>
              <span className="font-bold text-green-400">{points}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Total Earned:</span>
              <span>{totalEarned}</span>
            </div>
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
