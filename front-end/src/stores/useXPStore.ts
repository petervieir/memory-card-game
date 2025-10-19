import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from '@/lib/storage';
import { 
  calculate_xp_for_level, 
  XP_CONFIG, 
  LEVEL_REWARDS,
  UNLOCKABLES,
  type PlayerLevel, 
  type XPSource,
  type DifficultyId 
} from '@/types/game';

interface WalletXPData {
  totalXP: number;
  level: number;
  currentXP: number;
  unlockedItems: string[]; // IDs of unlocked cosmetics/borders/card backs
  currentTitle: string; // Current active title ID
  unlockedTitles: string[]; // IDs of unlocked titles
  lastLoginDate: string | null; // Format: 'YYYY-MM-DD'
  loginStreak: number;
  xpHistory: XPGain[];
}

interface XPGain {
  timestamp: number;
  source: XPSource;
  levelBefore: number;
  levelAfter: number;
}

interface LevelUpNotification {
  level: number;
  rewards: {
    unlockables: string[];
    title?: string;
    specialReward?: string;
  };
}

interface XPState {
  walletAddress: string | null;
  totalXP: number;
  level: number;
  currentXP: number; // XP progress in current level
  unlockedItems: string[];
  currentTitle: string;
  unlockedTitles: string[];
  lastLoginDate: string | null;
  loginStreak: number;
  xpHistory: XPGain[];
  walletXPData: Record<string, WalletXPData>;
  levelUpNotifications: LevelUpNotification[];
  
  // Actions
  setWalletAddress: (address: string | null) => void;
  addXP: (source: XPSource) => { leveledUp: boolean; newLevel: number; rewards?: LevelUpNotification['rewards'] };
  calculate_game_xp: (data: {
    difficulty: DifficultyId;
    isPerfectGame: boolean;
    combo: number;
  }) => number;
  check_daily_login: () => void;
  setActiveTitle: (titleId: string) => void;
  getPlayerLevel: () => PlayerLevel;
  getXPToNextLevel: () => number;
  getUnlockedItemsByType: (type: 'border' | 'card_back' | 'cosmetic' | 'title') => string[];
  canUseItem: (itemId: string) => boolean;
  clearLevelUpNotifications: () => void;
  getXPHistoryByDay: () => Array<{ date: string; xp: number }>;
}

