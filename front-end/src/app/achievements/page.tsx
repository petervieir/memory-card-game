"use client";

import { AchievementGrid, AchievementProgress } from "@/components/game/AchievementBadge";
import { BalanceNetworkBadge } from "@/components/wallet/BalanceNetworkBadge";
import { AppShell, PageHeader, SectionCard } from "@/components/ui";
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
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-white">← Back to Home</Link>
          <BalanceNetworkBadge />
        </div>

        <PageHeader
          title="Achievements"
          description="Track your progress and unlock new milestones as you play."
        />

        <SectionCard className="mx-auto max-w-2xl">
          <AchievementProgress showDetails={true} />
        </SectionCard>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                activeCategory === category.id
                  ? "border-solv-gold bg-solv-gold text-solv-navy"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-solv-gold/40 hover:text-white"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {totalEarned > 0 ? (
          <SectionCard>
            <AchievementGrid category={activeCategory} showLocked={true} />
          </SectionCard>
        ) : (
          <SectionCard className="mx-auto max-w-md text-center">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold text-white">Start Playing to Unlock Achievements</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect your wallet and play the memory card game to begin earning achievements.
            </p>
            <Link
              href="/game"
              className="mt-4 inline-flex rounded-full bg-solv-gold px-4 py-2 text-sm font-semibold text-solv-navy"
            >
              Play Now
            </Link>
          </SectionCard>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/game"
            className="rounded-full bg-solv-gold px-5 py-2 text-sm font-semibold text-solv-navy"
          >
            🎮 Play Memory Game
          </Link>
          <Link
            href="/stats"
            className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 hover:border-solv-gold/50"
          >
            📊 View Statistics
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
