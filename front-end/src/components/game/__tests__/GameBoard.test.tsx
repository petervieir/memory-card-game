import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameBoard } from '../GameBoard';
import { usePointsStore } from '@/stores/usePointsStore';
import { useWallet } from '@/contexts/WalletContext';

// Mock the stores and contexts
jest.mock('@/stores/usePointsStore');
jest.mock('@/contexts/WalletContext');

// Mock fetch for image loading
global.fetch = jest.fn();

// Mock the Card component since we're testing GameBoard logic
jest.mock('../Card', () => ({
  Card: ({ imageSrc, isFlipped, isMatched, onClick }: any) => (
    <button
      type="button"
      data-testid="game-card"
      data-image={imageSrc}
      data-flipped={isFlipped}
      data-matched={isMatched}
      onClick={onClick}
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
    >
      {isFlipped || isMatched ? imageSrc : 'card-back'}
    </button>
  ),
}));

const mockUsePointsStore = usePointsStore as jest.MockedFunction<typeof usePointsStore>;
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

const mockAddPoints = jest.fn();
const mockIncrementGamesPlayed = jest.fn();

const mockImages = [
  '/images/01.jpg',
  '/images/02.jpg',
  '/images/03.jpg',
  '/images/04.jpg',
  '/images/05.jpg',
  '/images/06.jpg',
  '/images/07.jpg',
  '/images/08.jpg',
  '/images/09.jpg',
  '/images/10.jpg',
];

// Helper functions to reduce cognitive complexity
const findMatchingCards = (cards: HTMLElement[]): [HTMLElement, HTMLElement] | null => {
  for (let i = 0; i < cards.length - 1; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i].getAttribute('data-image') === cards[j].getAttribute('data-image')) {
        return [cards[i], cards[j]];
      }
    }
  }
  return null;
};

const findNonMatchingCards = (cards: HTMLElement[]): [HTMLElement, HTMLElement] | null => {
  for (let i = 0; i < cards.length - 1; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i].getAttribute('data-image') !== cards[j].getAttribute('data-image')) {
        return [cards[i], cards[j]];
      }
    }
  }
  return null;
};

const groupCardsByImage = (cards: HTMLElement[]): Record<string, HTMLElement[]> => {
  const imageGroups: Record<string, HTMLElement[]> = {};
  cards.forEach(card => {
    const imageSrc = card.getAttribute('data-image')!;
    if (!imageGroups[imageSrc]) imageGroups[imageSrc] = [];
    imageGroups[imageSrc].push(card);
  });
  return imageGroups;
};

const completeAllMatches = async (cards: HTMLElement[]) => {
  const imageGroups = groupCardsByImage(cards);
  
  for (const pair of Object.values(imageGroups)) {
    if (pair.length === 2) {
      fireEvent.click(pair[0]);
      fireEvent.click(pair[1]);
      
      await waitFor(() => {
        expect(pair[0].getAttribute('data-matched')).toBe('true');
        expect(pair[1].getAttribute('data-matched')).toBe('true');
      }, { timeout: 1500 });
    }
  }
};

const makeIncorrectMoves = async (cards: HTMLElement[], count: number) => {
  for (let i = 0; i < count; i++) {
    const nonMatchingCards = findNonMatchingCards(
      cards.filter(card => card.getAttribute('data-matched') === 'false')
    );

    if (nonMatchingCards) {
      fireEvent.click(nonMatchingCards[0]);
      fireEvent.click(nonMatchingCards[1]);
      
      // Wait for cards to flip back
      await waitFor(() => {
        expect(nonMatchingCards[0].getAttribute('data-flipped')).toBe('false');
        expect(nonMatchingCards[1].getAttribute('data-flipped')).toBe('false');
      }, { timeout: 1500 });
    }
  }
};

