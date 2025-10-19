"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { PointsBadge } from "@/components/game/PointsBadge";
import { DailyChallengeCard } from "@/components/game/DailyChallengeCard";
import { StreakTracker } from "@/components/game/StreakTracker";
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
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-2xl">←</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Daily Challenges</h1>
              <p className="text-gray-400 mt-1">Complete challenges to earn bonus rewards and build streaks</p>
            </div>
          </div>
          <PointsBadge />
        </div>

        {/* Wallet Connection */}
        {!walletAddress && (
          <div className="mb-8 p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🔐</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Connect Your Wallet</h3>
                <p className="text-gray-300 mb-4">
                  Connect your wallet to participate in daily challenges and track your progress.
                </p>
                <ConnectWallet />
              </div>
            </div>
          </div>
        )}

        {walletAddress && (
          <div className="space-y-8">
            {/* Today's Challenge */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Today's Challenge</span>
              </h2>
              <DailyChallengeCard
                challenge={todayChallenge}
                completion={completion}
                onStartChallenge={handle_start_challenge}
              />
            </section>

            {/* Streak Tracker */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📈</span>
                <span>Your Progress</span>
              </h2>
              <StreakTracker streak={streak} />
            </section>

            {/* Info Section */}
            <section className="bg-gray-800/50 border-2 border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                <span>How It Works</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">📅</div>
                  <h3 className="font-semibold mb-1">Daily Challenges</h3>
                  <p className="text-sm text-gray-400">
                    A new challenge is generated every day with unique conditions and rewards.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">🔥</div>
                  <h3 className="font-semibold mb-1">Build Streaks</h3>
                  <p className="text-sm text-gray-400">
                    Complete challenges on consecutive days to build your streak and unlock achievements.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">✨</div>
                  <h3 className="font-semibold mb-1">Bonus Rewards</h3>
                  <p className="text-sm text-gray-400">
                    Meet the special condition to earn bonus points and unlock special achievements.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">🏆</div>
                  <h3 className="font-semibold mb-1">Unlock Achievements</h3>
                  <p className="text-sm text-gray-400">
                    Reach streak milestones (7 days, 30 days) to unlock exclusive achievements.
                  </p>
                </div>
              </div>
            </section>

            {/* Achievement Showcase */}
            <section className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎖️</span>
                <span>Challenge Achievements</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl mb-2">📅</div>
                  <div className="font-semibold text-sm text-white">Daily Challenger</div>
                  <div className="text-xs text-gray-400 mt-1">First challenge</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="font-semibold text-sm text-white">Week Warrior</div>
                  <div className="text-xs text-gray-400 mt-1">7-day streak</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl mb-2">👑</div>
                  <div className="font-semibold text-sm text-white">Monthly Master</div>
                  <div className="text-xs text-gray-400 mt-1">30-day streak</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="font-semibold text-sm text-white">Perfect Challenge</div>
                  <div className="text-xs text-gray-400 mt-1">Meet all conditions</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-4">
          <Link
            href="/game"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Play Regular Game
          </Link>
          <Link
            href="/achievements"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            View All Achievements
          </Link>
        </div>
      </div>
    </main>
  );
}

