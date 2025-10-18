import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS, type GameCompletionData } from '@/types/game';
import { createJSONStorage } from '@/lib/storage';

interface WalletStats {
  points: number;
  totalEarned: number;
  gamesPlayed: number;
  unlockedAchievements: string[];
  timerModeGamesPlayed: number;
}

interface PointsState {
  points: number;
  totalEarned: number;
  gamesPlayed: number;
  timerModeGamesPlayed: number;
  walletAddress: string | null;
  walletStats: Record<string, WalletStats>;
  unlockedAchievements: string[];
  newlyUnlockedAchievements: string[];
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  resetPoints: () => void;
  incrementGamesPlayed: (isTimerMode?: boolean) => number;
  setWalletAddress: (address: string | null) => void;
  checkAndUnlockAchievements: (gameData: GameCompletionData) => string[];
  clearNewlyUnlockedAchievements: () => void;
  getAchievementProgress: () => { total: number; unlocked: number; categories: Record<string, number> };
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      totalEarned: 0,
      gamesPlayed: 0,
      timerModeGamesPlayed: 0,
      walletAddress: null,
      walletStats: {},
      unlockedAchievements: [],
      newlyUnlockedAchievements: [],
      
      addPoints: (amount: number) => {
        const { walletAddress } = get();
        
        if (!walletAddress) return;
        
        set((state) => {
          const newPoints = state.points + amount;
          const newTotalEarned = state.totalEarned + amount;
          
          return {
            points: newPoints,
            totalEarned: newTotalEarned,
            walletStats: {
              ...state.walletStats,
              [walletAddress]: {
                points: newPoints,
                totalEarned: newTotalEarned,
                gamesPlayed: state.gamesPlayed,
                unlockedAchievements: state.unlockedAchievements,
                timerModeGamesPlayed: state.timerModeGamesPlayed,
              }
            }
          };
        });
      },
      
      spendPoints: (amount: number) => {
        const { points, walletAddress } = get();
        if (points >= amount && walletAddress) {
          set((state) => {
            const newPoints = state.points - amount;
            return {
              points: newPoints,
              walletStats: {
                ...state.walletStats,
                [walletAddress]: {
                  ...state.walletStats[walletAddress],
                  points: newPoints,
                }
              }
            };
          });
          return true;
        }
        return false;
      },
      
      resetPoints: () => {
        const { walletAddress } = get();
        if (walletAddress) {
          set((state) => ({
            points: 0,
            totalEarned: 0,
            gamesPlayed: 0,
            timerModeGamesPlayed: 0,
            walletStats: {
              ...state.walletStats,
              [walletAddress]: {
                points: 0,
                totalEarned: 0,
                gamesPlayed: 0,
                unlockedAchievements: [],
                timerModeGamesPlayed: 0,
              }
            }
          }));
        }
      },
      
      incrementGamesPlayed: (isTimerMode = false) => {
        const { walletAddress } = get();
        
        if (!walletAddress) return 0;
        
        let newGamesPlayed = 0;
        set((state) => {
          newGamesPlayed = state.gamesPlayed + 1;
          const newTimerModeGamesPlayed = isTimerMode ? state.timerModeGamesPlayed + 1 : state.timerModeGamesPlayed;
          
          return {
            gamesPlayed: newGamesPlayed,
            timerModeGamesPlayed: newTimerModeGamesPlayed,
            walletStats: {
              ...state.walletStats,
              [walletAddress]: {
                ...state.walletStats[walletAddress],
                gamesPlayed: newGamesPlayed,
                timerModeGamesPlayed: newTimerModeGamesPlayed,
              }
            }
          };
        });
        return newGamesPlayed;
      },
      
      setWalletAddress: (address: string | null) => {
        const { walletAddress: currentAddress, walletStats } = get();
        
        // If disconnecting wallet, clear current stats but keep stored data
        if (!address) {
          set({ 
            walletAddress: null,
            points: 0,
            totalEarned: 0,
            gamesPlayed: 0,
            timerModeGamesPlayed: 0,
            unlockedAchievements: [],
            newlyUnlockedAchievements: []
          });
          return;
        }
        
        // If same wallet, do nothing
        if (currentAddress === address) {
          return;
        }
        
        // Load stats for this wallet or create new ones
        const stats = walletStats[address] || {
          points: 0,
          totalEarned: 0,
          gamesPlayed: 0,
          unlockedAchievements: [],
          timerModeGamesPlayed: 0,
        };
        
        set({ 
          walletAddress: address,
          points: stats.points,
          totalEarned: stats.totalEarned,
          gamesPlayed: stats.gamesPlayed,
          timerModeGamesPlayed: stats.timerModeGamesPlayed || 0,
          unlockedAchievements: stats.unlockedAchievements,
          newlyUnlockedAchievements: []
        });
      },

      checkAndUnlockAchievements: (gameData: GameCompletionData) => {
        const { walletAddress, unlockedAchievements, timerModeGamesPlayed } = get();
        if (!walletAddress) return [];

        const currentUnlocked = unlockedAchievements || [];
        const newlyUnlocked: string[] = [];
        
        // Check each achievement
        Object.values(ACHIEVEMENTS).forEach((achievement) => {
          const isAlreadyUnlocked = currentUnlocked.includes(achievement.id);
          
          // Special handling for CLOCK_BEATER achievement
          let conditionMet = false;
          if (achievement.id === 'clock_beater') {
            conditionMet = timerModeGamesPlayed >= 10;
          } else {
            conditionMet = achievement.condition(gameData);
          }
          
          if (!isAlreadyUnlocked && conditionMet) {
            newlyUnlocked.push(achievement.id);
          }
        });

        if (newlyUnlocked.length > 0) {
          set((state) => {
            const updatedUnlocked = [...(state.unlockedAchievements || []), ...newlyUnlocked];
            return {
              unlockedAchievements: updatedUnlocked,
              newlyUnlockedAchievements: newlyUnlocked,
              walletStats: {
                ...state.walletStats,
                [walletAddress]: {
                  ...(state.walletStats[walletAddress] || { points: state.points, totalEarned: state.totalEarned, gamesPlayed: state.gamesPlayed, unlockedAchievements: [], timerModeGamesPlayed: state.timerModeGamesPlayed }),
                  unlockedAchievements: updatedUnlocked,
                }
              }
            };
          });
        }

        return newlyUnlocked;
      },

      clearNewlyUnlockedAchievements: () => {
        set({ newlyUnlockedAchievements: [] });
      },

      getAchievementProgress: () => {
        const { unlockedAchievements } = get();
        const totalAchievements = Object.keys(ACHIEVEMENTS).length;
        const categories = { moves: 0, difficulty: 0, milestone: 0, special: 0, time_attack: 0 };
        
        // Handle case where unlockedAchievements is undefined (during hydration)
        const achievements = unlockedAchievements || [];
        
        achievements.forEach((id) => {
          const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === id);
          if (achievement && achievement.category in categories) {
            categories[achievement.category as keyof typeof categories]++;
          }
        });

        return {
          total: totalAchievements,
          unlocked: achievements.length,
          categories
        };
      },
    }),
    {
      name: 'memory-game-points',
      storage: createJSONStorage(),
    }
  )
);
