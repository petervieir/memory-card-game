"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from './Card';
import { DifficultySelector } from './DifficultySelector';
import { usePointsStore } from '@/stores/usePointsStore';
import { useDifficultyStore } from '@/stores/useDifficultyStore';
import { useAudioStore } from '@/stores/useAudioStore';
import { useSoundEffects, useBackgroundMusic } from '@/hooks/useSoundEffects';
import { submitScore } from '@/lib/tx';
import toast from 'react-hot-toast';
import { useWallet } from '@/contexts/WalletContext';
import { useCardSize } from '@/hooks/useCardSize';
import { DIFFICULTIES, DIFFICULTY_ORDER, type DifficultyId, type GameCompletionData } from '@/types/game';
import { AchievementNotification } from './AchievementBadge';


// Image pool management
const IMAGE_POOL_SIZE = 32;
const loadedImages: Record<string, HTMLImageElement> = {};

function loadImage(src: string) {
  if (!loadedImages[src]) {
    const img = new Image();
    img.src = src;
    loadedImages[src] = img;
  }
}

function unloadImage(src: string) {
  if (loadedImages[src]) {
    loadedImages[src].src = '';
    delete loadedImages[src];
  }
}

// Hook to dynamically load images with pool management
function useImages() {
  const [images, setImages] = useState<string[]>([]);
  const [imagePool, setImagePool] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/images');
        const imageList = await response.json();
        setImages(imageList);
      } catch (error) {
        console.error('Failed to load images:', error);
        // Fallback to known images if API fails
        setImages([
          '/images/01.jpg', '/images/02.jpg', '/images/03.jpg', '/images/04.jpg',
          '/images/05.jpg', '/images/06.jpg', '/images/07.png', '/images/08.jpg',
          '/images/09.png', '/images/10.jpg', '/images/11.jpg', '/images/12.jpg',
          '/images/13.jpg', '/images/14.jpg', '/images/15.jpg', '/images/16.jpg',
          '/images/17.jpg', '/images/18.jpg', '/images/19.jpg', '/images/20.jpg',
          '/images/21.jpg', '/images/22.jpg', '/images/23.jpg', '/images/24.jpg',
          '/images/25.jpg', '/images/26.jpg', '/images/27.jpg', '/images/28.jpg',
          '/images/29.jpg', '/images/30.jpg', '/images/31.jpg', '/images/32.jpg',
          '/images/33.jpg', '/images/34.jpg', '/images/35.jpg', '/images/36.jpg',
          '/images/37.jpg', '/images/38.jpg', '/images/39.jpg', '/images/40.jpg',
          '/images/41.jpg', '/images/42.jpg', '/images/43.jpg', '/images/44.jpg',
          '/images/45.jpg', '/images/46.jpg', '/images/47.jpg', '/images/48.jpg',
          '/images/49.jpg', '/images/50.jpg', '/images/51.jpg', '/images/52.jpg',
          '/images/53.jpg', '/images/54.jpg', '/images/55.jpg', '/images/56.jpg'
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const selectImagesFromPool = useCallback((count: number): string[] => {
    // Start with the current pool
    let pool = imagePool;
    const availableNewImages = images.filter((src) => !pool.includes(src));

    // Determine how many to add/rotate this game
    // - If pool has fewer than count, add enough to reach count
    // - Else always rotate by up to 4: add new images if available, otherwise rotate existing
    let growBy = 0;
    if (pool.length < count) {
      growBy = Math.min(count - pool.length, availableNewImages.length);
    } else {
      growBy = availableNewImages.length > 0 ? Math.min(4, availableNewImages.length) : 4;
    }

    if (growBy > 0) {
      let updated = pool;

      if (availableNewImages.length > 0) {
        const newImages = getRandomImages(availableNewImages, Math.min(growBy, availableNewImages.length));
        newImages.forEach(loadImage);
        updated = [...pool, ...newImages];

        if (updated.length > IMAGE_POOL_SIZE) {
          const excess = updated.length - IMAGE_POOL_SIZE;
          const imagesToRemove = updated.slice(0, excess);
          imagesToRemove.forEach(unloadImage);
          updated = updated.slice(excess);
        }
      } else if (pool.length > 0) {
        // No new images available: rotate existing pool for variety
        const rotateBy = Math.min(growBy, pool.length);
        updated = [...pool.slice(rotateBy), ...pool.slice(0, rotateBy)];
      }

      pool = updated;
      setImagePool(pool);
    }

    const selectionSource = pool.length >= count ? pool : images;
    return getRandomImages(selectionSource, Math.min(count, selectionSource.length));
  }, [imagePool, images]);

  return { images, loading, selectImagesFromPool, imagePool };
}

function getRandomImages(images: string[], count: number): string[] {
  const shuffled = [...images].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface GameCard {
  id: number;
  imageSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function GameBoard() {
  const hasAwardedRef = useRef(false);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('beginner');
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [showAchievementNotification, setShowAchievementNotification] = useState<string | null>(null);
  const { addPoints, incrementGamesPlayed, checkAndUnlockAchievements, setWalletAddress: setPointsWalletAddress } = usePointsStore();
  const { images, loading, selectImagesFromPool, imagePool } = useImages();
  const { address } = useWallet();
  const { 
    setWalletAddress, 
    completeLevel, 
    isUnlocked: isDifficultyUnlocked, 
    getUnlockedDifficulties 
  } = useDifficultyStore();
  
  // Audio hooks
  const { soundEffectsEnabled, soundEffectsVolume, musicEnabled, musicVolume } = useAudioStore();
  const { play_sound } = useSoundEffects({ 
    enabled: soundEffectsEnabled, 
    masterVolume: soundEffectsVolume 
  });
  const { fade_in, fade_out } = useBackgroundMusic({ 
    enabled: musicEnabled, 
    masterVolume: musicVolume 
  });
  
  const currentDifficulty = DIFFICULTIES[selectedDifficulty];
  const cardSize = useCardSize(currentDifficulty);

  const initializeGame = useCallback(() => {
    if (images.length === 0 || !address) return;
    hasAwardedRef.current = false;
    
    // Get images based on selected difficulty
    const selectedImages = selectImagesFromPool(currentDifficulty.pairs);
    
    // Create pairs and shuffle
    const gameCards: GameCard[] = [];
    selectedImages.forEach((imageSrc, index) => {
      gameCards.push(
        { id: index * 2, imageSrc, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, imageSrc, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setIsGameComplete(false);
    setShowDifficultySelector(false);
  }, [images, address, selectImagesFromPool, currentDifficulty.pairs]);

  // Initialize game when images are loaded and wallet is connected
  useEffect(() => {
    if (!loading && images.length > 0 && address && !showDifficultySelector) {
      initializeGame();
    }
    // We intentionally exclude initializeGame to avoid re-running when pool grows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, images, address, showDifficultySelector]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length !== 2) return;
    
    const [first, second] = flippedCards;
    const firstCard = cards.find(card => card.id === first);
    const secondCard = cards.find(card => card.id === second);
    const isMatch = firstCard?.imageSrc === secondCard?.imageSrc;

    // Play match/mismatch sound
    setTimeout(() => {
      if (isMatch) {
        play_sound('card_match');
      } else {
        play_sound('card_mismatch');
      }
    }, 400);

    const markAsMatched = (prev: GameCard[]) => prev.map(card => 
      card.id === first || card.id === second 
        ? { ...card, isMatched: true, isFlipped: false }
        : card
    );
    
    const flipBack = (prev: GameCard[]) => prev.map(card => 
      card.id === first || card.id === second 
        ? { ...card, isFlipped: false }
        : card
    );

    const updateCards = () => {
      setCards(isMatch ? markAsMatched : flipBack);
      setFlippedCards([]);
    };

    setTimeout(updateCards, 1000);
    setMoves(prev => prev + 1);
  }, [flippedCards, cards, play_sound]); // Added play_sound dependency

  // Handle wallet connection/disconnection
  useEffect(() => {
    setWalletAddress(address);
    setPointsWalletAddress(address);
    
    if (!address) {
      setCards([]);
      setFlippedCards([]);
      setMoves(0);
      setIsGameComplete(false);
      setShowDifficultySelector(true);
    }
  }, [address, setWalletAddress, setPointsWalletAddress]);

  // Check if game is complete
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && address && !hasAwardedRef.current) {
      hasAwardedRef.current = true;
      const basePoints = currentDifficulty.basePoints;
      const efficiency_bonus = Math.max(0, currentDifficulty.maxMovesForBonus - moves) * 5;
      const rawScore = basePoints + efficiency_bonus;
      const finalScore = Math.round(rawScore * currentDifficulty.multiplier);

      // Update stores first
      addPoints(finalScore);
      const newGamesPlayed = incrementGamesPlayed();
      completeLevel(selectedDifficulty, finalScore, moves);

      // Prepare achievement data AFTER updating stores
      const gameData: GameCompletionData = {
        moves,
        maxMovesForBonus: currentDifficulty.maxMovesForBonus,
        difficulty: selectedDifficulty,
        score: finalScore,
        gamesPlayed: newGamesPlayed, // Use the actual updated value
        isPerfectGame: moves <= currentDifficulty.maxMovesForBonus
      };

      // Check for achievements AFTER updating stores
      const newAchievements = checkAndUnlockAchievements(gameData);
      setIsGameComplete(true);

      // Play game complete sound
      play_sound('game_complete');

      // Show achievement notification
      if (newAchievements.length > 0) {
        // Show notification for the first achievement (could be enhanced to show all)
        setShowAchievementNotification(newAchievements[0]);
        setTimeout(() => setShowAchievementNotification(null), 4000);
        // Play achievement unlock sound
        play_sound('achievement_unlock');
      }

      // Check if this completion unlocks the next level
      const unlockedDifficulties = getUnlockedDifficulties();
      const currentIndex = DIFFICULTY_ORDER.indexOf(selectedDifficulty as any);
      const nextDifficulty = DIFFICULTY_ORDER[currentIndex + 1] as DifficultyId;
      
      if (nextDifficulty && unlockedDifficulties.includes(nextDifficulty)) {
        toast.success(`🎉 ${DIFFICULTIES[nextDifficulty].name} difficulty unlocked!`, {
          duration: 4000,
          id: 'unlock-notification'
        });
        // Play level unlock sound
        play_sound('level_unlock');
      }

      // Submit score on-chain (best-effort)
      submitScore(finalScore)
        .then(({ txId }) => {
          toast.success('Score submitted on-chain!', { id: 'submit-score' });
          console.log('submit-score txId:', txId);
        })
        .catch((err) => {
          console.warn('Score submission skipped/failed:', err?.message || err);
          toast.error('Could not submit score on-chain');
        });
    }
  }, [cards, moves, addPoints, incrementGamesPlayed, address, currentDifficulty, selectedDifficulty, completeLevel, getUnlockedDifficulties, checkAndUnlockAchievements, play_sound]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || !address) return;
    
    // Play card flip sound
    play_sound('card_flip');
    
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const handleDifficultyChange = (difficulty: DifficultyId) => {
    if (isDifficultyUnlocked(difficulty)) {
      setSelectedDifficulty(difficulty);
      play_sound('difficulty_select');
    }
  };

  const handleStartGame = useCallback(() => {
    if (!address) return;
    play_sound('button_click');
    initializeGame();
    // Fade in background music when game starts
    if (musicEnabled) {
      fade_in();
    }
  }, [address, play_sound, initializeGame, musicEnabled, fade_in]);

  const handleNewGame = useCallback(() => {
    play_sound('button_click');
    setShowDifficultySelector(true);
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setIsGameComplete(false);
    // Fade out music when returning to difficulty selector
    if (musicEnabled) {
      fade_out();
    }
  }, [play_sound, musicEnabled, fade_out]);

  const getGridClassName = () => {
    const { gridCols } = currentDifficulty;
    // Use explicit Tailwind classes to ensure they're included in the build
    const gridColsClasses = {
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8'
    };
    
    // Adjust gap based on card size and grid density
    let gap = 'gap-2';
    if (cardSize.width > 96) {
      gap = 'gap-4';
    } else if (cardSize.width > 80) {
      gap = 'gap-3';
    }
    
    return `grid ${gap} mx-auto max-w-fit ${gridColsClasses[gridCols as keyof typeof gridColsClasses] || 'grid-cols-4'}`;
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <div className="text-lg">Loading images...</div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <div className="p-6 bg-yellow-500/20 border border-yellow-500 rounded-lg">
          <div className="text-xl mb-2">🔒</div>
          <h3 className="font-bold text-yellow-400 mb-2">Wallet Required</h3>
          <p className="text-sm text-gray-300">
            Please connect your wallet to play the memory card game and earn points.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4">
      {/* Achievement Notification */}
      {showAchievementNotification && (
        <AchievementNotification
          achievementId={showAchievementNotification}
          onClose={() => setShowAchievementNotification(null)}
        />
      )}

      {/* Difficulty Selector */}
      {showDifficultySelector && (
        <div className="mb-8">
          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={handleDifficultyChange}
          />
          <div className="text-center mt-6">
            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Content */}
      {!showDifficultySelector && (
        <>
          {/* Game Stats */}
          <div className="flex justify-between items-center mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {currentDifficulty.emoji} {currentDifficulty.name} - {moves} moves
              </span>
              <span className="text-xs text-gray-400">
                {currentDifficulty.pairs} pairs • Pool: {imagePool.length}/{IMAGE_POOL_SIZE}
              </span>
            </div>
            <button
              onClick={handleNewGame}
              className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded transition-colors"
            >
              New Game
            </button>
          </div>

          {/* Game Complete Message */}
          {isGameComplete && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center">
              <h3 className="font-bold text-green-400 mb-2">🎉 Congratulations!</h3>
              <p className="text-sm">
                Game completed in {moves} moves!<br/>
                Points earned: {Math.round((currentDifficulty.basePoints + Math.max(0, currentDifficulty.maxMovesForBonus - moves) * 5) * currentDifficulty.multiplier)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Difficulty: {currentDifficulty.name} ({currentDifficulty.multiplier}x multiplier)
              </p>
            </div>
          )}

          {/* Game Board */}
          <div className={getGridClassName()}>
            {cards.map((card) => (
              <Card
                key={card.id}
                imageSrc={card.imageSrc}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(card.id)}
                sizeClass={cardSize.className}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
