import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from '@/lib/storage';
import { 
  DailyChallenge, 
  DailyChallengeCompletion, 
  ChallengeStreak,
  ChallengeCondition,
  DifficultyId,
  DIFFICULTY_ORDER 
} from '@/types/game';

interface WalletChallengeData {
  completions: Record<string, DailyChallengeCompletion>;
  streak: ChallengeStreak;
  unlockedAchievements: string[];
}

interface DailyChallengeState {
  walletAddress: string | null;
  walletData: Record<string, WalletChallengeData>;
  currentChallenge: DailyChallenge | null;
  completions: Record<string, DailyChallengeCompletion>;
  streak: ChallengeStreak;
  unlockedAchievements: string[];
  
  // Actions
  setWalletAddress: (address: string | null) => void;
  generateDailyChallenge: () => DailyChallenge;
  getTodayChallenge: () => DailyChallenge;
  completeChallenge: (challengeId: string, moves: number, score: number, conditionMet: boolean) => string[];
  getChallengeCompletion: (challengeId: string) => DailyChallengeCompletion | null;
  isTodayChallengeCompleted: () => boolean;
  updateStreak: (challengeDate: string) => void;
  resetStreak: () => void;
}

const CHALLENGE_CONDITIONS: ChallengeCondition[] = [
  {
    type: 'max_moves',
    requirement: 20,
    description: 'Complete in 20 moves or fewer'
  },
  {
    type: 'max_moves',
    requirement: 30,
    description: 'Complete in 30 moves or fewer'
  },
  {
    type: 'timer',
    requirement: 60,
    description: 'Complete within 60 seconds'
  },
  {
    type: 'no_hints',
    requirement: 0,
    description: 'Complete without using hints'
  },
  {
    type: 'perfect_accuracy',
    requirement: 85,
    description: 'Maintain 85% accuracy or higher'
  },
  {
    type: 'combo_streak',
    requirement: 5,
    description: 'Achieve a 5-match combo streak'
  }
];

