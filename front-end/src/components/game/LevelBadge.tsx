'use client';

import { useXPStore } from '@/stores/useXPStore';
import { PLAYER_TITLES } from '@/types/game';

export function LevelBadge() {
  const { level, currentTitle } = useXPStore();
  const title = PLAYER_TITLES[currentTitle.toUpperCase()] || PLAYER_TITLES.NOVICE;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg">
      <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-full">
        <span className="text-xs font-bold text-purple-600">LVL</span>
        <span className="text-sm font-bold text-purple-600">{level}</span>
      </div>
      <div className="flex flex-col">
        <span 
          className="text-sm font-bold"
          style={{ color: title.color }}
        >
          {title.name}
        </span>
      </div>
    </div>
  );
}

export function CompactLevelBadge() {
  const { level } = useXPStore();

  return (
    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-lg border-2 border-white">
      <div className="flex flex-col items-center -mt-1">
        <span className="text-[10px] font-bold text-white leading-none">LVL</span>
        <span className="text-lg font-bold text-white leading-none">{level}</span>
      </div>
    </div>
  );
}

