import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from '@/lib/storage';
import type { DifficultyId } from '@/types/game';

// Individual game record
export interface GameRecord {
  id: string;
  timestamp: number;
  difficulty: DifficultyId;
  moves: number;
  score: number;
  hintsUsed: number;
  combo: number;
  timerMode: boolean;
  timeRemaining?: number;
  totalTime?: number;
  completed: boolean;
}

// Statistics per difficulty
export interface DifficultyStats {
  gamesPlayed: number;
  gamesWon: number;
  totalMoves: number;
  totalScore: number;
  bestMoves: number;
  bestScore: number;
  bestTime?: number; // For timer mode
  averageMoves: number;
  winRate: number;
}

// Overall statistics
export interface OverallStats {
  totalGamesPlayed: number;
  totalGamesWon: number;
  winRate: number;
  totalPlayTime: number; // In seconds
  favoriteDifficulty: DifficultyId | null;
  achievementCompletionRate: number;
}

interface StatsState {
  walletAddress: string | null;
  gameHistory: GameRecord[];
  walletGameHistory: Record<string, GameRecord[]>;
  
  // Actions
  setWalletAddress: (address: string | null) => void;
  addGameRecord: (record: Omit<GameRecord, 'id' | 'timestamp'>) => void;
  getOverallStats: () => OverallStats;
  getDifficultyStats: (difficulty: DifficultyId) => DifficultyStats;
  getAllDifficultyStats: () => Record<DifficultyId, DifficultyStats>;
  getRecentGames: (limit?: number) => GameRecord[];
  getMoveEfficiencyData: (difficulty?: DifficultyId) => Array<{ date: string; moves: number; avgMoves: number }>;
  getPlayTimeByDay: () => Array<{ date: string; minutes: number }>;
  clearHistory: () => void;
}