export const useXPStore = create<XPState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      totalXP: 0,
      level: 1,
      currentXP: 0,
      unlockedItems: [],
      currentTitle: 'novice',
      unlockedTitles: ['novice'],
      lastLoginDate: null,
      loginStreak: 0,
      xpHistory: [],
      walletXPData: {},
      levelUpNotifications: [],

      setWalletAddress: (address: string | null) => {
        const { walletXPData } = get();
        
        if (!address) {
          set({
            walletAddress: null,
            totalXP: 0,
            level: 1,
            currentXP: 0,
            unlockedItems: [],
            currentTitle: 'novice',
            unlockedTitles: ['novice'],
            lastLoginDate: null,
            loginStreak: 0,
            xpHistory: [],
            levelUpNotifications: []
          });
          return;
        }

        const currentAddress = get().walletAddress;
        if (currentAddress === address) return;

        const data = walletXPData[address] || {
          totalXP: 0,
          level: 1,
          currentXP: 0,
          unlockedItems: [],
          currentTitle: 'novice',
          unlockedTitles: ['novice'],
          lastLoginDate: null,
          loginStreak: 0,
          xpHistory: []
        };

        set({
          walletAddress: address,
          totalXP: data.totalXP,
          level: data.level,
          currentXP: data.currentXP,
          unlockedItems: data.unlockedItems,
          currentTitle: data.currentTitle,
          unlockedTitles: data.unlockedTitles,
          lastLoginDate: data.lastLoginDate,
          loginStreak: data.loginStreak,
          xpHistory: data.xpHistory,
          levelUpNotifications: []
        });
      },

      addXP: (source: XPSource) => {
        const { walletAddress, totalXP, level, currentXP } = get();
        
        if (!walletAddress) {
          return { leveledUp: false, newLevel: level };
        }

        const newTotalXP = totalXP + source.amount;
        let newLevel = level;
        let newCurrentXP = currentXP + source.amount;
        let leveledUp = false;
        const newlyUnlockedItems: string[] = [];
        const newlyUnlockedTitles: string[] = [];
        let newTitle: string | undefined;
        let specialReward: string | undefined;
        const levelMilestones: number[] = [];

        // Check for level ups
        while (newCurrentXP >= calculate_xp_for_level(newLevel)) {
          newCurrentXP -= calculate_xp_for_level(newLevel);
          newLevel++;
          leveledUp = true;
          levelMilestones.push(newLevel);

          // Check for rewards at this level
          const reward = LEVEL_REWARDS[newLevel];
          if (reward) {
            if (reward.unlockables) {
              newlyUnlockedItems.push(...reward.unlockables);
            }
            if (reward.title) {
              newlyUnlockedTitles.push(reward.title);
              newTitle = reward.title;
            }
            if (reward.specialReward) {
              specialReward = reward.specialReward;
            }
          }
        }
        
        // Check for level milestone achievements
        if (leveledUp && globalThis.window !== undefined) {
          // Import dynamically to avoid circular dependency
          import('@/stores/usePointsStore').then(({ usePointsStore }) => {
            const pointsStore = usePointsStore.getState();
            const levelAchievementMap: Record<number, string> = {
              5: 'level_5',
              10: 'level_10',
              25: 'level_25',
              50: 'level_50',
              75: 'level_75',
              100: 'level_100'
            };
            
            for (const achievedLevel of levelMilestones) {
              const achievementId = levelAchievementMap[achievedLevel];
              if (achievementId && !pointsStore.unlockedAchievements.includes(achievementId)) {
                // Unlock the achievement
                pointsStore.checkAndUnlockAchievements({
                  moves: 0,
                  maxMovesForBonus: 0,
                  difficulty: 'beginner',
                  score: 0,
                  gamesPlayed: pointsStore.gamesPlayed,
                  isPerfectGame: false,
                  hintsUsed: 0,
                  highestCombo: 0,
                  timerMode: false
                });
              }
            }
          });
        }

        const xpGain: XPGain = {
          timestamp: Date.now(),
          source,
          levelBefore: level,
          levelAfter: newLevel
        };

        let levelUpNotification: LevelUpNotification | undefined;
        if (leveledUp) {
          levelUpNotification = {
            level: newLevel,
            rewards: {
              unlockables: newlyUnlockedItems,
              title: newTitle,
              specialReward
            }
          };
        }

        set((state) => {
          const updatedUnlockedItems = [...state.unlockedItems, ...newlyUnlockedItems];
          const updatedUnlockedTitles = [...state.unlockedTitles, ...newlyUnlockedTitles];
          const updatedXPHistory = [...state.xpHistory, xpGain];
          const updatedLevelUpNotifications = levelUpNotification 
            ? [...state.levelUpNotifications, levelUpNotification]
            : state.levelUpNotifications;

          return {
            totalXP: newTotalXP,
            level: newLevel,
            currentXP: newCurrentXP,
            unlockedItems: updatedUnlockedItems,
            unlockedTitles: updatedUnlockedTitles,
            xpHistory: updatedXPHistory,
            levelUpNotifications: updatedLevelUpNotifications,
            walletXPData: {
              ...state.walletXPData,
              [walletAddress]: {
                totalXP: newTotalXP,
                level: newLevel,
                currentXP: newCurrentXP,
                unlockedItems: updatedUnlockedItems,
                currentTitle: state.currentTitle,
                unlockedTitles: updatedUnlockedTitles,
                lastLoginDate: state.lastLoginDate,
                loginStreak: state.loginStreak,
                xpHistory: updatedXPHistory
              }
            }
          };
        });

        return {
          leveledUp,
          newLevel,
          rewards: levelUpNotification?.rewards
        };
      },

      calculate_game_xp: (data) => {
        let xp = XP_CONFIG.BASE_GAME_XP;
        
        // Apply difficulty multiplier
        xp *= XP_CONFIG.DIFFICULTY_MULTIPLIERS[data.difficulty];
        
        // Add perfect game bonus
        if (data.isPerfectGame) {
          xp += XP_CONFIG.PERFECT_GAME_BONUS;
        }
        
        // Add combo bonus (for combos above 5)
        if (data.combo > 5) {
          xp += (data.combo - 5) * XP_CONFIG.COMBO_XP_MULTIPLIER;
        }
        
        return Math.floor(xp);
      },

      check_daily_login: () => {
        const { walletAddress, lastLoginDate, loginStreak } = get();
        
        if (!walletAddress) return;

        const today = new Date().toISOString().split('T')[0];
        
        // Already logged in today
        if (lastLoginDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        let streakBonus = 0;

        // Check if continuing streak
        if (lastLoginDate === yesterdayStr) {
          newStreak = loginStreak + 1;
          
          // Bonus XP for maintaining streak
          if (newStreak >= 7) streakBonus = 25;
          if (newStreak >= 30) streakBonus = 50;
        }

        set((state) => ({
          lastLoginDate: today,
          loginStreak: newStreak,
          walletXPData: {
            ...state.walletXPData,
            [walletAddress]: {
              ...state.walletXPData[walletAddress],
              lastLoginDate: today,
              loginStreak: newStreak
            }
          }
        }));

        // Award daily login XP
        const xpSource: XPSource = {
          type: 'daily_login',
          amount: XP_CONFIG.DAILY_LOGIN_XP + streakBonus,
          description: newStreak > 1 
            ? `Daily Login (${newStreak} day streak!)`
            : 'Daily Login'
        };

        get().addXP(xpSource);
      },

      setActiveTitle: (titleId: string) => {
        const { walletAddress, unlockedTitles } = get();
        
        if (!walletAddress || !unlockedTitles.includes(titleId)) return;

        set((state) => ({
          currentTitle: titleId,
          walletXPData: {
            ...state.walletXPData,
            [walletAddress]: {
              ...state.walletXPData[walletAddress],
              currentTitle: titleId
            }
          }
        }));
      },

      getPlayerLevel: () => {
        const { level, currentXP, totalXP } = get();
        return {
          level,
          currentXP,
          xpToNextLevel: calculate_xp_for_level(level),
          totalXP
        };
      },

      getXPToNextLevel: () => {
        const { level } = get();
        return calculate_xp_for_level(level);
      },

      getUnlockedItemsByType: (type) => {
        const { unlockedItems } = get();
        const items = Object.values(UNLOCKABLES).filter(
          item => item.type === type && unlockedItems.includes(item.id)
        );
        return items.map(item => item.id);
      },

      canUseItem: (itemId: string) => {
        const { unlockedItems, level } = get();
        const item = Object.values(UNLOCKABLES).find(u => u.id === itemId);
        
        if (!item) return false;
        
        return level >= item.levelRequired && unlockedItems.includes(itemId);
      },

      clearLevelUpNotifications: () => {
        set({ levelUpNotifications: [] });
      },

      getXPHistoryByDay: () => {
        const { xpHistory } = get();
        
        const xpByDay: Record<string, number> = {};
        
        for (const gain of xpHistory) {
          const date = new Date(gain.timestamp).toLocaleDateString();
          xpByDay[date] = (xpByDay[date] || 0) + gain.source.amount;
        }

        return Object.entries(xpByDay)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .map(([date, xp]) => ({ date, xp }));
      }
    }),
    {
      name: 'memory-game-xp',
      storage: createJSONStorage()
    }
  )
);

