'use client';

import { useWallet } from '@/contexts/WalletContext';
import { useXPStore } from '@/stores/useXPStore';
import { usePointsStore } from '@/stores/usePointsStore';
import { LevelBadge } from '@/components/game/LevelBadge';
import { DetailedXPProgress } from '@/components/game/XPProgressBar';
import { PLAYER_TITLES, UNLOCKABLES, LEVEL_REWARDS } from '@/types/game';
import { AppShell, PageHeader, SectionCard } from '@/components/ui';
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
      <AppShell>
        <SectionCard className="mx-auto max-w-md text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h2 className="text-lg font-semibold text-white mb-1">Wallet Required</h2>
          <p className="text-sm text-muted-foreground">
            Please connect your wallet to view your profile.
          </p>
        </SectionCard>
      </AppShell>
    );
  }

  const currentTitleData = PLAYER_TITLES[currentTitle.toUpperCase()] || PLAYER_TITLES.NOVICE;
  const nextLevelReward = LEVEL_REWARDS[level + 1] || LEVEL_REWARDS[Math.ceil((level + 1) / 5) * 5];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-white">← Back to Home</Link>
        </div>

        <PageHeader
          title="Player Profile"
          description="Track your progress and unlocked rewards."
          align="left"
        />

        <SectionCard>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <LevelBadge />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-2xl font-bold" style={{ color: currentTitleData.color }}>
                  {currentTitleData.name}
                </h2>
                <p className="text-sm text-muted-foreground">{currentTitleData.description}</p>
              </div>
              <DetailedXPProgress />
              <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-lg font-bold text-solv-gold">{points.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Current Points</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-lg font-bold text-white">{totalEarned.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Earned</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-lg font-bold text-white">{unlockedAchievements.length}</div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-lg font-bold text-white">{loginStreak}</div>
                  <div className="text-xs text-muted-foreground">Login Streak</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard title="Titles">
            <div className="space-y-3">
              {Object.values(PLAYER_TITLES)
                .filter(title => unlockedTitles.includes(title.id))
                .sort((a, b) => a.levelRequired - b.levelRequired)
                .map(title => (
                  <button 
                    key={title.id}
                    className={`w-full rounded-lg border border-white/10 p-3 text-left transition ${
                      currentTitle === title.id 
                        ? 'bg-white/10 text-white' 
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                    onClick={() => setActiveTitle(title.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold" style={{ color: currentTitle === title.id ? 'white' : title.color }}>
                          {title.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Level {title.levelRequired} • {title.description}
                        </div>
                      </div>
                      {currentTitle === title.id && (
                        <span className="text-lg text-solv-gold">✓</span>
                      )}
                    </div>
                  </button>
                ))}

              {Object.values(PLAYER_TITLES)
                .filter(title => !unlockedTitles.includes(title.id))
                .sort((a, b) => a.levelRequired - b.levelRequired)
                .slice(0, 3)
                .map(title => (
                  <div 
                    key={title.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 opacity-60"
                  >
                    <div className="font-semibold text-white/60">🔒 {title.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Unlock at Level {title.levelRequired}
                    </div>
                  </div>
                ))}
            </div>
          </SectionCard>

          <SectionCard title="Unlockables">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Card Borders</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(UNLOCKABLES)
                    .filter(item => item.type === 'border')
                    .map(item => {
                      const isUnlocked = unlockedItems.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-lg border border-white/10 p-3 text-center ${
                            isUnlocked ? 'bg-white/10' : 'bg-white/5 opacity-60'
                          }`}
                        >
                          <div className="text-2xl mb-1">{isUnlocked ? item.icon : '🔒'}</div>
                          <div className="text-xs font-semibold text-white">{item.name}</div>
                          {!isUnlocked && (
                            <div className="text-[10px] text-muted-foreground">Lvl {item.levelRequired}</div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Card Backs</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(UNLOCKABLES)
                    .filter(item => item.type === 'card_back')
                    .map(item => {
                      const isUnlocked = unlockedItems.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-lg border border-white/10 p-3 text-center ${
                            isUnlocked ? 'bg-white/10' : 'bg-white/5 opacity-60'
                          }`}
                        >
                          <div className="text-2xl mb-1">{isUnlocked ? item.icon : '🔒'}</div>
                          <div className="text-xs font-semibold text-white">{item.name}</div>
                          {!isUnlocked && (
                            <div className="text-[10px] text-muted-foreground">Lvl {item.levelRequired}</div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {recentXPGains.length > 0 && (
          <SectionCard title="XP History (Last 7 Days)">
            <div className="space-y-2">
              {recentXPGains.map((day) => {
                const maxXP = Math.max(...recentXPGains.map(d => d.xp));
                const width = (day.xp / maxXP) * 100;

                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground w-24">{day.date}</div>
                    <div className="flex-1">
                      <div className="h-8 rounded-lg bg-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-solv-gold/70 flex items-center justify-end pr-2 text-solv-navy"
                          style={{ width: `${width}%` }}
                        >
                          {width > 20 && (
                            <span className="text-xs font-semibold">{day.xp} XP</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {width <= 20 && (
                      <div className="text-xs font-semibold text-white/70 w-16 text-right">
                        {day.xp} XP
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {nextLevelReward && (
          <SectionCard title={`Next Reward at Level ${nextLevelReward.level}`}>
            <div className="flex flex-wrap gap-3">
              {nextLevelReward.unlockables?.map(unlockableId => {
                const unlockable = UNLOCKABLES[unlockableId.toUpperCase()];
                if (!unlockable) return null;

                return (
                  <div key={unlockableId} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                    <span className="text-2xl">{unlockable.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-white">{unlockable.name}</div>
                      <div className="text-xs text-muted-foreground">{unlockable.description}</div>
                    </div>
                  </div>
                );
              })}

              {nextLevelReward.title && (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {PLAYER_TITLES[nextLevelReward.title.toUpperCase()]?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">New Title</div>
                  </div>
                </div>
              )}

              {nextLevelReward.specialReward && (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="font-semibold text-sm text-white">{nextLevelReward.specialReward}</div>
                    <div className="text-xs text-muted-foreground">Special Reward</div>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        )}
      </div>
    </AppShell>
  );
}

