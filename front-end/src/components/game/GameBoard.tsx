"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from './Card';
import { DifficultySelector } from './DifficultySelector';
import { Timer } from './Timer';
import { usePointsStore } from '@/stores/usePointsStore';
import { useDifficultyStore } from '@/stores/useDifficultyStore';
import { useAudioStore } from '@/stores/useAudioStore';
import { useTimerStore } from '@/stores/useTimerStore';
import { useStatsStore } from '@/stores/useStatsStore';
import { useDailyChallengeStore } from '@/stores/useDailyChallengeStore';
import { useXPStore } from '@/stores/useXPStore';
import { useSoundEffects, useBackgroundMusic } from '@/hooks/useSoundEffects';
import { submitScore } from '@/lib/tx';
import toast from 'react-hot-toast';
import { useWallet } from '@/contexts/WalletContext';
import { useCardSize } from '@/hooks/useCardSize';
import { DIFFICULTIES, DIFFICULTY_ORDER, type DifficultyId, type GameCompletionData, XP_CONFIG } from '@/types/game';
import { AchievementNotification } from './AchievementBadge';
import { LevelUpModal } from './LevelUpModal';


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

function getRandomImages(images: string[], count: number, seed?: number): string[] {
  if (seed !== undefined) {
    // Use seeded random for daily challenges
    const seededRandom = create_seeded_random(seed);
    const shuffled = [...images].sort(() => seededRandom() - 0.5);
    return shuffled.slice(0, count);
  }
  const shuffled = [...images].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Seeded random number generator for deterministic card layouts
function create_seeded_random(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

interface GameCard {
  id: number;
  imageSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function GameBoard() {
  const searchParams = useSearchParams();
  const isDailyChallenge = searchParams?.get('mode') === 'daily-challenge';
  const challengeId = searchParams?.get('challengeId');
  
  const hasAwardedRef = useRef(false);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('beginner');
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [showAchievementNotification, setShowAchievementNotification] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintRevealedCards, setHintRevealedCards] = useState<number[]>([]);
  const [isHintActive, setIsHintActive] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const lastWarningSecondRef = useRef<number>(-1);
  const { addPoints, incrementGamesPlayed, checkAndUnlockAchievements, setWalletAddress: setPointsWalletAddress, spendPoints, points } = usePointsStore();
  const { addXP, calculate_game_xp, setWalletAddress: setXPWalletAddress } = useXPStore();
  const { images, loading, selectImagesFromPool, imagePool } = useImages();
  const { address } = useWallet();
  const { 
    setWalletAddress, 
    completeLevel, 
    isUnlocked: isDifficultyUnlocked, 
    getUnlockedDifficulties 
  } = useDifficultyStore();
  const { timerEnabled } = useTimerStore();
  const { setWalletAddress: setStatsWalletAddress, addGameRecord } = useStatsStore();
  const { 
    getTodayChallenge, 
    completeChallenge, 
    setWalletAddress: setDailyChallengeWalletAddress 
  } = useDailyChallengeStore();
  
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
    
    // Get seed for daily challenge mode
    let seed: number | undefined;
    if (isDailyChallenge && challengeId) {
      const challenge = getTodayChallenge();
      seed = challenge.seed;
    }
    
    // Get images based on selected difficulty
    const selectedImages = seed === undefined 
      ? selectImagesFromPool(currentDifficulty.pairs)
      : getRandomImages(images, currentDifficulty.pairs, seed);
    
    // Create pairs and shuffle
    const gameCards: GameCard[] = [];
    selectedImages.forEach((imageSrc, index) => {
      gameCards.push(
        { id: index * 2, imageSrc, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, imageSrc, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards (with seed if daily challenge)
    if (seed === undefined) {
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
    } else {
      const seededRandom = create_seeded_random(seed + 1); // Use different seed for shuffle
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setIsGameComplete(false);
    setShowDifficultySelector(false);
    setHintsUsed(0);
    setHintRevealedCards([]);
    setIsHintActive(false);
    setCurrentCombo(0);
    setHighestCombo(0);
    setShowComboEffect(false);
    setIsTimeUp(false);
    setTimeRemaining(currentDifficulty.timerSeconds);
    lastWarningSecondRef.current = -1;
    
    // Start timer if enabled or if daily challenge requires it
    const challenge = isDailyChallenge ? getTodayChallenge() : null;
    const shouldStartTimer = timerEnabled || (challenge?.specialCondition.type === 'timer');
    if (shouldStartTimer) {
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [images, address, selectImagesFromPool, currentDifficulty.pairs, currentDifficulty.timerSeconds, timerEnabled, isDailyChallenge, challengeId, getTodayChallenge]);

  // Auto-start daily challenge mode
  useEffect(() => {
    if (isDailyChallenge && challengeId && address) {
      const challenge = getTodayChallenge();
      setSelectedDifficulty(challenge.difficulty);
      setShowDifficultySelector(false);
    }
  }, [isDailyChallenge, challengeId, address, getTodayChallenge]);

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
    
    // Safety check: ensure both cards exist and are different
    if (!firstCard || !secondCard || first === second) {
      setFlippedCards([]);
      return;
    }
    
    const isMatch = firstCard.imageSrc === secondCard.imageSrc;

    // Handle combo logic - use functional updates to avoid dependency issues
    if (isMatch) {
      setCurrentCombo(prev => {
        const newCombo = prev + 1;
        
        // Update highest combo if needed
        setHighestCombo(current => Math.max(current, newCombo));
        
        // Show visual effect for high combos
        if (newCombo >= 3) {
          setShowComboEffect(true);
          setTimeout(() => setShowComboEffect(false), 1000);
        }
        
        // Show combo toast for milestones
        if (newCombo === 3) {
          toast.success('🔥 3x Combo! 1.2x multiplier', { duration: 2000, id: 'combo-3' });
        } else if (newCombo === 5) {
          toast.success('🔥🔥 5x Combo! 1.5x multiplier', { duration: 2000, id: 'combo-5' });
        } else if (newCombo === 10) {
          toast.success('🔥🔥🔥 10x COMBO! 2.0x multiplier!', { duration: 3000, id: 'combo-10' });
        }
        
        return newCombo;
      });
    } else {
      // Reset combo on miss
      setCurrentCombo(0);
    }

    // Increment moves immediately
    setMoves(prev => prev + 1);

    // Play match/mismatch sound
    const soundTimeout = setTimeout(() => {
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

    const updateTimeout = setTimeout(updateCards, 1000);
    
    // Cleanup timeouts if effect re-runs
    return () => {
      clearTimeout(soundTimeout);
      clearTimeout(updateTimeout);
    };
    // We intentionally exclude 'cards', 'currentCombo', and 'highestCombo' to avoid re-running
    // The effect should only run when flippedCards changes to length 2
    // Combo state uses functional updates to access current values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedCards, play_sound]);

  // Handle wallet connection/disconnection
  useEffect(() => {
    setWalletAddress(address);
    setPointsWalletAddress(address);
    setStatsWalletAddress(address);
    setDailyChallengeWalletAddress(address);
    setXPWalletAddress(address);
    
    if (!address) {
      setCards([]);
      setFlippedCards([]);
      setMoves(0);
      setIsGameComplete(false);
      setShowDifficultySelector(true);
    }
  }, [address, setWalletAddress, setPointsWalletAddress, setStatsWalletAddress, setDailyChallengeWalletAddress]);

  // Handle timer tick
  const handleTimerTick = useCallback((secondsRemaining: number) => {
    setTimeRemaining(secondsRemaining);
    
    // Play warning sounds at specific thresholds (only once per threshold)
    if (secondsRemaining === 20 && lastWarningSecondRef.current !== 20) {
      play_sound('timer_warning');
      lastWarningSecondRef.current = 20;
    } else if (secondsRemaining === 10 && lastWarningSecondRef.current !== 10) {
      play_sound('timer_critical');
      lastWarningSecondRef.current = 10;
      toast.error('⏰ 10 seconds left!', { duration: 2000, id: 'timer-warning' });
    }
  }, [play_sound]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    setIsTimeUp(true);
    play_sound('time_up');
    toast.error('⏰ Time\'s up! Game over!', { 
      duration: 4000, 
      id: 'time-up',
      icon: '⏰'
    });
    
    // Record failed game in stats
    addGameRecord({
      difficulty: selectedDifficulty,
      moves,
      score: 0,
      hintsUsed,
      combo: highestCombo,
      timerMode: true,
      timeRemaining: 0,
      totalTime: currentDifficulty.timerSeconds,
      completed: false
    });
    
    // Show final state but don't award points
    setTimeout(() => {
      setShowDifficultySelector(true);
      setCards([]);
    }, 3000);
  }, [play_sound, addGameRecord, selectedDifficulty, moves, hintsUsed, highestCombo, currentDifficulty]);

  // Check if game is complete
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && address && !hasAwardedRef.current) {
      hasAwardedRef.current = true;
      
      // Stop timer if active
      if (isTimerActive) {
        setIsTimerActive(false);
      }
      
      const basePoints = currentDifficulty.basePoints;
      const efficiency_bonus = Math.max(0, currentDifficulty.maxMovesForBonus - moves) * 5;
      
      // Calculate time bonus (only in timer mode)
      let timeBonus = 0;
      if (timerEnabled && timeRemaining > 0) {
        // Award 2 points per second remaining
        timeBonus = Math.round(timeRemaining * 2);
      }
      
      // Calculate combo bonus multiplier
      let comboMultiplier = 1;
      if (highestCombo >= 10) {
        comboMultiplier = 2;
      } else if (highestCombo >= 5) {
        comboMultiplier = 1.5;
      } else if (highestCombo >= 3) {
        comboMultiplier = 1.2;
      }
      
      const rawScore = basePoints + efficiency_bonus + timeBonus;
      const scoreWithCombo = Math.round(rawScore * comboMultiplier);
      const finalScore = Math.round(scoreWithCombo * currentDifficulty.multiplier);

      // Update stores first
      addPoints(finalScore);
      const newGamesPlayed = incrementGamesPlayed(timerEnabled);
      completeLevel(selectedDifficulty, finalScore, moves);

      // Prepare achievement data AFTER updating stores
      const gameData: GameCompletionData = {
        moves,
        maxMovesForBonus: currentDifficulty.maxMovesForBonus,
        difficulty: selectedDifficulty,
        score: finalScore,
        gamesPlayed: newGamesPlayed, // Use the actual updated value
        isPerfectGame: moves <= currentDifficulty.maxMovesForBonus,
        hintsUsed,
        highestCombo,
        timerMode: timerEnabled,
        timeRemaining: timerEnabled ? timeRemaining : undefined,
        totalTime: timerEnabled ? currentDifficulty.timerSeconds : undefined
      };

      // Check for achievements AFTER updating stores
      let newAchievements = checkAndUnlockAchievements(gameData);
      
      // Award XP for game completion
      const gameXP = calculate_game_xp({
        difficulty: selectedDifficulty,
        isPerfectGame: moves <= currentDifficulty.maxMovesForBonus,
        combo: highestCombo
      });
      
      const xpResult = addXP({
        type: 'game_completion',
        amount: gameXP,
        description: `Completed ${currentDifficulty.name} difficulty`
      });
      
      // Award bonus XP for achievements
      if (newAchievements.length > 0) {
        for (const _ of newAchievements) {
          addXP({
            type: 'achievement',
            amount: XP_CONFIG.ACHIEVEMENT_XP,
            description: 'Achievement unlocked'
          });
        }
      }
      
      // Show XP gain notification
      toast.success(`+${gameXP} XP earned!`, {
        duration: 3000,
        id: 'xp-gain',
        icon: '⭐'
      });
      
      if (xpResult.leveledUp) {
        toast.success(`🎉 Level Up! Now Level ${xpResult.newLevel}!`, {
          duration: 4000,
          id: 'level-up'
        });
      }
      
      // Handle daily challenge completion
      if (isDailyChallenge && challengeId) {
        const challenge = getTodayChallenge();
        let conditionMet = false;
        
        // Check if special condition is met
        switch (challenge.specialCondition.type) {
          case 'max_moves':
            conditionMet = moves <= challenge.specialCondition.requirement;
            break;
          case 'timer':
            conditionMet = timerEnabled && timeRemaining > 0 && timeRemaining >= (currentDifficulty.timerSeconds - challenge.specialCondition.requirement);
            break;
          case 'no_hints':
            conditionMet = hintsUsed === 0;
            break;
          case 'perfect_accuracy': {
            const accuracy = (currentDifficulty.pairs / moves) * 100;
            conditionMet = accuracy >= challenge.specialCondition.requirement;
            break;
          }
          case 'combo_streak':
            conditionMet = highestCombo >= challenge.specialCondition.requirement;
            break;
        }
        
        // Award bonus points if condition met
        if (conditionMet) {
          addPoints(challenge.bonusPoints);
          toast.success(`🌟 Bonus! +${challenge.bonusPoints} pts for meeting challenge condition!`, {
            duration: 4000,
            id: 'challenge-bonus'
          });
        }
        
        // Complete the challenge
        const challengeAchievements = completeChallenge(challengeId, moves, finalScore + (conditionMet ? challenge.bonusPoints : 0), conditionMet);
        newAchievements = [...newAchievements, ...challengeAchievements];
        
        // Award daily challenge XP
        addXP({
          type: 'daily_challenge',
          amount: XP_CONFIG.DAILY_CHALLENGE_XP,
          description: 'Daily Challenge completed'
        });
        
        // Show challenge completion message
        toast.success(conditionMet ? '✨ Daily Challenge Completed Perfectly!' : '✓ Daily Challenge Completed!', {
          duration: 4000,
          id: 'challenge-complete'
        });
      }
      
      setIsGameComplete(true);

      // Record game in stats
      addGameRecord({
        difficulty: selectedDifficulty,
        moves,
        score: finalScore,
        hintsUsed,
        combo: highestCombo,
        timerMode: timerEnabled,
        timeRemaining: timerEnabled ? timeRemaining : undefined,
        totalTime: timerEnabled ? currentDifficulty.timerSeconds : undefined,
        completed: true
      });

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
      const currentIndex = DIFFICULTY_ORDER.indexOf(selectedDifficulty as typeof DIFFICULTY_ORDER[number]);
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
  }, [cards, moves, addPoints, incrementGamesPlayed, address, currentDifficulty, selectedDifficulty, completeLevel, getUnlockedDifficulties, checkAndUnlockAchievements, play_sound, hintsUsed, highestCombo, timerEnabled, timeRemaining, isTimerActive, addGameRecord]);

  const useHint = useCallback(() => {
    // Check if hint is available
    const hintsRemaining = currentDifficulty.maxHints - hintsUsed;
    if (hintsRemaining <= 0) {
      toast.error('No hints remaining!');
      return;
    }

    // Check if player has enough points
    if (points < 50) {
      toast.error('Not enough points! Hints cost 50 points.');
      return;
    }

    // Check if hint is already active
    if (isHintActive) {
      return;
    }

    // Get all unmatched cards
    const unmatchedCards = cards.filter(card => !card.isMatched && !card.isFlipped);
    
    if (unmatchedCards.length < 2) {
      toast.error('No pairs left to reveal!');
      return;
    }

    // Find a random unmatched pair
    const imageSources = Array.from(new Set(unmatchedCards.map(c => c.imageSrc)));
    const randomImage = imageSources[Math.floor(Math.random() * imageSources.length)];
    const pairCards = unmatchedCards.filter(c => c.imageSrc === randomImage);
    
    if (pairCards.length < 2) {
      // Fallback: just pick any two unmatched cards with same image
      const cardsByImage = unmatchedCards.reduce((acc, card) => {
        if (!acc[card.imageSrc]) acc[card.imageSrc] = [];
        acc[card.imageSrc].push(card);
        return acc;
      }, {} as Record<string, GameCard[]>);
      
      const validPairs = Object.values(cardsByImage).filter(cards => cards.length >= 2);
      if (validPairs.length === 0) return;
      
      const selectedPair = validPairs[Math.floor(Math.random() * validPairs.length)];
      pairCards.length = 0;
      pairCards.push(selectedPair[0], selectedPair[1]);
    }

    // Deduct points
    const pointsDeducted = spendPoints(50);
    if (!pointsDeducted) {
      toast.error('Could not deduct points!');
      return;
    }

    // Reveal the pair
    const cardIds = [pairCards[0].id, pairCards[1].id];
    setHintRevealedCards(cardIds);
    setIsHintActive(true);
    setHintsUsed(prev => prev + 1);
    
    // Play hint sound
    play_sound('button_click');
    
    toast.success(`💡 Hint used! -50 points (${hintsRemaining - 1} hints remaining)`, {
      duration: 2000,
      id: 'hint-used'
    });

    // Hide the cards after 3 seconds
    setTimeout(() => {
      setHintRevealedCards([]);
      setIsHintActive(false);
    }, 3000);
  }, [cards, hintsUsed, currentDifficulty.maxHints, points, spendPoints, play_sound, isHintActive]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || !address || isHintActive || isTimeUp) return;
    
    // Find the card being clicked
    const clickedCard = cards.find(card => card.id === cardId);
    
    // Prevent clicking if card is already flipped, matched, in flippedCards array, or hint-revealed
    if (!clickedCard || 
        clickedCard.isFlipped || 
        clickedCard.isMatched || 
        flippedCards.includes(cardId) ||
        hintRevealedCards.includes(cardId)) {
      return;
    }
    
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
    setHintsUsed(0);
    setHintRevealedCards([]);
    setIsHintActive(false);
    setCurrentCombo(0);
    setHighestCombo(0);
    setShowComboEffect(false);
    setIsTimerActive(false);
    setIsTimeUp(false);
    setTimeRemaining(0);
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
      {/* Level Up Modal */}
      <LevelUpModal />
      
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
            onTimerToggle={() => play_sound('button_click')}
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
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {currentDifficulty.emoji} {currentDifficulty.name} {timerEnabled && '⏱️'} - {moves} moves
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {currentDifficulty.pairs} pairs • Pool: {imagePool.length}/{IMAGE_POOL_SIZE}
                </span>
                {currentCombo > 0 && (
                  <span 
                    className={`text-xs font-bold px-2 py-0.5 rounded transition-all duration-300 ${
                      (() => {
                        if (showComboEffect) return 'bg-orange-500 text-white scale-110 animate-pulse';
                        if (currentCombo >= 10) return 'bg-red-500 text-white';
                        if (currentCombo >= 5) return 'bg-orange-500 text-white';
                        return 'bg-yellow-500 text-white';
                      })()
                    }`}
                  >
                    🔥 {currentCombo}x Combo
                    {currentCombo >= 10 && ' 🔥🔥'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/* Timer Display */}
              {timerEnabled && !isGameComplete && (
                <Timer
                  initialSeconds={currentDifficulty.timerSeconds}
                  isActive={isTimerActive && !isGameComplete}
                  onTimeUp={handleTimeUp}
                  onTick={handleTimerTick}
                />
              )}
              <button
                onClick={useHint}
                disabled={isGameComplete || hintsUsed >= currentDifficulty.maxHints || points < 50 || isHintActive}
                className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
                  isGameComplete || hintsUsed >= currentDifficulty.maxHints || points < 50 || isHintActive
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
                title={`Reveal a matching pair for 3 seconds (Costs 50 points)`}
              >
                💡 Hint ({currentDifficulty.maxHints - hintsUsed})
              </button>
              <button
                onClick={handleNewGame}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded transition-colors"
              >
                New Game
              </button>
            </div>
          </div>

          {/* Game Complete Message */}
          {isGameComplete && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center">
              <h3 className="font-bold text-green-400 mb-2">🎉 Congratulations!</h3>
              <p className="text-sm">
                Game completed in {moves} moves!<br/>
                Points earned: {(() => {
                  const basePoints = currentDifficulty.basePoints;
                  const efficiencyBonus = Math.max(0, currentDifficulty.maxMovesForBonus - moves) * 5;
                  const timeBonus = timerEnabled && timeRemaining > 0 ? Math.round(timeRemaining * 2) : 0;
                  let comboMult = 1;
                  if (highestCombo >= 10) comboMult = 2;
                  else if (highestCombo >= 5) comboMult = 1.5;
                  else if (highestCombo >= 3) comboMult = 1.2;
                  return Math.round((basePoints + efficiencyBonus + timeBonus) * comboMult * currentDifficulty.multiplier);
                })()}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Difficulty: {currentDifficulty.name} ({currentDifficulty.multiplier}x multiplier)
                {timerEnabled && timeRemaining > 0 && ` • Time Bonus: ${Math.round(timeRemaining * 2)} pts (${timeRemaining}s left)`}
                {highestCombo > 0 && ` • Best Combo: ${highestCombo}x`}
                {highestCombo >= 10 && ' 🔥🔥🔥'}
                {highestCombo >= 5 && highestCombo < 10 && ' 🔥🔥'}
                {highestCombo >= 3 && highestCombo < 5 && ' 🔥'}
              </p>
            </div>
          )}
          
          {/* Time Up Message */}
          {isTimeUp && !isGameComplete && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
              <h3 className="font-bold text-red-400 mb-2">⏰ Time&apos;s Up!</h3>
              <p className="text-sm">
                You ran out of time!<br/>
                No points awarded this round.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Completed {cards.filter(c => c.isMatched).length / 2} out of {currentDifficulty.pairs} pairs
              </p>
            </div>
          )}

          {/* Game Board */}
          <div className={getGridClassName()}>
            {cards.map((card) => {
              const isHintRevealed = hintRevealedCards.includes(card.id);
              return (
                <Card
                  key={card.id}
                  imageSrc={card.imageSrc}
                  isFlipped={card.isFlipped || isHintRevealed}
                  isMatched={card.isMatched}
                  onClick={() => handleCardClick(card.id)}
                  sizeClass={cardSize.className}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