const calculateDifficultyStats = (games: GameRecord[], difficulty: DifficultyId): DifficultyStats => {
  const difficultyGames = games.filter(g => g.difficulty === difficulty);
  const wonGames = difficultyGames.filter(g => g.completed);
  
  if (difficultyGames.length === 0) {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalMoves: 0,
      totalScore: 0,
      bestMoves: 0,
      bestScore: 0,
      averageMoves: 0,
      winRate: 0,
    };
  }

  const totalMoves = wonGames.reduce((sum, g) => sum + g.moves, 0);
  const totalScore = wonGames.reduce((sum, g) => sum + g.score, 0);
  const timerGames = wonGames.filter(g => g.timerMode && g.timeRemaining !== undefined);
  
  return {
    gamesPlayed: difficultyGames.length,
    gamesWon: wonGames.length,
    totalMoves,
    totalScore,
    bestMoves: wonGames.length > 0 ? Math.min(...wonGames.map(g => g.moves)) : 0,
    bestScore: Math.max(...wonGames.map(g => g.score), 0),
    bestTime: timerGames.length > 0 
      ? Math.max(...timerGames.map(g => (g.totalTime || 0) - (g.timeRemaining || 0)))
      : undefined,
    averageMoves: wonGames.length > 0 ? totalMoves / wonGames.length : 0,
    winRate: (wonGames.length / difficultyGames.length) * 100,
  };
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      gameHistory: [],
      walletGameHistory: {},

      setWalletAddress: (address: string | null) => {
        const { walletGameHistory } = get();
        
        if (!address) {
          set({ 
            walletAddress: null,
            gameHistory: []
          });
          return;
        }
        
        const currentAddress = get().walletAddress;
        if (currentAddress === address) {
          return;
        }
        
        const history = walletGameHistory[address] || [];
        
        set({ 
          walletAddress: address,
          gameHistory: history,
        });
      },

      addGameRecord: (record: Omit<GameRecord, 'id' | 'timestamp'>) => {
        const { walletAddress, gameHistory } = get();
        
        if (!walletAddress) return;

        const newRecord: GameRecord = {
          ...record,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        const updatedHistory = [...gameHistory, newRecord];
        
        set((state) => ({
          gameHistory: updatedHistory,
          walletGameHistory: {
            ...state.walletGameHistory,
            [walletAddress]: updatedHistory,
          }
        }));
      },

      getOverallStats: () => {
        const { gameHistory } = get();
        
        if (gameHistory.length === 0) {
          return {
            totalGamesPlayed: 0,
            totalGamesWon: 0,
            winRate: 0,
            totalPlayTime: 0,
            favoriteDifficulty: null,
            achievementCompletionRate: 0,
          };
        }

        const wonGames = gameHistory.filter(g => g.completed);
        
        // Calculate total play time from timer mode games
        const totalPlayTime = gameHistory
          .filter(g => g.timerMode && g.totalTime && g.timeRemaining !== undefined)
          .reduce((sum, g) => sum + ((g.totalTime || 0) - (g.timeRemaining || 0)), 0);

        // Find favorite difficulty
        const difficultyCounts: Record<string, number> = {};
        for (const g of gameHistory) {
          difficultyCounts[g.difficulty] = (difficultyCounts[g.difficulty] || 0) + 1;
        }
        
        const favoriteDifficulty = Object.keys(difficultyCounts).length > 0
          ? Object.entries(difficultyCounts).sort((a, b) => b[1] - a[1])[0][0] as DifficultyId
          : null;

        return {
          totalGamesPlayed: gameHistory.length,
          totalGamesWon: wonGames.length,
          winRate: (wonGames.length / gameHistory.length) * 100,
          totalPlayTime,
          favoriteDifficulty,
          achievementCompletionRate: 0, // Will be populated from points store
        };
      },

      getDifficultyStats: (difficulty: DifficultyId) => {
        const { gameHistory } = get();
        return calculateDifficultyStats(gameHistory, difficulty);
      },

      getAllDifficultyStats: () => {
        const { gameHistory } = get();
        const difficulties: DifficultyId[] = ['beginner', 'easy', 'medium', 'hard', 'expert', 'master'];
        
        const stats: Record<DifficultyId, DifficultyStats> = {} as Record<DifficultyId, DifficultyStats>;
        for (const difficulty of difficulties) {
          stats[difficulty] = calculateDifficultyStats(gameHistory, difficulty);
        }
        
        return stats;
      },

      getRecentGames: (limit = 10) => {
        const { gameHistory } = get();
        return [...gameHistory]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
      },

      getMoveEfficiencyData: (difficulty?: DifficultyId) => {
        const { gameHistory } = get();
        
        let games = gameHistory.filter(g => g.completed);
        if (difficulty) {
          games = games.filter(g => g.difficulty === difficulty);
        }
        
        if (games.length === 0) return [];

        // Group by date
        const gamesByDate: Record<string, GameRecord[]> = {};
        for (const game of games) {
          const date = new Date(game.timestamp).toLocaleDateString();
          if (!gamesByDate[date]) {
            gamesByDate[date] = [];
          }
          gamesByDate[date].push(game);
        }

        // Calculate running average and return data points
        const dataPoints = Object.entries(gamesByDate)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .map(([date, dayGames]) => {
            const avgMoves = dayGames.reduce((sum, g) => sum + g.moves, 0) / dayGames.length;
            return {
              date,
              moves: Math.round(avgMoves * 10) / 10,
              avgMoves: Math.round(avgMoves * 10) / 10,
            };
          });

        // Calculate cumulative average
        let cumulativeMoves = 0;
        let cumulativeCount = 0;
        return dataPoints.map(point => {
          const dayGames = gamesByDate[point.date];
          cumulativeMoves += dayGames.reduce((sum, g) => sum + g.moves, 0);
          cumulativeCount += dayGames.length;
          return {
            ...point,
            avgMoves: Math.round((cumulativeMoves / cumulativeCount) * 10) / 10,
          };
        });
      },

      getPlayTimeByDay: () => {
        const { gameHistory } = get();
        
        const timerGames = gameHistory.filter(
          g => g.timerMode && g.totalTime && g.timeRemaining !== undefined
        );

        if (timerGames.length === 0) return [];

        // Group by date
        const timeByDate: Record<string, number> = {};
        for (const game of timerGames) {
          const date = new Date(game.timestamp).toLocaleDateString();
          const playTime = (game.totalTime || 0) - (game.timeRemaining || 0);
          timeByDate[date] = (timeByDate[date] || 0) + playTime;
        }

        return Object.entries(timeByDate)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .map(([date, seconds]) => ({
            date,
            minutes: Math.round((seconds / 60) * 10) / 10,
          }));
      },

      clearHistory: () => {
        const { walletAddress } = get();
        
        if (!walletAddress) return;
        
        set((state) => ({
          gameHistory: [],
          walletGameHistory: {
            ...state.walletGameHistory,
            [walletAddress]: [],
          }
        }));
      },
    }),
    {
      name: 'memory-game-stats',
      storage: createJSONStorage(),
    }
  )
);

