"use client";

import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { PointsBadge } from "@/components/game/PointsBadge";
import { AchievementProgress } from "@/components/game/AchievementBadge";
import { LevelBadge } from "@/components/game/LevelBadge";
import { XPProgressBar } from "@/components/game/XPProgressBar";
import { AppShell, PageHeader, SectionCard } from "@/components/ui";
import { usePointsStore } from "@/stores/usePointsStore";
import Link from "next/link";

export default function Home() {
  const { totalEarned } = usePointsStore();

  return (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          title="Memory Card Game"
          description="Play a sleek memory card game. Connect your wallet to earn points and level up."
        />

        {(totalEarned > 0) && (
          <SectionCard className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                <LevelBadge />
              </div>
              <XPProgressBar showLabel={true} height="md" />
              <div className="flex justify-center">
                <PointsBadge />
              </div>
              <AchievementProgress showDetails={true} />
            </div>
          </SectionCard>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[
            {
              href: "/game",
              title: "Play Memory Game",
              description: "Match cards to earn points and XP.",
              icon: "🎮",
            },
            {
              href: "/endless",
              title: "Endless Mode",
              description: "Escalating difficulty with limited lives.",
              icon: "🌊",
              badge: "New",
            },
            {
              href: "/challenges",
              title: "Daily Challenges",
              description: "Unique conditions and bonus rewards.",
              icon: "📅",
            },
            {
              href: "/profile",
              title: "Player Profile",
              description: "Titles, unlockables, and milestones.",
              icon: "🎖️",
            },
            {
              href: "/stats",
              title: "Statistics",
              description: "Track performance and win rates.",
              icon: "📊",
            },
            {
              href: "/achievements",
              title: "Achievements",
              description: "Unlock trophies as you play.",
              icon: "🏆",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-solv-gold/40 hover:bg-white/10"
            >
              {card.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-solv-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-solv-navy">
                  {card.badge}
                </span>
              )}
              <div className="text-3xl">{card.icon}</div>
              <h3 className="mt-4 text-base font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            </Link>
          ))}
        </div>

        <SectionCard className="mx-auto max-w-xl text-center">
          <ConnectWallet />
        </SectionCard>
      </div>
    </AppShell>
  );
}
