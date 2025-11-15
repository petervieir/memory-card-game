"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEndlessModeStore } from '@/stores/useEndlessModeStore';
import { useWallet } from '@/contexts/WalletContext';
import { DIFFICULTIES, DIFFICULTY_ORDER } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EndlessModePage() {
  const router = useRouter();
  const { address } = useWallet();
  const {
    currentRun,
    get_leaderboard,
    get_personal_best,
    is_endless_mode_active,
    reset_current_run,
  } = useEndlessModeStore();

  const [leaderboard, setLeaderboard] = useState(get_leaderboard(10));
  const [personalBest, setPersonalBest] = useState(get_personal_best());

  // Update leaderboard and personal best when component mounts or when user completes a run
  useEffect(() => {
    setLeaderboard(get_leaderboard(10));
    setPersonalBest(get_personal_best());
  }, [get_leaderboard, get_personal_best]);

  const handle_start_endless_mode = () => {
    if (!address) {
      alert('Please connect your wallet to play Endless Mode');
      return;
    }

    // Reset any previous run if not active
    if (!is_endless_mode_active()) {
      reset_current_run();
    }

    // Navigate to game with endless mode parameter
    router.push('/game?mode=endless');
  };

  const handle_continue_run = () => {
    if (!address) return;
    router.push('/game?mode=endless');
  };

  const format_date = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncate_address = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌊 Endless Mode
          </h1>
          <p className="text-xl text-gray-300">
            Test your memory across all difficulties! 3 mistakes = Game Over
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Game Info & Start */}
          <div className="space-y-6">
            {/* How to Play Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">📋 How to Play</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div>
                      <p className="font-semibold">Start at Beginner</p>
                      <p className="text-sm text-gray-300">Begin your journey with the easiest difficulty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div>
                      <p className="font-semibold">Auto-Advance on Completion</p>
                      <p className="text-sm text-gray-300">Complete a level to move to the next difficulty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div>
                      <p className="font-semibold">3 Lives System</p>
                      <p className="text-sm text-gray-300">Each wrong match costs 1 life. 3 mistakes = Game Over!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">4️⃣</span>
                    <div>
                      <p className="font-semibold">Cumulative Score</p>
                      <p className="text-sm text-gray-300">Your score accumulates across all levels</p>
                    </div>
                  </div>
                </div>

                {/* Difficulty Progression */}
                <div className="mt-6 p-4 bg-black/30 rounded-lg">
                  <h3 className="font-bold mb-3 text-center">Difficulty Progression</h3>
                  <div className="flex items-center justify-between text-sm">
                    {DIFFICULTY_ORDER.map((diffId, index) => {
                      const diff = DIFFICULTIES[diffId];
                      return (
                        <div key={diffId} className="flex items-center">
                          <div className="text-center">
                            <div className="text-2xl mb-1">{diff.emoji}</div>
                            <div className="text-xs text-gray-400">{diff.name}</div>
                          </div>
                          {index < DIFFICULTY_ORDER.length - 1 && (
                            <div className="mx-2 text-gray-500">→</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Best Card */}
            {personalBest && (
              <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    👑 Your Personal Best
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-300">Score:</span>
                      <span className="font-bold text-yellow-400 text-2xl">{personalBest.score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Levels Completed:</span>
                      <span className="font-semibold">{personalBest.levelsCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Highest Difficulty:</span>
                      <span className="font-semibold">
                        {DIFFICULTIES[personalBest.highestDifficulty].emoji} {DIFFICULTIES[personalBest.highestDifficulty].name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-2">
                      {format_date(personalBest.timestamp)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start/Continue Button */}
            <div className="flex flex-col gap-4">
              {currentRun && is_endless_mode_active() ? (
                <>
                  <Button
                    onClick={handle_continue_run}
                    disabled={!address}
                    className="w-full py-6 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    ▶️ Continue Run
                  </Button>
                  <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-center">
                    <p className="text-sm text-gray-300">
                      You have an active run in progress!
                    </p>
                    <div className="flex justify-center gap-4 mt-2 text-sm">
                      <span>❤️ Lives: {currentRun.livesRemaining}</span>
                      <span>🏆 Score: {currentRun.cumulativeScore}</span>
                      <span>📊 Level: {currentRun.levelsCompleted + 1}</span>
                    </div>
                  </div>
                </>
              ) : (
                <Button
                  onClick={handle_start_endless_mode}
                  disabled={!address}
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  🌊 Start Endless Mode
                </Button>
              )}
              
              {!address && (
                <div className="p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-center">
                  <p className="text-sm text-yellow-200">
                    🔒 Connect your wallet to play Endless Mode
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Leaderboard */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  🏆 Endless Champion Leaderboard
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Top 10 highest scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-4">🎮</div>
                    <p>No scores yet. Be the first champion!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((entry, index) => {
                      const is_current_user = address && entry.walletAddress === address;
                      const rank_emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                      
                      return (
                        <div
                          key={entry.id}
                          className={`p-4 rounded-lg transition-all ${
                            is_current_user
                              ? 'bg-blue-500/30 border-2 border-blue-400'
                              : 'bg-black/30 hover:bg-black/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl min-w-[2rem]">{rank_emoji}</span>
                              <div>
                                <div className="font-mono text-sm text-gray-300">
                                  {is_current_user ? 'You' : truncate_address(entry.walletAddress)}
                                  {is_current_user && ' 👤'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {format_date(entry.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-yellow-400">
                                {entry.score}
                              </div>
                              <div className="text-xs text-gray-400">points</div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-white/10">
                            <span>Levels: {entry.levelsCompleted}</span>
                            <span>
                              Max: {DIFFICULTIES[entry.highestDifficulty].emoji} {DIFFICULTIES[entry.highestDifficulty].name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push('/')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

