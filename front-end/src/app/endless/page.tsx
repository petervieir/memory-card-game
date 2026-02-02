"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEndlessModeStore } from '@/stores/useEndlessModeStore';
import { useWallet } from '@/contexts/WalletContext';
import { DIFFICULTIES, DIFFICULTY_ORDER } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell, PageHeader, SectionCard } from '@/components/ui';

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
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Endless Mode"
          description="Test your memory across all difficulties. Three mistakes ends the run."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionCard title="How to Play">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="font-semibold text-white">Start at Beginner</p>
                    <p>Begin your journey with the easiest difficulty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="font-semibold text-white">Auto-Advance</p>
                    <p>Complete a level to move to the next difficulty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="font-semibold text-white">3 Lives System</p>
                    <p>Each wrong match costs a life. Three mistakes ends the run.</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white text-center">Difficulty Progression</h3>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                  {DIFFICULTY_ORDER.map((diffId, index) => {
                    const diff = DIFFICULTIES[diffId];
                    return (
                      <div key={diffId} className="flex items-center gap-2">
                        <span className="text-lg">{diff.emoji}</span>
                        <span>{diff.name}</span>
                        {index < DIFFICULTY_ORDER.length - 1 && (
                          <span className="text-white/40">→</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            {personalBest && (
              <SectionCard title="Your Personal Best">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Score</span>
                    <span className="text-lg font-semibold text-solv-gold">{personalBest.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Levels Completed</span>
                    <span className="font-semibold text-white">{personalBest.levelsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Highest Difficulty</span>
                    <span className="font-semibold text-white">
                      {DIFFICULTIES[personalBest.highestDifficulty].emoji} {DIFFICULTIES[personalBest.highestDifficulty].name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {format_date(personalBest.timestamp)}
                  </div>
                </div>
              </SectionCard>
            )}

            <SectionCard>
              <div className="flex flex-col gap-4">
                {currentRun && is_endless_mode_active() ? (
                  <>
                    <Button
                      onClick={handle_continue_run}
                      disabled={!address}
                      className="w-full py-5 text-lg font-semibold bg-solv-gold text-solv-navy hover:bg-solv-gold/90"
                    >
                      ▶️ Continue Run
                    </Button>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-sm text-muted-foreground">
                      <p>You have an active run in progress.</p>
                      <div className="mt-2 flex flex-wrap justify-center gap-4">
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
                    className="w-full py-5 text-lg font-semibold bg-solv-gold text-solv-navy hover:bg-solv-gold/90"
                  >
                    🌊 Start Endless Mode
                  </Button>
                )}

                {!address && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center text-xs text-muted-foreground">
                    🔒 Connect your wallet to play Endless Mode
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Endless Champion Leaderboard" description="Top 10 highest scores">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-3">🎮</div>
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
                      className={`rounded-xl border p-4 ${
                        is_current_user
                          ? 'border-solv-gold/60 bg-white/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xl min-w-[2rem]">{rank_emoji}</span>
                          <div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {is_current_user ? 'You' : truncate_address(entry.walletAddress)}
                              {is_current_user && ' 👤'}
                            </div>
                            <div className="text-[10px] text-white/40">
                              {format_date(entry.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-solv-gold">
                            {entry.score}
                          </div>
                          <div className="text-[10px] text-muted-foreground">points</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground border-t border-white/10 pt-2">
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
          </SectionCard>
        </div>

        <div className="text-center">
          <Button
            onClick={() => router.push('/')}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-white/80 hover:border-solv-gold/50"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

