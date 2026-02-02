"use client";

import { useEffect, useState } from "react";
import { useStatsStore } from "@/stores/useStatsStore";
import { usePointsStore } from "@/stores/usePointsStore";
import { BalanceNetworkBadge } from "@/components/wallet/BalanceNetworkBadge";
import { AppShell, PageHeader, SectionCard } from "@/components/ui";
import { DIFFICULTIES, DIFFICULTY_ORDER, type DifficultyId } from "@/types/game";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, icon, subtitle, trend }: StatCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  // Determine trend indicator
  let trendIndicator = '•';
  if (trend === 'up') {
    trendIndicator = '↑';
  } else if (trend === 'down') {
    trendIndicator = '↓';
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white/5 to-white/10 border-white/10">
      <div className="flex items-start justify-between mb-2">
        <div className="text-3xl">{icon}</div>
        {trend && (
          <div className={`text-sm font-semibold ${trendColors[trend]}`}>
            {trendIndicator}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </Card>
  );
}

interface DifficultyStatRowProps {
  difficulty: DifficultyId;
}

function DifficultyStatRow({ difficulty }: DifficultyStatRowProps) {
  const getDifficultyStats = useStatsStore(state => state.getDifficultyStats);
  
  const stats = getDifficultyStats(difficulty);
  const config = DIFFICULTIES[difficulty];

  if (stats.gamesPlayed === 0) {
    return null;
  }

  // Determine win rate color
  let winRateColor = 'text-gray-400';
  if (stats.winRate >= 80) {
    winRateColor = 'text-green-400';
  } else if (stats.winRate >= 50) {
    winRateColor = 'text-yellow-400';
  }

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <h3 className="font-semibold text-lg">{config.name}</h3>
            <p className="text-xs text-gray-400">{stats.gamesPlayed} games played</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${winRateColor}`}>
            {stats.winRate.toFixed(1)}% win rate
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-blue-500/10 rounded p-2 border border-blue-500/20">
          <div className="text-gray-400 text-xs mb-1">Avg Moves</div>
          <div className="font-bold text-blue-400">{stats.averageMoves.toFixed(1)}</div>
        </div>
        <div className="bg-green-500/10 rounded p-2 border border-green-500/20">
          <div className="text-gray-400 text-xs mb-1">Best Moves</div>
          <div className="font-bold text-green-400">{stats.bestMoves || '-'}</div>
        </div>
        <div className="bg-purple-500/10 rounded p-2 border border-purple-500/20">
          <div className="text-gray-400 text-xs mb-1">Best Score</div>
          <div className="font-bold text-purple-400">{stats.bestScore || '-'}</div>
        </div>
        {stats.bestTime && (
          <div className="bg-orange-500/10 rounded p-2 border border-orange-500/20">
            <div className="text-gray-400 text-xs mb-1">Best Time</div>
            <div className="font-bold text-orange-400">{stats.bestTime.toFixed(1)}s</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MoveEfficiencyChartProps {
  difficulty?: DifficultyId;
}

function MoveEfficiencyChart({ difficulty }: MoveEfficiencyChartProps) {
  const getMoveEfficiencyData = useStatsStore(state => state.getMoveEfficiencyData);
  const data = getMoveEfficiencyData(difficulty);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No game data yet. Play some games to see your progress!</p>
      </div>
    );
  }

  const maxMoves = Math.max(...data.map(d => d.moves));
  const minMoves = Math.min(...data.map(d => d.moves));
  const range = maxMoves - minMoves || 1;

  return (
    <div className="space-y-4">
      {/* Simple bar chart */}
      <div className="h-48 flex items-end gap-1 justify-between">
        {data.slice(-20).map((point) => {
          const heightPercent = ((point.moves - minMoves) / range) * 100;
          return (
            <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-400 cursor-pointer relative group"
                style={{ height: `${Math.max(heightPercent, 5)}%` }}
                title={`${point.date}: ${point.moves} moves`}
              >
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {point.moves} moves
                  <br />
                  {point.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Average line indicator */}
      <div className="flex items-center justify-between text-sm text-gray-400 border-t border-white/10 pt-2">
        <div>
          <span className="text-blue-400 font-semibold">{data.at(-1)?.avgMoves.toFixed(1)}</span> avg moves
        </div>
        <div className="text-xs">
          Last {Math.min(data.length, 20)} games
        </div>
      </div>
    </div>
  );
}

function RecentGamesTable() {
  const getRecentGames = useStatsStore(state => state.getRecentGames);
  const games = getRecentGames(5);

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No games played yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-gray-400">
            <th className="text-left py-2 px-3">Difficulty</th>
            <th className="text-left py-2 px-3">Result</th>
            <th className="text-right py-2 px-3">Moves</th>
            <th className="text-right py-2 px-3">Score</th>
            <th className="text-right py-2 px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const config = DIFFICULTIES[game.difficulty];
            return (
              <tr key={game.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span>{config.emoji}</span>
                    <span>{config.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  {game.completed ? (
                    <span className="text-green-400 font-semibold">✓ Won</span>
                  ) : (
                    <span className="text-red-400 font-semibold">✗ Lost</span>
                  )}
                </td>
                <td className="text-right py-3 px-3 font-mono">{game.moves}</td>
                <td className="text-right py-3 px-3 font-mono text-yellow-400">{game.score}</td>
                <td className="text-right py-3 px-3 text-gray-400 text-xs">
                  {new Date(game.timestamp).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Format play time helper function
function format_play_time(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const getOverallStats = useStatsStore(state => state.getOverallStats);
  const getAchievementProgress = usePointsStore(state => state.getAchievementProgress);
  const { totalEarned } = usePointsStore();
  
  const overallStats = getOverallStats();
  const achievementProgress = getAchievementProgress();

  // Update achievement completion rate
  const statsWithAchievements = {
    ...overallStats,
    achievementCompletionRate: achievementProgress.total > 0 
      ? (achievementProgress.unlocked / achievementProgress.total) * 100 
      : 0
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <AppShell className="flex items-center justify-center">
        <div className="text-gray-400">Loading statistics...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-white">← Back to Home</Link>
          <BalanceNetworkBadge />
        </div>

        <PageHeader
          title="Personal Statistics"
          description="Track progress, analyze performance, and spot your improvements over time."
        />

        {statsWithAchievements.totalGamesPlayed === 0 ? (
          <SectionCard className="mx-auto max-w-md text-center">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-lg font-semibold text-white">Start Your Journey!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Play your first game to start tracking your statistics.
            </p>
            <Link
              href="/game"
              className="mt-4 inline-flex rounded-full bg-solv-gold px-5 py-2 text-sm font-semibold text-solv-navy"
            >
              Play Now
            </Link>
          </SectionCard>
        ) : (
          <div className="space-y-8">
            <SectionCard title="Overview">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon="🎮"
                  title="Total Games"
                  value={statsWithAchievements.totalGamesPlayed}
                  subtitle={`${statsWithAchievements.totalGamesWon} won`}
                  trend="neutral"
                />
                <StatCard
                  icon="🏆"
                  title="Win Rate"
                  value={`${statsWithAchievements.winRate.toFixed(1)}%`}
                  subtitle={(() => {
                    if (statsWithAchievements.winRate >= 70) return 'Excellent!';
                    if (statsWithAchievements.winRate >= 50) return 'Good!';
                    return 'Keep practicing!';
                  })()}
                  trend={(() => {
                    if (statsWithAchievements.winRate >= 70) return 'up';
                    if (statsWithAchievements.winRate >= 50) return 'neutral';
                    return 'down';
                  })()}
                />
                <StatCard
                  icon="⭐"
                  title="Achievements"
                  value={`${achievementProgress.unlocked}/${achievementProgress.total}`}
                  subtitle={`${statsWithAchievements.achievementCompletionRate.toFixed(1)}% complete`}
                  trend={
                    statsWithAchievements.achievementCompletionRate >= 70 
                      ? 'up' 
                      : 'neutral'
                  }
                />
                <StatCard
                  icon="💎"
                  title="Total Points"
                  value={totalEarned.toLocaleString()}
                  subtitle={
                    statsWithAchievements.favoriteDifficulty 
                      ? `Favorite: ${DIFFICULTIES[statsWithAchievements.favoriteDifficulty].name}` 
                      : undefined
                  }
                  trend="up"
                />
              </div>
              {statsWithAchievements.totalPlayTime > 0 && (
                <div className="mt-4">
                  <StatCard
                    icon="⏱️"
                    title="Total Play Time"
                    value={format_play_time(statsWithAchievements.totalPlayTime)}
                    subtitle="Time spent in Timer Mode"
                  />
                </div>
              )}
            </SectionCard>

            <SectionCard title="Performance by Difficulty">
              <div className="space-y-3">
                {DIFFICULTY_ORDER.map((difficulty) => (
                  <DifficultyStatRow key={difficulty} difficulty={difficulty} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Move Efficiency Over Time">
              <MoveEfficiencyChart />
            </SectionCard>

            <SectionCard title="Recent Games">
              <RecentGamesTable />
            </SectionCard>

            {achievementProgress.unlocked > 0 && (
              <SectionCard title="Achievement Progress">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  <Card className="p-4 bg-white/5 border-white/10 text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-xl font-bold">{achievementProgress.categories.moves}</div>
                    <div className="text-xs text-gray-400">Efficiency</div>
                  </Card>
                  <Card className="p-4 bg-white/5 border-white/10 text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-xl font-bold">{achievementProgress.categories.difficulty}</div>
                    <div className="text-xs text-gray-400">Mastery</div>
                  </Card>
                  <Card className="p-4 bg-white/5 border-white/10 text-center">
                    <div className="text-2xl mb-2">🎮</div>
                    <div className="text-xl font-bold">{achievementProgress.categories.milestone}</div>
                    <div className="text-xs text-gray-400">Milestones</div>
                  </Card>
                  <Card className="p-4 bg-white/5 border-white/10 text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-xl font-bold">{achievementProgress.categories.special}</div>
                    <div className="text-xs text-gray-400">Special</div>
                  </Card>
                  <Card className="p-4 bg-white/5 border-white/10 text-center">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="text-xl font-bold">{achievementProgress.categories.time_attack}</div>
                    <div className="text-xs text-gray-400">Time Attack</div>
                  </Card>
                </div>
              </SectionCard>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/game"
                className="rounded-full bg-solv-gold px-5 py-2 text-sm font-semibold text-solv-navy"
              >
                🎮 Play Game
              </Link>
              <Link
                href="/achievements"
                className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 hover:border-solv-gold/50"
              >
                🏆 View Achievements
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

