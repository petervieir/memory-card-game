import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DIFFICULTY_ORDER, type DifficultyId } from '@/types/game';
import { createJSONStorage } from '@/lib/storage';

interface DifficultyProgress {
  difficulty: DifficultyId;
  completed: boolean;
  bestScore: number;
  bestMoves: number;
  completedAt?: Date;
}

interface DifficultyState {
  progress: Record<DifficultyId, DifficultyProgress>;
  walletAddress: string | null;
  walletProgress: Record<string, Record<DifficultyId, DifficultyProgress>>;
  
  // Actions
  setWalletAddress: (address: string | null) => void;
  completeLevel: (difficulty: DifficultyId, score: number, moves: number) => void;
  isUnlocked: (difficulty: DifficultyId) => boolean;
  getUnlockedDifficulties: () => DifficultyId[];
  resetProgress: () => void;
  getBestScore: (difficulty: DifficultyId) => number;
  getBestMoves: (difficulty: DifficultyId) => number;
  hasCompletedLevel: (difficulty: DifficultyId) => boolean;
}

const createInitialProgress = (): Record<DifficultyId, DifficultyProgress> => {
  const progress = {} as Record<DifficultyId, DifficultyProgress>;
  
  DIFFICULTY_ORDER.forEach((difficulty) => {
    progress[difficulty] = {
      difficulty,
      completed: false,
      bestScore: 0,
      bestMoves: Infinity,
    };
  });
  
  return progress;
};

export const useDifficultyStore = create<DifficultyState>()(
  persist(
    (set, get) => ({
      progress: createInitialProgress(),
      walletAddress: null,
      walletProgress: {},

      setWalletAddress: (address: string | null) => {
        const { walletProgress } = get();
        
        // If disconnecting wallet, clear current progress but keep stored data
        if (!address) {
          set({ 
            walletAddress: null,
            progress: createInitialProgress()
          });
          return;
        }
        
        // If same wallet, do nothing
        const currentAddress = get().walletAddress;
        if (currentAddress === address) {
          return;
        }
        
        // Load progress for this wallet or create new
        const progress = walletProgress[address] || createInitialProgress();
        
        set({ 
          walletAddress: address,
          progress,
        });
      },

      completeLevel: (difficulty: DifficultyId, score: number, moves: number) => {
        const { walletAddress, progress } = get();
        
        if (!walletAddress) return;

        const currentProgress = progress[difficulty];
        
        const updatedProgress = {
          ...currentProgress,
          completed: true,
          bestScore: Math.max(score, currentProgress.bestScore),
          bestMoves: Math.min(moves, currentProgress.bestMoves),
          completedAt: !currentProgress.completed ? new Date() : currentProgress.completedAt,
        };

        const newProgress = {
          ...progress,
          [difficulty]: updatedProgress,
        };

        set((state) => ({
          progress: newProgress,
          walletProgress: {
            ...state.walletProgress,
            [walletAddress]: newProgress,
          }
        }));
      },

      isUnlocked: (difficulty: DifficultyId) => {
        const { progress } = get();
        
        // Beginner is always unlocked
        if (difficulty === 'beginner') return true;
        
        // Find the index of the current difficulty
        const currentIndex = DIFFICULTY_ORDER.indexOf(difficulty as any);
        if (currentIndex === -1) return false;
        
        // Check if the previous difficulty is completed
        const previousDifficulty = DIFFICULTY_ORDER[currentIndex - 1] as DifficultyId;
        return progress[previousDifficulty]?.completed || false;
      },

      getUnlockedDifficulties: () => {
        const { isUnlocked } = get();
        return DIFFICULTY_ORDER.filter(difficulty => isUnlocked(difficulty));
      },

      resetProgress: () => {
        const { walletAddress } = get();
        const newProgress = createInitialProgress();
        
        if (walletAddress) {
          set((state) => ({
            progress: newProgress,
            walletProgress: {
              ...state.walletProgress,
              [walletAddress]: newProgress,
            }
          }));
        }
      },

      getBestScore: (difficulty: DifficultyId) => {
        const { progress } = get();
        return progress[difficulty]?.bestScore || 0;
      },

      getBestMoves: (difficulty: DifficultyId) => {
        const { progress } = get();
        const moves = progress[difficulty]?.bestMoves;
        return moves === Infinity ? 0 : moves;
      },

      hasCompletedLevel: (difficulty: DifficultyId) => {
        const { progress } = get();
        return progress[difficulty]?.completed || false;
      },
    }),
    {
      name: 'memory-game-difficulty-progress',
      storage: createJSONStorage(),
    }
  )
);
