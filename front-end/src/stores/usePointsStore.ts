import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletStats {
  points: number;
  totalEarned: number;
  gamesPlayed: number;
}

interface PointsState {
  points: number;
  totalEarned: number;
  gamesPlayed: number;
  walletAddress: string | null;
  walletStats: Record<string, WalletStats>;
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  resetPoints: () => void;
  incrementGamesPlayed: () => void;
  setWalletAddress: (address: string | null) => void;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      totalEarned: 0,
      gamesPlayed: 0,
      walletAddress: null,
      walletStats: {},
      
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
            walletStats: {
              ...state.walletStats,
              [walletAddress]: {
                points: 0,
                totalEarned: 0,
                gamesPlayed: 0,
              }
            }
          }));
        }
      },
      
      incrementGamesPlayed: () => {
        const { walletAddress } = get();
        
        if (!walletAddress) return;
        
        set((state) => {
          const newGamesPlayed = state.gamesPlayed + 1;
          
          return {
            gamesPlayed: newGamesPlayed,
            walletStats: {
              ...state.walletStats,
              [walletAddress]: {
                ...state.walletStats[walletAddress],
                gamesPlayed: newGamesPlayed,
              }
            }
          };
        });
      },
      
      setWalletAddress: (address: string | null) => {
        const { walletAddress: currentAddress, walletStats } = get();
        
        // If disconnecting wallet, clear current stats but keep stored data
        if (!address) {
          set({ 
            walletAddress: null,
            points: 0,
            totalEarned: 0,
            gamesPlayed: 0
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
        };
        
        set({ 
          walletAddress: address,
          points: stats.points,
          totalEarned: stats.totalEarned,
          gamesPlayed: stats.gamesPlayed,
        });
      },
    }),
    {
      name: 'memory-game-points',
    }
  )
);