// Simple seeded random number generator for deterministic card layouts
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function get_today_date_string(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function date_to_seed(dateString: string): number {
  // Convert date string to a numeric seed
  const date = new Date(dateString);
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

const createInitialStreak = (): ChallengeStreak => ({
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  totalChallengesCompleted: 0
});

const createInitialWalletData = (): WalletChallengeData => ({
  completions: {},
  streak: createInitialStreak(),
  unlockedAchievements: []
});

export const useDailyChallengeStore = create<DailyChallengeState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      walletData: {},
      currentChallenge: null,
      completions: {},
      streak: createInitialStreak(),
      unlockedAchievements: [],

      setWalletAddress: (address: string | null) => {
        const { walletData } = get();
        
        // If disconnecting wallet, clear current data but keep stored data
        if (!address) {
          set({ 
            walletAddress: null,
            completions: {},
            streak: createInitialStreak(),
            unlockedAchievements: []
          });
          return;
        }
        
        // If same wallet, do nothing
        const currentAddress = get().walletAddress;
        if (currentAddress === address) {
          return;
        }
        
        // Load data for this wallet or create new
        const data = walletData[address] || createInitialWalletData();
        
        set({ 
          walletAddress: address,
          completions: data.completions,
          streak: data.streak,
          unlockedAchievements: data.unlockedAchievements
        });
      },

      generateDailyChallenge: () => {
        const dateString = get_today_date_string();
        const seed = date_to_seed(dateString);
        const rng = seededRandom(seed);
        
        // Select difficulty randomly
        const difficultyIndex = Math.floor(rng() * DIFFICULTY_ORDER.length);
        const difficulty = DIFFICULTY_ORDER[difficultyIndex] as DifficultyId;
        
        // Select a random condition
        const conditionIndex = Math.floor(rng() * CHALLENGE_CONDITIONS.length);
        const specialCondition = CHALLENGE_CONDITIONS[conditionIndex];
        
        // Calculate bonus points based on difficulty
        const baseBonusPoints = 500;
        const difficultyMultiplier = difficultyIndex + 1;
        const bonusPoints = baseBonusPoints * difficultyMultiplier;
        
        const challenge: DailyChallenge = {
          id: `challenge-${dateString}`,
          date: dateString,
          difficulty,
          specialCondition,
          bonusPoints,
          seed,
          description: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} - ${specialCondition.description}`
        };
        
        return challenge;
      },

      getTodayChallenge: () => {
        const { currentChallenge, generateDailyChallenge } = get();
        const todayDate = get_today_date_string();
        
        // If we have a current challenge and it's for today, return it
        if (currentChallenge && currentChallenge.date === todayDate) {
          return currentChallenge;
        }
        
        // Otherwise, generate a new challenge for today
        const newChallenge = generateDailyChallenge();
        set({ currentChallenge: newChallenge });
        return newChallenge;
      },

      completeChallenge: (challengeId: string, moves: number, score: number, conditionMet: boolean) => {
        const { walletAddress, completions } = get();
        if (!walletAddress) return [];
        
        const completion: DailyChallengeCompletion = {
          challengeId,
          completed: true,
          completedAt: new Date(),
          moves,
          score,
          conditionMet
        };
        
        const newCompletions = {
          ...completions,
          [challengeId]: completion
        };
        
        // Extract date from challengeId (format: 'challenge-YYYY-MM-DD')
        const challengeDate = challengeId.replace('challenge-', '');
        
        // Update streak
        get().updateStreak(challengeDate);
        
        // Check for achievements
        const newAchievements: string[] = [];
        const { streak: updatedStreak, unlockedAchievements } = get();
        
        // First challenge
        if (updatedStreak.totalChallengesCompleted === 1 && !unlockedAchievements.includes('daily_challenger')) {
          newAchievements.push('daily_challenger');
        }
        
        // Week warrior (7-day streak)
        if (updatedStreak.currentStreak === 7 && !unlockedAchievements.includes('week_warrior')) {
          newAchievements.push('week_warrior');
        }
        
        // Monthly master (30-day streak)
        if (updatedStreak.currentStreak === 30 && !unlockedAchievements.includes('monthly_master')) {
          newAchievements.push('monthly_master');
        }
        
        // Perfect challenge (met special condition)
        if (conditionMet && !unlockedAchievements.includes('perfect_challenge')) {
          newAchievements.push('perfect_challenge');
        }
        
        if (newAchievements.length > 0) {
          set((state) => {
            const updatedAchievements = [...state.unlockedAchievements, ...newAchievements];
            return {
              completions: newCompletions,
              unlockedAchievements: updatedAchievements,
              walletData: {
                ...state.walletData,
                [walletAddress]: {
                  completions: newCompletions,
                  streak: state.streak,
                  unlockedAchievements: updatedAchievements
                }
              }
            };
          });
        } else {
          set((state) => ({
            completions: newCompletions,
            walletData: {
              ...state.walletData,
              [walletAddress]: {
                completions: newCompletions,
                streak: state.streak,
                unlockedAchievements: state.unlockedAchievements
              }
            }
          }));
        }
        
        return newAchievements;
      },

      getChallengeCompletion: (challengeId: string) => {
        const { completions } = get();
        return completions[challengeId] || null;
      },

      isTodayChallengeCompleted: () => {
        const todayDate = get_today_date_string();
        const challengeId = `challenge-${todayDate}`;
        const completion = get().getChallengeCompletion(challengeId);
        return completion?.completed || false;
      },

      updateStreak: (challengeDate: string) => {
        const { walletAddress, streak } = get();
        if (!walletAddress) return;
        
        const lastDate = streak.lastCompletedDate;
        
        // First challenge ever
        if (!lastDate) {
          const newStreak = {
            currentStreak: 1,
            longestStreak: 1,
            lastCompletedDate: challengeDate,
            totalChallengesCompleted: 1
          };
          set((state) => ({
            streak: newStreak,
            walletData: {
              ...state.walletData,
              [walletAddress]: {
                ...state.walletData[walletAddress],
                streak: newStreak
              }
            }
          }));
          return;
        }
        
        let newStreak = { ...streak };
        
        // Calculate day difference
        const lastDateObj = new Date(lastDate);
        const currentDateObj = new Date(challengeDate);
        const dayDiff = Math.floor((currentDateObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day - increment streak
          newStreak.currentStreak += 1;
          newStreak.longestStreak = Math.max(newStreak.longestStreak, newStreak.currentStreak);
        } else if (dayDiff > 1) {
          // Streak broken - reset to 1
          newStreak.currentStreak = 1;
        }
        // If dayDiff === 0, it's the same day - don't change streak
        
        newStreak.lastCompletedDate = challengeDate;
        newStreak.totalChallengesCompleted += 1;
        
        set((state) => ({
          streak: newStreak,
          walletData: {
            ...state.walletData,
            [walletAddress]: {
              ...state.walletData[walletAddress],
              streak: newStreak
            }
          }
        }));
      },

      resetStreak: () => {
        const { walletAddress } = get();
        if (!walletAddress) return;
        
        const newStreak = createInitialStreak();
        set((state) => ({
          streak: newStreak,
          walletData: {
            ...state.walletData,
            [walletAddress]: {
              ...state.walletData[walletAddress],
              streak: newStreak
            }
          }
        }));
      }
    }),
    {
      name: 'memory-game-daily-challenges',
      storage: createJSONStorage(),
    }
  )
);

