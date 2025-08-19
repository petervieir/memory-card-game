"use client";

import { usePointsStore } from "@/stores/usePointsStore";

export function PointsBadge() {
  const { points, totalEarned, gamesPlayed } = usePointsStore();
  
  return (
    <div className="inline-flex gap-3 items-center bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm">
      <span>🏆 Points: <span className="font-bold text-green-400">{points}</span></span>
      <span>• Total: {totalEarned}</span>
      <span>• Games: {gamesPlayed}</span>
    </div>
  );
}


