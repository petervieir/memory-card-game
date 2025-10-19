'use client';

import { useWallet } from '@/contexts/WalletContext';
import { useXPStore } from '@/stores/useXPStore';
import { usePointsStore } from '@/stores/usePointsStore';
import { LevelBadge } from '@/components/game/LevelBadge';
import { DetailedXPProgress } from '@/components/game/XPProgressBar';
import { PLAYER_TITLES, UNLOCKABLES, LEVEL_REWARDS } from '@/types/game';
import Link from 'next/link';

export default function ProfilePage() {
  const { address } = useWallet();
  const {
    level,
    currentTitle,
    unlockedItems,
    unlockedTitles,
    loginStreak,
    setActiveTitle,
    getXPHistoryByDay
  } = useXPStore();
  const { points, totalEarned, unlockedAchievements } = usePointsStore();
  
  const xpHistory = getXPHistoryByDay();
  const recentXPGains = xpHistory.slice(-7); // Last 7 days

  if (!address) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Wallet Required</h2>
          <p className="text-gray-300">Please connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  const currentTitleData = PLAYER_TITLES[currentTitle.toUpperCase()] || PLAYER_TITLES.NOVICE;
  const nextLevelReward = LEVEL_REWARDS[level + 1] || LEVEL_REWARDS[Math.ceil((level + 1) / 5) * 5];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors mb-4"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">Player Profile</h1>
        <p className="text-gray-400">Track your progress and unlocked rewards</p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 mb-6 border border-purple-500/30">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <LevelBadge />
          </div>
          
          <div className="flex-1 w-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ color: currentTitleData.color }}>
                {currentTitleData.name}
              </h2>
              <p className="text-sm text-gray-400">{currentTitleData.description}</p>
            </div>
            
            <DetailedXPProgress />
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">{points.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Current Points</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">{totalEarned.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Earned</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">{unlockedAchievements.length}</div>
                <div className="text-xs text-gray-400">Achievements</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-400">{loginStreak}</div>
                <div className="text-xs text-gray-400">Login Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Unlocked Titles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>👑</span>
            <span>Titles</span>
          </h3>
          
          <div className="space-y-3">
            {Object.values(PLAYER_TITLES)
              .filter(title => unlockedTitles.includes(title.id))
              .sort((a, b) => a.levelRequired - b.levelRequired)
              .map(title => (
                <button 
                  key={title.id}
                  className={`w-full p-3 rounded-lg cursor-pointer transition-all text-left ${
                    currentTitle === title.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveTitle(title.id)}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold" style={{ color: currentTitle === title.id ? 'white' : title.color }}>
                        {title.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        Level {title.levelRequired} • {title.description}
                      </div>
                    </div>
                    {currentTitle === title.id && (
                      <span className="text-xl">✓</span>
                    )}
                  </div>
                </button>
              ))}
            
            {/* Locked Titles */}
            {Object.values(PLAYER_TITLES)
              .filter(title => !unlockedTitles.includes(title.id))
              .sort((a, b) => a.levelRequired - b.levelRequired)
              .slice(0, 3)
              .map(title => (
                <div 
                  key={title.id}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-500">
                        🔒 {title.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        Unlock at Level {title.levelRequired}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Unlockables */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🎨</span>
            <span>Unlockables</span>
          </h3>
          
          <div className="space-y-3">
            {/* Borders */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Card Borders</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(UNLOCKABLES)
                  .filter(item => item.type === 'border')
                  .map(item => {
                    const isUnlocked = unlockedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg text-center ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{isUnlocked ? item.icon : '🔒'}</div>
                        <div className="text-xs font-semibold">{item.name}</div>
                        {!isUnlocked && (
                          <div className="text-[10px] text-gray-500">Lvl {item.levelRequired}</div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Card Backs */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Card Backs</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(UNLOCKABLES)
                  .filter(item => item.type === 'card_back')
                  .map(item => {
                    const isUnlocked = unlockedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg text-center ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{isUnlocked ? item.icon : '🔒'}</div>
                        <div className="text-xs font-semibold">{item.name}</div>
                        {!isUnlocked && (
                          <div className="text-[10px] text-gray-500">Lvl {item.levelRequired}</div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* XP History Chart */}
      {recentXPGains.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>XP History (Last 7 Days)</span>
          </h3>
          
          <div className="space-y-2">
            {recentXPGains.map((day) => {
              const maxXP = Math.max(...recentXPGains.map(d => d.xp));
              const width = (day.xp / maxXP) * 100;
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 w-24">{day.date}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-end pr-2"
                        style={{ width: `${width}%` }}
                      >
                        {width > 20 && (
                          <span className="text-xs font-bold text-white">{day.xp} XP</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {width <= 20 && (
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-400 w-16 text-right">
                      {day.xp} XP
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Reward Preview */}
      {nextLevelReward && (
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 shadow-lg mt-6 border border-yellow-500/30">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🎁</span>
            <span>Next Reward at Level {nextLevelReward.level}</span>
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {nextLevelReward.unlockables?.map(unlockableId => {
              const unlockable = UNLOCKABLES[unlockableId.toUpperCase()];
              if (!unlockable) return null;
              
              return (
                <div key={unlockableId} className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
                  <span className="text-2xl">{unlockable.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{unlockable.name}</div>
                    <div className="text-xs text-gray-400">{unlockable.description}</div>
                  </div>
                </div>
              );
            })}
            
            {nextLevelReward.title && (
              <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
                <span className="text-2xl">👑</span>
                <div>
                  <div className="font-semibold text-sm">
                    {PLAYER_TITLES[nextLevelReward.title.toUpperCase()]?.name}
                  </div>
                  <div className="text-xs text-gray-400">New Title</div>
                </div>
              </div>
            )}
            
            {nextLevelReward.specialReward && (
              <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
                <span className="text-2xl">✨</span>
                <div>
                  <div className="font-semibold text-sm">{nextLevelReward.specialReward}</div>
                  <div className="text-xs text-gray-400">Special Reward</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

