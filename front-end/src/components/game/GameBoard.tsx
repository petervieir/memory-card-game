"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from './Card';
import { usePointsStore } from '@/stores/usePointsStore';
import { useWallet } from '@/contexts/WalletContext';
import { submitScoreTx } from '@/lib/tx';


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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPoints, incrementGamesPlayed } = usePointsStore();
  const { images, loading, selectImagesFromPool, imagePool } = useImages();
  const { address } = useWallet();

  const initializeGame = useCallback(() => {
    if (images.length === 0 || !address) return;
    hasAwardedRef.current = false;
    
    // Get 8 images from pool management system
    const selectedImages = selectImagesFromPool(8);
    
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
  }, [images, address, selectImagesFromPool]);

  // Initialize game when images are loaded and wallet is connected
  useEffect(() => {
    if (!loading && images.length > 0 && address) {
      initializeGame();
    }
    // We intentionally exclude initializeGame to avoid re-running when pool grows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, images, address]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length !== 2) return;
    
    const [first, second] = flippedCards;
    const firstCard = cards.find(card => card.id === first);
    const secondCard = cards.find(card => card.id === second);
    const isMatch = firstCard?.imageSrc === secondCard?.imageSrc;

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
  }, [flippedCards, cards]);

  // Clear game when wallet disconnects
  useEffect(() => {
    if (!address) {
      setCards([]);
      setFlippedCards([]);
      setMoves(0);
      setIsGameComplete(false);
    }
  }, [address]);

  // Check if game is complete
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && address && !hasAwardedRef.current) {
      hasAwardedRef.current = true;
      const basePoints = 100;
      const efficiency_bonus = Math.max(0, 20 - moves) * 5;
      addPoints(basePoints + efficiency_bonus);
      incrementGamesPlayed();
      setIsGameComplete(true);
    }
  }, [cards, moves, addPoints, incrementGamesPlayed, address]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || !address) return;
    
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const points = 100 + Math.max(0, 20 - moves) * 5;
  const submitEnabled = (process.env.NEXT_PUBLIC_ENABLE_SUBMIT_SCORE || '').toLowerCase() === 'true' || (process.env.NEXT_PUBLIC_ENABLE_SUBMIT_SCORE || '').toLowerCase() === '1';

  const onSubmitScore = async () => {
    try {
      setIsSubmitting(true);
      await submitScoreTx({ score: points });
    } catch (e) {
      console.error('Submit score error:', e);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="max-w-2xl mx-auto">
      {/* Game Stats */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col">
          <span className="text-sm">Moves: {moves}</span>
          <span className="text-xs text-gray-400">Pool: {imagePool.length}/{IMAGE_POOL_SIZE}</span>
        </div>
        <button
          onClick={initializeGame}
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
            Points earned: {points}
          </p>
          {submitEnabled && (
            <div className="mt-4">
              <button
                onClick={onSubmitScore}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit to chain'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
        {cards.map((card) => (
          <Card
            key={card.id}
            imageSrc={card.imageSrc}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
