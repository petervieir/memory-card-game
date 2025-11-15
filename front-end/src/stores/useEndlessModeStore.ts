import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from '@/lib/storage';
import { DIFFICULTY_ORDER, type DifficultyId } from '@/types/game';

// Leaderboard entry
export interface EndlessLeaderboardEntry {
  id: string;
  walletAddress: string;
  score: number;
  levelsCompleted: number;
  highestDifficulty: DifficultyId;
  timestamp: number;
  displayName?: string;
}

// Current run state
export interface EndlessRunState {
  isActive: boolean;
  currentDifficultyIndex: number;
  livesRemaining: number;
  cumulativeScore: number;
  levelsCompleted: number;
  mistakesMade: number;
  startedAt: number;
}

interface EndlessModeState {
  walletAddress: string | null;
  currentRun: EndlessRunState | null;
  leaderboard: EndlessLeaderboardEntry[];
  walletLeaderboard: Record<string, EndlessLeaderboardEntry[]>;
  personalBest: EndlessLeaderboardEntry | null;
  walletPersonalBest: Record<string, EndlessLeaderboardEntry | null>;
  
  // Actions
  setWalletAddress: (address: string | null) => void;
  start_endless_mode: () => void;
  advance_to_next_level: (levelScore: number) => void;
  record_mistake: () => void;
  end_endless_mode: (final_score: number) => string[];
  get_current_difficulty: () => DifficultyId;
  is_endless_mode_active: () => boolean;
  get_leaderboard: (limit?: number) => EndlessLeaderboardEntry[];
  get_personal_best: () => EndlessLeaderboardEntry | null;
  reset_current_run: () => void;
  check_endless_achievements: (run: EndlessRunState, final_score: number) => string[];
}

const create_initial_run_state = (): EndlessRunState => ({
  isActive: true,
  currentDifficultyIndex: 0, // Start at beginner
  livesRemaining: 3,
  cumulativeScore: 0,
  levelsCompleted: 0,
  mistakesMade: 0,
  startedAt: Date.now(),
});

export const useEndlessModeStore = create<EndlessModeState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      currentRun: null,
      leaderboard: [],
      walletLeaderboard: {},
      personalBest: null,
      walletPersonalBest: {},

      setWalletAddress: (address: string | null) => {
        const { walletLeaderboard, walletPersonalBest } = get();
        
        if (!address) {
          set({ 
            walletAddress: null,
            currentRun: null,
            leaderboard: [],
            personalBest: null,
          });
          return;
        }
        
        const currentAddress = get().walletAddress;
        if (currentAddress === address) {
          return;
        }
        
        const leaderboard = walletLeaderboard[address] || [];
        const personalBest = walletPersonalBest[address] || null;
        
        set({ 
          walletAddress: address,
          leaderboard,
          personalBest,
          currentRun: null, // Reset run on wallet change
        });
      },

      start_endless_mode: () => {
        const { walletAddress } = get();
        if (!walletAddress) return;
        
        const newRun = create_initial_run_state();
        set({ currentRun: newRun });
      },

      advance_to_next_level: (levelScore: number) => {
        const { currentRun, walletAddress } = get();
        if (!currentRun || !currentRun.isActive || !walletAddress) return;

        const nextDifficultyIndex = Math.min(
          currentRun.currentDifficultyIndex + 1,
          DIFFICULTY_ORDER.length - 1
        );

        const updatedRun: EndlessRunState = {
          ...currentRun,
          currentDifficultyIndex: nextDifficultyIndex,
          cumulativeScore: currentRun.cumulativeScore + levelScore,
          levelsCompleted: currentRun.levelsCompleted + 1,
        };

        set({ currentRun: updatedRun });
      },

      record_mistake: () => {
        const { currentRun, walletAddress } = get();
        if (!currentRun || !currentRun.isActive || !walletAddress) return;

        const updatedRun: EndlessRunState = {
          ...currentRun,
          livesRemaining: Math.max(0, currentRun.livesRemaining - 1),
          mistakesMade: currentRun.mistakesMade + 1,
        };

        // Check if game over (no lives left)
        if (updatedRun.livesRemaining === 0) {
          updatedRun.isActive = false;
          set({ currentRun: updatedRun });
          // End the mode will be called separately
        } else {
          set({ currentRun: updatedRun });
        }
      },

      end_endless_mode: (final_score: number) => {
        const { currentRun, walletAddress, leaderboard, personalBest, check_endless_achievements } = get();
        if (!currentRun || !walletAddress) return [];

        // Check for achievements
        const newAchievements = check_endless_achievements(currentRun, final_score);

        // Create leaderboard entry
        const entry: EndlessLeaderboardEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          walletAddress,
          score: final_score,
          levelsCompleted: currentRun.levelsCompleted,
          highestDifficulty: DIFFICULTY_ORDER[currentRun.currentDifficultyIndex] as DifficultyId,
          timestamp: Date.now(),
        };

        // Update leaderboard (keep top 100)
        const updatedLeaderboard = [...leaderboard, entry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 100);

        // Update personal best if this is better
        const updatedPersonalBest = !personalBest || final_score > personalBest.score 
          ? entry 
          : personalBest;

        set((state) => ({
          currentRun: null,
          leaderboard: updatedLeaderboard,
          personalBest: updatedPersonalBest,
          walletLeaderboard: {
            ...state.walletLeaderboard,
            [walletAddress]: updatedLeaderboard,
          },
          walletPersonalBest: {
            ...state.walletPersonalBest,
            [walletAddress]: updatedPersonalBest,
          },
        }));

        return newAchievements;
      },

      get_current_difficulty: () => {
        const { currentRun } = get();
        if (!currentRun) return 'beginner';
        
        const difficultyIndex = Math.min(
          currentRun.currentDifficultyIndex,
          DIFFICULTY_ORDER.length - 1
        );
        return DIFFICULTY_ORDER[difficultyIndex] as DifficultyId;
      },

      is_endless_mode_active: () => {
        const { currentRun } = get();
        return currentRun?.isActive || false;
      },

      get_leaderboard: (limit = 10) => {
        const { leaderboard } = get();
        return leaderboard.slice(0, limit);
      },

      get_personal_best: () => {
        const { personalBest } = get();
        return personalBest;
      },

      reset_current_run: () => {
        set({ currentRun: null });
      },

      check_endless_achievements: (run: EndlessRunState, final_score: number) => {
        // This will be called by the points store to check endless achievements
        // Return list of achievement IDs that should be unlocked
        const achievements: string[] = [];

        // First endless run completion
        if (run.levelsCompleted >= 1) {
          achievements.push('endless_beginner');
        }

        // Reach level 3
        if (run.levelsCompleted >= 3) {
          achievements.push('endless_survivor');
        }

        // Reach level 5
        if (run.levelsCompleted >= 5) {
          achievements.push('endless_warrior');
        }

        // Complete all 6 difficulties
        if (run.levelsCompleted >= 6) {
          achievements.push('endless_champion');
        }

        // Score milestones
        if (final_score >= 1000) {
          achievements.push('endless_high_scorer');
        }

        if (final_score >= 2500) {
          achievements.push('endless_legend');
        }

        return achievements;
      },
    }),
    {
      name: 'memory-game-endless-mode',
      storage: createJSONStorage(),
    }
  )
);

