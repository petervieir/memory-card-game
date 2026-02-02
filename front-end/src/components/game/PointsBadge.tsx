"use client";

import { usePointsStore } from "@/stores/usePointsStore";

export function PointsBadge() {
  const { points, totalEarned, gamesPlayed } = usePointsStore();
  
  return (
    <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
      <span className="text-white">🏆 Points: <span className="font-semibold text-solv-gold">{points}</span></span>
      <span>• Total: {totalEarned}</span>
      <span>• Games: {gamesPlayed}</span>
    </div>
  );
}


