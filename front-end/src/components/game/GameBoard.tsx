"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card } from './Card';
import { usePointsStore } from '@/stores/usePointsStore';
import { useWallet } from '@/contexts/WalletContext';

// Hook to dynamically load images
function useImages() {
  const [images, setImages] = useState<string[]>([]);
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
          '/images/21.jpg', '/images/22.jpg', '/images/23.jpg', '/images/24.jpg'
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return { images, loading };
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
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const { addPoints, incrementGamesPlayed } = usePointsStore();
  const { images, loading } = useImages();
  const { address } = useWallet();

  const initializeGame = useCallback(() => {
    if (images.length === 0 || !address) return;
    
    // Get 8 random images for this game
    const selectedImages = getRandomImages(images, 8);
    
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
  }, [images, address]);

  // Initialize game when images are loaded and wallet is connected
  useEffect(() => {
    if (!loading && images.length > 0 && address) {
      initializeGame();
    }
  }, [loading, images, address, initializeGame]);

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
    if (cards.length > 0 && cards.every(card => card.isMatched) && address) {
      setIsGameComplete(true);
      // Award points: base 100 + bonus for fewer moves
      const basePoints = 100;
      const efficiency_bonus = Math.max(0, 20 - moves) * 5;
      const totalPoints = basePoints + efficiency_bonus;
      addPoints(totalPoints);
      incrementGamesPlayed();
    }
  }, [cards, moves, addPoints, incrementGamesPlayed, address]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || !address) return;
    
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
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
        <span className="text-sm">Moves: {moves}</span>
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
            Points earned: {100 + Math.max(0, 20 - moves) * 5}
          </p>
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
