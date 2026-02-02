"use client";

import { GameBoard } from '@/components/game/GameBoard';
import { PointsBadge } from '@/components/game/PointsBadge';
import { BalanceNetworkBadge } from '@/components/wallet/BalanceNetworkBadge';
import { AudioSettings } from '@/components/game/AudioSettings';
import { AppShell, PageHeader, SectionCard } from '@/components/ui';
import { NftMintPanel } from '@/components/game/NftMintPanel';
import Link from 'next/link';

export default function GamePage() {
  // Points are displayed via PointsBadge component
  // const { points, totalEarned } = usePointsStore();

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white">← Back to Home</Link>
            <Link href="/challenges" className="hover:text-white">Daily Challenges</Link>
            <Link href="/stats" className="hover:text-white">Statistics</Link>
            <Link href="/achievements" className="hover:text-white">Achievements</Link>
            <Link href="/nfts" className="hover:text-white">My NFTs</Link>
          </div>
          <AudioSettings />
        </div>

        <div className="flex justify-center">
          <BalanceNetworkBadge />
        </div>

        <PageHeader
          title="Memory Card Game"
          description="Flip, memorize, and match trios. Finish fast for bonus points."
          actions={<PointsBadge />}
        />

        <SectionCard className="mx-auto max-w-2xl">
          <h2 className="text-lg font-semibold text-white">How to Play</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Choose a difficulty and start the timer if you want the challenge.</li>
            <li>Flip cards to reveal images.</li>
            <li>Match trios of identical images to clear the board.</li>
            <li>Fewer moves mean more bonus points.</li>
          </ul>
        </SectionCard>

        <GameBoard />

        <NftMintPanel />
      </div>
    </AppShell>
  );
}