describe('GameBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful fetch for images
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockImages),
    });

    // Mock store functions
    mockUsePointsStore.mockReturnValue({
      points: 0,
      totalEarned: 0,
      gamesPlayed: 0,
      walletAddress: null,
      walletStats: {},
      addPoints: mockAddPoints,
      spendPoints: jest.fn(),
      resetPoints: jest.fn(),
      incrementGamesPlayed: mockIncrementGamesPlayed,
      setWalletAddress: jest.fn(),
    });
  });

  describe('Wallet Connection Requirements', () => {
    it('should show wallet required message when no wallet is connected', async () => {
      mockUseWallet.mockReturnValue({
        address: null,
        userSession: {} as any,
        refresh: jest.fn(),
      });

      render(<GameBoard />);

      // Wait for images to load first, then check wallet state
      await waitFor(() => {
        expect(screen.getByText('Wallet Required')).toBeInTheDocument();
        expect(screen.getByText(/Please connect your wallet to play/)).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });

      // Mock fetch to return a pending promise
      (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));

      render(<GameBoard />);

      expect(screen.getByText('Loading images...')).toBeInTheDocument();
    });
  });

  describe('Game Initialization', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });
    });

    it('should initialize game with 16 cards when wallet is connected', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });
    });

    it('should start with moves counter at 0', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        expect(screen.getByText('Moves: 0')).toBeInTheDocument();
      });
    });

    it('should create pairs of identical images', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        const imageCounts: Record<string, number> = {};
        
        cards.forEach(card => {
          const imageSrc = card.getAttribute('data-image');
          if (imageSrc) {
            imageCounts[imageSrc] = (imageCounts[imageSrc] || 0) + 1;
          }
        });

        // Each image should appear exactly twice
        Object.values(imageCounts).forEach(count => {
          expect(count).toBe(2);
        });
      });
    });

    it('should have a new game button', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        expect(screen.getByText('New Game')).toBeInTheDocument();
      });
    });
  });

  describe('Card Interaction', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });
    });

    it('should flip card when clicked', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const firstCard = screen.getAllByTestId('game-card')[0];
      expect(firstCard.getAttribute('data-flipped')).toBe('false');

      fireEvent.click(firstCard);

      expect(firstCard.getAttribute('data-flipped')).toBe('true');
    });

    it('should allow flipping up to 2 cards', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      
      // Click first card
      fireEvent.click(cards[0]);
      expect(cards[0].getAttribute('data-flipped')).toBe('true');
      
      // Click second card
      fireEvent.click(cards[1]);
      expect(cards[1].getAttribute('data-flipped')).toBe('true');
      
      // Try to click third card - should not flip
      fireEvent.click(cards[2]);
      expect(cards[2].getAttribute('data-flipped')).toBe('false');
    });

    it('should not allow card interaction when no wallet is connected', async () => {
      // First render with wallet connected to initialize
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });

      const { rerender } = render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      // Disconnect wallet
      mockUseWallet.mockReturnValue({
        address: null,
        userSession: {} as any,
        refresh: jest.fn(),
      });

      rerender(<GameBoard />);

      // Should show wallet required message
      expect(screen.getByText('Wallet Required')).toBeInTheDocument();
    });
  });

  describe('Match Detection and Move Counting', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });
    });

    it('should increment moves when 2 cards are flipped', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      
      // Click two cards
      fireEvent.click(cards[0]);
      fireEvent.click(cards[1]);

      // Wait for move counter to update
      await waitFor(() => {
        expect(screen.getByText('Moves: 1')).toBeInTheDocument();
      });
    });

    it('should mark cards as matched when they have the same image', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      const matchingCards = findMatchingCards(cards);

      expect(matchingCards).not.toBeNull();
      if (!matchingCards) return;

      const [card1, card2] = matchingCards;

      // Click the matching cards
      fireEvent.click(card1);
      fireEvent.click(card2);

      // Wait for cards to be marked as matched
      await waitFor(() => {
        expect(card1.getAttribute('data-matched')).toBe('true');
        expect(card2.getAttribute('data-matched')).toBe('true');
      }, { timeout: 1500 });
    });

    it('should flip cards back when they do not match', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      const nonMatchingCards = findNonMatchingCards(cards);

      expect(nonMatchingCards).not.toBeNull();
      if (!nonMatchingCards) return;

      const [card1, card2] = nonMatchingCards;

      // Click the non-matching cards
      fireEvent.click(card1);
      fireEvent.click(card2);

      // Initially flipped
      expect(card1.getAttribute('data-flipped')).toBe('true');
      expect(card2.getAttribute('data-flipped')).toBe('true');

      // Wait for cards to flip back
      await waitFor(() => {
        expect(card1.getAttribute('data-flipped')).toBe('false');
        expect(card2.getAttribute('data-flipped')).toBe('false');
        expect(card1.getAttribute('data-matched')).toBe('false');
        expect(card2.getAttribute('data-matched')).toBe('false');
      }, { timeout: 1500 });
    });
  });

  describe('Game Completion and Point Awarding', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });
    });

    it('should award base points (100) when game is completed', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      await completeAllMatches(cards);

      // Check that points were awarded and game completion message is shown
      await waitFor(() => {
        expect(mockAddPoints).toHaveBeenCalled();
        expect(mockIncrementGamesPlayed).toHaveBeenCalledTimes(1);
        expect(screen.getByText(/Congratulations!/)).toBeInTheDocument();
      }, { timeout: 5000 });
    }, 15000);

    it('should award efficiency bonus for fewer moves', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      await completeAllMatches(cards);

      await waitFor(() => {
        // For 8 moves: base 100 + (20-8)*5 = 100 + 60 = 160 points
        expect(mockAddPoints).toHaveBeenCalledWith(160);
      }, { timeout: 5000 });
    }, 15000);

    it('should not award negative efficiency bonus', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      
      // Make many incorrect moves first to increase move count
      await makeIncorrectMoves(cards, 10);

      // Now complete the game properly
      await completeAllMatches(cards);

      await waitFor(() => {
        // Should award at least base 100 points (no negative bonus)
        expect(mockAddPoints).toHaveBeenCalledWith(expect.any(Number));
        const pointsAwarded = mockAddPoints.mock.calls[mockAddPoints.mock.calls.length - 1][0];
        expect(pointsAwarded).toBeGreaterThanOrEqual(100);
      }, { timeout: 5000 });
    }, 20000);

    it('should show completion message with move count and points', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      await completeAllMatches(cards);

      await waitFor(() => {
        expect(screen.getByText(/Game completed in \d+ moves!/)).toBeInTheDocument();
        expect(screen.getByText(/Points earned: \d+/)).toBeInTheDocument();
      }, { timeout: 5000 });
    }, 15000);

    it('should prevent duplicate point awards on completion', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const cards = screen.getAllByTestId('game-card');
      await completeAllMatches(cards);

      // Wait for initial completion
      await waitFor(() => {
        expect(mockAddPoints).toHaveBeenCalledTimes(1);
        expect(mockIncrementGamesPlayed).toHaveBeenCalledTimes(1);
      }, { timeout: 5000 });

      // Force a re-render/state update that might trigger completion logic again
      // This simulates scenarios where useEffect might run multiple times
      const newGameButton = screen.getByText('New Game');
      fireEvent.click(newGameButton);
      
      // Wait for new game to initialize
      await waitFor(() => {
        expect(screen.getByText('Moves: 0')).toBeInTheDocument();
      });

      // Complete the new game
      const newCards = screen.getAllByTestId('game-card');
      await completeAllMatches(newCards);

      // Verify points were awarded for new game completion, but total calls are only 2
      await waitFor(() => {
        expect(mockAddPoints).toHaveBeenCalledTimes(2);
        expect(mockIncrementGamesPlayed).toHaveBeenCalledTimes(2);
      }, { timeout: 5000 });
    }, 20000);
  });

  describe('New Game Functionality', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });
    });

    it('should reset game state when new game button is clicked', async () => {
      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      // Make some moves
      const cards = screen.getAllByTestId('game-card');
      fireEvent.click(cards[0]);
      fireEvent.click(cards[1]);

      await waitFor(() => {
        expect(screen.getByText('Moves: 1')).toBeInTheDocument();
      });

      // Click new game
      const newGameButton = screen.getByText('New Game');
      fireEvent.click(newGameButton);

      // Game should reset
      await waitFor(() => {
        expect(screen.getByText('Moves: 0')).toBeInTheDocument();
        const resetCards = screen.getAllByTestId('game-card');
        resetCards.forEach(card => {
          expect(card.getAttribute('data-flipped')).toBe('false');
          expect(card.getAttribute('data-matched')).toBe('false');
        });
      });
    });
  });

  describe('Image Pool Management', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });
    });

    it('should initialize with pool size 8 on first game', async () => {
      render(<GameBoard />);

      // After game initialization, pool should be at 8
      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
        expect(screen.getByText('Pool: 8/32')).toBeInTheDocument();
      });
    });

    it('should grow pool progressively each new game until reaching 32', async () => {
      // Mock a larger image set for this test
      const largeImageSet = Array.from({ length: 50 }, (_, i) => `/images/${String(i + 1).padStart(2, '0')}.jpg`);
      (global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(largeImageSet),
      });

      render(<GameBoard />);

      // Wait for initial game (starts with 8)
      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
        expect(screen.getByText('Pool: 8/32')).toBeInTheDocument();
      });

      const newGameButton = screen.getByText('New Game');
      let previousPoolSize = 8;

      // Test multiple new games to verify pool growth
      for (let i = 0; i < 7; i++) { // Should reach 8 + (4 * 6) = 32
        fireEvent.click(newGameButton);

        await waitFor(() => {
          const poolText = screen.getByText(/Pool: \d+\/32/);
          const currentPoolSize = parseInt(poolText.textContent?.match(/Pool: (\d+)\/32/)?.[1] || '0');
          
          // Pool should grow or stay the same, but not shrink
          expect(currentPoolSize).toBeGreaterThanOrEqual(previousPoolSize);
          
          // Should eventually reach 32 or stop growing
          expect(currentPoolSize).toBeLessThanOrEqual(32);
          
          // Pool size logged for verification: ${currentPoolSize}
          previousPoolSize = currentPoolSize;
        });
      }

      // Final check - should be at 32
      await waitFor(() => {
        expect(screen.getByText('Pool: 32/32')).toBeInTheDocument();
      });
    });

    it('should maintain pool size at 32 and rotate images when full', async () => {
      // Mock a larger image set to test rotation
      const largeImageSet = Array.from({ length: 60 }, (_, i) => `/images/${String(i + 1).padStart(2, '0')}.jpg`);
      (global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(largeImageSet),
      });

      render(<GameBoard />);

      // Wait for initial load
      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const newGameButton = screen.getByText('New Game');

      // Click new game multiple times to fill the pool to 32
      for (let i = 0; i < 7; i++) { // 8 + (4 * 6) = 32
        fireEvent.click(newGameButton);
        await waitFor(() => {
          const cards = screen.getAllByTestId('game-card');
          expect(cards).toHaveLength(16);
        });
      }

      // Pool should be at 32
      await waitFor(() => {
        expect(screen.getByText('Pool: 32/32')).toBeInTheDocument();
      });

      // Next new game should maintain pool at 32 (rotation)
      fireEvent.click(newGameButton);

      await waitFor(() => {
        expect(screen.getByText('Pool: 32/32')).toBeInTheDocument();
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });
    });

    it('should handle pool rotation when all images have been seen', async () => {
      // Mock exactly 32 images (equal to pool size)
      const exactPoolImages = Array.from({ length: 32 }, (_, i) => `/images/${String(i + 1).padStart(2, '0')}.jpg`);
      (global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(exactPoolImages),
      });

      render(<GameBoard />);

      // Wait for initial load
      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      const newGameButton = screen.getByText('New Game');

      // Fill the pool to exactly 32 (all available images)
      for (let i = 0; i < 6; i++) { // 8 + (4 * 6) = 32
        fireEvent.click(newGameButton);
        await waitFor(() => {
          const cards = screen.getAllByTestId('game-card');
          expect(cards).toHaveLength(16);
        });
      }

      // Pool should be at 32
      await waitFor(() => {
        expect(screen.getByText('Pool: 32/32')).toBeInTheDocument();
      });

      // Next new game should still maintain pool at 32 (internal rotation)
      fireEvent.click(newGameButton);

      await waitFor(() => {
        expect(screen.getByText('Pool: 32/32')).toBeInTheDocument();
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });
    });
  });

  describe('API Error Handling', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        userSession: {} as any,
        refresh: jest.fn(),
      });
    });

    it('should use fallback images when API fails', async () => {
      // Mock console.error to suppress expected error output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<GameBoard />);

      await waitFor(() => {
        const cards = screen.getAllByTestId('game-card');
        expect(cards).toHaveLength(16);
      });

      // Should still have 16 cards even with API failure
      const cards = screen.getAllByTestId('game-card');
      expect(cards).toHaveLength(16);
      
      // Verify that error was logged (but suppressed from output)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load images:', expect.any(Error));
      
      // Restore console.error
      consoleSpy.mockRestore();
    });
  });
});
