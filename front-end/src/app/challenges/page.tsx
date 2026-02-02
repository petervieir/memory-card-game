"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { PointsBadge } from "@/components/game/PointsBadge";
import { DailyChallengeCard } from "@/components/game/DailyChallengeCard";
import { StreakTracker } from "@/components/game/StreakTracker";
import { AppShell, PageHeader, SectionCard } from "@/components/ui";
import { useDailyChallengeStore } from '@/stores/useDailyChallengeStore';
import { usePointsStore } from '@/stores/usePointsStore';
import Link from "next/link";

export default function DailyChallengePage() {
  const router = useRouter();
  const { walletAddress } = usePointsStore();
  const { 
    getTodayChallenge, 
    getChallengeCompletion, 
    streak 
  } = useDailyChallengeStore();
  
  const [todayChallenge, setTodayChallenge] = useState(() => getTodayChallenge());
  const [completion, setCompletion] = useState(() => getChallengeCompletion(getTodayChallenge().id));

  useEffect(() => {
    const challenge = getTodayChallenge();
    setTodayChallenge(challenge);
    setCompletion(getChallengeCompletion(challenge.id));
  }, [getTodayChallenge, getChallengeCompletion]);

  const handle_start_challenge = () => {
    // Navigate to game page with daily challenge mode
    router.push(`/game?mode=daily-challenge&challengeId=${todayChallenge.id}`);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-white">← Back to Home</Link>
          <PointsBadge />
        </div>

        <PageHeader
          title="Daily Challenges"
          description="Complete new challenges every day to earn bonus rewards and build streaks."
        />

        {!walletAddress && (
          <SectionCard className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="text-3xl">🔐</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white">Connect Your Wallet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect your wallet to participate in daily challenges and track progress.
                </p>
                <div className="mt-3">
                  <ConnectWallet />
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {walletAddress && (
          <div className="space-y-6">
            <SectionCard title="Today's Challenge">
              <DailyChallengeCard
                challenge={todayChallenge}
                completion={completion}
                onStartChallenge={handle_start_challenge}
              />
            </SectionCard>

            <SectionCard title="Your Progress">
              <StreakTracker streak={streak} />
            </SectionCard>

            <SectionCard title="How It Works">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    icon: "📅",
                    title: "Daily Challenges",
                    text: "A new challenge is generated every day with unique conditions and rewards.",
                  },
                  {
                    icon: "🔥",
                    title: "Build Streaks",
                    text: "Complete challenges on consecutive days to build your streak.",
                  },
                  {
                    icon: "✨",
                    title: "Bonus Rewards",
                    text: "Meet the special condition to earn bonus points.",
                  },
                  {
                    icon: "🏆",
                    title: "Unlock Achievements",
                    text: "Reach streak milestones to unlock exclusive achievements.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl">{item.icon}</div>
                    <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Challenge Achievements">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { icon: "📅", title: "Daily Challenger", text: "First challenge" },
                  { icon: "🔥", title: "Week Warrior", text: "7-day streak" },
                  { icon: "👑", title: "Monthly Master", text: "30-day streak" },
                  { icon: "✨", title: "Perfect Challenge", text: "Meet all conditions" },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="mt-2 text-xs font-semibold text-white">{item.title}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{item.text}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/game"
            className="rounded-full bg-solv-gold px-5 py-2 text-sm font-semibold text-solv-navy"
          >
            Play Regular Game
          </Link>
          <Link
            href="/achievements"
            className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 hover:border-solv-gold/50"
          >
            View All Achievements
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

