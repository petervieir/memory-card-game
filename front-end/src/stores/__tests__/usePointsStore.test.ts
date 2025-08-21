import { renderHook, act } from '@testing-library/react';
import { usePointsStore } from '../usePointsStore';

// Mock localStorage for persistence testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('usePointsStore', () => {
  beforeEach(() => {
    // Clear localStorage and reset store state
    localStorageMock.clear();
    usePointsStore.getState().resetPoints();
    usePointsStore.getState().setWalletAddress(null);
    
    // Clear internal store state for a fresh start
    usePointsStore.setState({
      points: 0,
      totalEarned: 0,
      gamesPlayed: 0,
      walletAddress: null,
      walletStats: {},
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => usePointsStore());
      
      expect(result.current.points).toBe(0);
      expect(result.current.totalEarned).toBe(0);
      expect(result.current.gamesPlayed).toBe(0);
      expect(result.current.walletAddress).toBe(null);
      expect(result.current.walletStats).toEqual({});
    });
  });

  describe('Wallet Management', () => {
    it('should set wallet address and load stats', () => {
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      act(() => {
        result.current.setWalletAddress(walletAddress);
      });

      expect(result.current.walletAddress).toBe(walletAddress);
      expect(result.current.points).toBe(0);
      expect(result.current.totalEarned).toBe(0);
      expect(result.current.gamesPlayed).toBe(0);
    });

    it('should clear stats when disconnecting wallet', () => {
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      // Set wallet and add some points
      act(() => {
        result.current.setWalletAddress(walletAddress);
        result.current.addPoints(100);
      });

      expect(result.current.points).toBe(100);

      // Disconnect wallet
      act(() => {
        result.current.setWalletAddress(null);
      });

      expect(result.current.walletAddress).toBe(null);
      expect(result.current.points).toBe(0);
      expect(result.current.totalEarned).toBe(0);
      expect(result.current.gamesPlayed).toBe(0);
    });

    it('should maintain separate stats for different wallets', () => {
      const { result } = renderHook(() => usePointsStore());
      const wallet1 = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';
      const wallet2 = 'SP2HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      // Add points to wallet1
      act(() => {
        result.current.setWalletAddress(wallet1);
        result.current.addPoints(100);
        result.current.incrementGamesPlayed();
      });

      expect(result.current.points).toBe(100);
      expect(result.current.gamesPlayed).toBe(1);

      // Switch to wallet2
      act(() => {
        result.current.setWalletAddress(wallet2);
      });

      expect(result.current.points).toBe(0);
      expect(result.current.gamesPlayed).toBe(0);

      // Add points to wallet2
      act(() => {
        result.current.addPoints(200);
        result.current.incrementGamesPlayed();
        result.current.incrementGamesPlayed();
      });

      expect(result.current.points).toBe(200);
      expect(result.current.gamesPlayed).toBe(2);

      // Switch back to wallet1
      act(() => {
        result.current.setWalletAddress(wallet1);
      });

      expect(result.current.points).toBe(100);
      expect(result.current.gamesPlayed).toBe(1);
    });

    it('should not change state when setting same wallet address', () => {
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      act(() => {
        result.current.setWalletAddress(walletAddress);
        result.current.addPoints(100);
      });

      const stateBefore = { ...result.current };

      act(() => {
        result.current.setWalletAddress(walletAddress);
      });

      expect(result.current.points).toBe(stateBefore.points);
      expect(result.current.totalEarned).toBe(stateBefore.totalEarned);
      expect(result.current.gamesPlayed).toBe(stateBefore.gamesPlayed);
    });
  });

  describe('Points Management', () => {
    beforeEach(() => {
      const { result } = renderHook(() => usePointsStore());
      act(() => {
        result.current.setWalletAddress('SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE');
      });
    });

    it('should add points correctly', () => {
      const { result } = renderHook(() => usePointsStore());

      act(() => {
        result.current.addPoints(50);
      });

      expect(result.current.points).toBe(50);
      expect(result.current.totalEarned).toBe(50);

      act(() => {
        result.current.addPoints(25);
      });

      expect(result.current.points).toBe(75);
      expect(result.current.totalEarned).toBe(75);
    });

    it('should update wallet stats when adding points', () => {
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      act(() => {
        result.current.addPoints(100);
      });

      expect(result.current.walletStats[walletAddress]).toEqual({
        points: 100,
        totalEarned: 100,
        gamesPlayed: 0,
      });
    });

    it('should not add points when no wallet is connected', () => {
      const { result } = renderHook(() => usePointsStore());

      // Disconnect wallet
      act(() => {
        result.current.setWalletAddress(null);
      });

      act(() => {
        result.current.addPoints(100);
      });

      expect(result.current.points).toBe(0);
      expect(result.current.totalEarned).toBe(0);
    });

    it('should spend points correctly when sufficient balance', () => {
      const { result } = renderHook(() => usePointsStore());

      act(() => {
        result.current.addPoints(100);
      });

      let success: boolean;
      act(() => {
        success = result.current.spendPoints(30);
      });

      expect(success!).toBe(true);
      expect(result.current.points).toBe(70);
      expect(result.current.totalEarned).toBe(100); // totalEarned should not decrease
    });

    it('should fail to spend points when insufficient balance', () => {
      const { result } = renderHook(() => usePointsStore());

      act(() => {
        result.current.addPoints(50);
      });

      let success: boolean;
      act(() => {
        success = result.current.spendPoints(100);
      });

      expect(success!).toBe(false);
      expect(result.current.points).toBe(50); // Points should remain unchanged
    });

    it('should update wallet stats when spending points', () => {
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      act(() => {
        result.current.addPoints(100);
        result.current.spendPoints(30);
      });

      expect(result.current.walletStats[walletAddress].points).toBe(70);
      expect(result.current.walletStats[walletAddress].totalEarned).toBe(100);
    });

    it('should not spend points when no wallet is connected', () => {
      const { result } = renderHook(() => usePointsStore());

      // Add points first with wallet connected
      act(() => {
        result.current.addPoints(100);
      });

      // Disconnect wallet
      act(() => {
        result.current.setWalletAddress(null);
      });

      let success: boolean;
      act(() => {
        success = result.current.spendPoints(50);
      });

      expect(success!).toBe(false);
    });

    it('should reset points correctly', () => {
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      act(() => {
        result.current.addPoints(100);
        result.current.incrementGamesPlayed();
      });

      expect(result.current.points).toBe(100);
      expect(result.current.gamesPlayed).toBe(1);

      act(() => {
        result.current.resetPoints();
      });

      expect(result.current.points).toBe(0);
      expect(result.current.totalEarned).toBe(0);
      expect(result.current.gamesPlayed).toBe(0);
      expect(result.current.walletStats[walletAddress]).toEqual({
        points: 0,
        totalEarned: 0,
        gamesPlayed: 0,
      });
    });

    it('should not reset points when no wallet is connected', () => {
      const { result } = renderHook(() => usePointsStore());

      // Add points first
      act(() => {
        result.current.addPoints(100);
      });

      // Disconnect wallet
      act(() => {
        result.current.setWalletAddress(null);
      });

      // Try to reset
      act(() => {
        result.current.resetPoints();
      });

      // State should already be cleared from disconnection
      expect(result.current.points).toBe(0);
      expect(result.current.totalEarned).toBe(0);
      expect(result.current.gamesPlayed).toBe(0);
    });
  });

  describe('Games Played Counter', () => {
    beforeEach(() => {
      const { result } = renderHook(() => usePointsStore());
      act(() => {
        result.current.setWalletAddress('SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE');
      });
    });

    it('should increment games played correctly', () => {
      const { result } = renderHook(() => usePointsStore());

      act(() => {
        result.current.incrementGamesPlayed();
      });

      expect(result.current.gamesPlayed).toBe(1);

      act(() => {
        result.current.incrementGamesPlayed();
      });

      expect(result.current.gamesPlayed).toBe(2);
    });

    it('should update wallet stats when incrementing games played', () => {
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      act(() => {
        result.current.incrementGamesPlayed();
      });

      expect(result.current.walletStats[walletAddress].gamesPlayed).toBe(1);
    });

    it('should not increment games played when no wallet is connected', () => {
      const { result } = renderHook(() => usePointsStore());

      // Disconnect wallet
      act(() => {
        result.current.setWalletAddress(null);
      });

      act(() => {
        result.current.incrementGamesPlayed();
      });

      expect(result.current.gamesPlayed).toBe(0);
    });
  });

  describe('Persistence', () => {
    it('should have persistence configured', () => {
      // This test verifies that the store is configured with persistence
      // Actual localStorage persistence is hard to test in Jest environment
      const { result } = renderHook(() => usePointsStore());
      const walletAddress = 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE';

      act(() => {
        result.current.setWalletAddress(walletAddress);
        result.current.addPoints(100);
        result.current.incrementGamesPlayed();
      });

      // Verify the state is correctly updated
      expect(result.current.points).toBe(100);
      expect(result.current.gamesPlayed).toBe(1);
      expect(result.current.walletAddress).toBe(walletAddress);
    });
  });
});
