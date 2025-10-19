export interface Difficulty {
  id: string;
  name: string;
  pairs: number;
  totalCards: number;
  gridCols: number;
  gridRows: number;
  basePoints: number;
  multiplier: number;
  maxMovesForBonus: number;
  maxHints: number;
  description: string;
  emoji: string;
  timerSeconds: number;
}

export const DIFFICULTIES: Record<string, Difficulty> = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    pairs: 6,
    totalCards: 12,
    gridCols: 4,
    gridRows: 3,
    basePoints: 120,
    multiplier: 1,
    maxMovesForBonus: 25,
    maxHints: 3,
    description: '6 pairs - Perfect for beginners',
    emoji: '😊',
    timerSeconds: 60
  },
  easy: {
    id: 'easy',
    name: 'Easy',
    pairs: 8,
    totalCards: 16,
    gridCols: 4,
    gridRows: 4,
    basePoints: 160,
    multiplier: 1.2,
    maxMovesForBonus: 35,
    maxHints: 3,
    description: '8 pairs - Getting comfortable',
    emoji: '🙂',
    timerSeconds: 90
  },
  medium: {
    id: 'medium',
    name: 'Medium', 
    pairs: 10,
    totalCards: 20,
    gridCols: 5,
    gridRows: 4,
    basePoints: 200,
    multiplier: 1.5,
    maxMovesForBonus: 45,
    maxHints: 2,
    description: '10 pairs - A moderate challenge',
    emoji: '🤔',
    timerSeconds: 100
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    pairs: 12,
    totalCards: 24,
    gridCols: 6,
    gridRows: 4,
    basePoints: 250,
    multiplier: 1.8,
    maxMovesForBonus: 55,
    maxHints: 2,
    description: '12 pairs - For experienced players',
    emoji: '😤',
    timerSeconds: 110
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    pairs: 14,
    totalCards: 28,
    gridCols: 7,
    gridRows: 4,
    basePoints: 300,
    multiplier: 2.2,
    maxMovesForBonus: 65,
    maxHints: 1,
    description: '14 pairs - Ultimate memory test',
    emoji: '🧠',
    timerSeconds: 120
  },
  master: {
    id: 'master',
    name: 'Master',
    pairs: 16,
    totalCards: 32,
    gridCols: 8,
    gridRows: 4,
    basePoints: 400,
    multiplier: 2.5,
    maxMovesForBonus: 75,
    maxHints: 1,
    description: '16 pairs - Legendary challenge',
    emoji: '🏆',
    timerSeconds: 120
  }
};

export const DIFFICULTY_ORDER = ['beginner', 'easy', 'medium', 'hard', 'expert', 'master'] as const;
export type DifficultyId = keyof typeof DIFFICULTIES;

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (gameData: GameCompletionData) => boolean;
  category: 'moves' | 'difficulty' | 'milestone' | 'special' | 'time_attack';
}

export interface GameCompletionData {
  moves: number;
  maxMovesForBonus: number;
  difficulty: DifficultyId;
  score: number;
  gamesPlayed: number;
  isPerfectGame: boolean;
  hintsUsed: number;
  highestCombo: number;
  timerMode: boolean;
  timeRemaining?: number;
  totalTime?: number;
}

// Daily Challenge System
export interface DailyChallenge {
  id: string; // Format: 'challenge-YYYY-MM-DD'
  date: string; // Format: 'YYYY-MM-DD'
  difficulty: DifficultyId;
  specialCondition: ChallengeCondition;
  bonusPoints: number;
  seed: number; // For deterministic card layout
  description: string;
}

export interface ChallengeCondition {
  type: 'max_moves' | 'timer' | 'no_hints' | 'perfect_accuracy' | 'combo_streak';
  requirement: number;
  description: string;
}

export interface DailyChallengeCompletion {
  challengeId: string;
  completed: boolean;
  completedAt?: Date;
  moves: number;
  score: number;
  conditionMet: boolean;
}

export interface ChallengeStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // Format: 'YYYY-MM-DD'
  totalChallengesCompleted: number;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  FIRST_VICTORY: {
    id: 'first_victory',
    name: 'First Victory',
    description: 'Complete your first game',
    icon: '🏆',
    category: 'milestone',
    condition: (data) => data.gamesPlayed === 1
  },
  PERFECT_GAME: {
    id: 'perfect_game',
    name: 'Perfect Game',
    description: 'Complete a game within the bonus move limit',
    icon: '🎯',
    category: 'moves',
    condition: (data) => data.moves <= data.maxMovesForBonus
  },
  SPEED_MASTER: {
    id: 'speed_master',
    name: 'Speed Master',
    description: 'Complete a game in 75% or fewer of the bonus moves',
    icon: '⚡',
    category: 'moves',
    condition: (data) => data.moves <= Math.floor(data.maxMovesForBonus * 0.75)
  },
  EFFICIENCY_EXPERT: {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Complete a game in 50% or fewer of the bonus moves',
    icon: '🔥',
    category: 'moves',
    condition: (data) => data.moves <= Math.floor(data.maxMovesForBonus * 0.5)
  },
  BEGINNER_CHAMPION: {
    id: 'beginner_champion',
    name: 'Beginner Champion',
    description: 'Complete Beginner difficulty',
    icon: '😊',
    category: 'difficulty',
    condition: (data) => data.difficulty === 'beginner'
  },
  EASY_CONQUEROR: {
    id: 'easy_conqueror',
    name: 'Easy Conqueror',
    description: 'Complete Easy difficulty',
    icon: '🙂',
    category: 'difficulty',
    condition: (data) => data.difficulty === 'easy'
  },
  MEDIUM_MASTER: {
    id: 'medium_master',
    name: 'Medium Master',
    description: 'Complete Medium difficulty',
    icon: '🤔',
    category: 'difficulty',
    condition: (data) => data.difficulty === 'medium'
  },
  HARD_HERO: {
    id: 'hard_hero',
    name: 'Hard Hero',
    description: 'Complete Hard difficulty',
    icon: '😤',
    category: 'difficulty',
    condition: (data) => data.difficulty === 'hard'
  },
  EXPERT_ELITE: {
    id: 'expert_elite',
    name: 'Expert Elite',
    description: 'Complete Expert difficulty',
    icon: '🧠',
    category: 'difficulty',
    condition: (data) => data.difficulty === 'expert'
  },
  MASTER_LEGEND: {
    id: 'master_legend',
    name: 'Master Legend',
    description: 'Complete Master difficulty',
    icon: '👑',
    category: 'difficulty',
    condition: (data) => data.difficulty === 'master'
  },
  VETERAN_PLAYER: {
    id: 'veteran_player',
    name: 'Veteran Player',
    description: 'Play 10 games',
    icon: '🎮',
    category: 'milestone',
    condition: (data) => data.gamesPlayed >= 10
  },
  CENTURY_CLUB: {
    id: 'century_club',
    name: 'Century Club',
    description: 'Play 100 games',
    icon: '💯',
    category: 'milestone',
    condition: (data) => data.gamesPlayed >= 100
  },
  HIGH_SCORER: {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score 1000 points in a single game',
    icon: '🌟',
    category: 'special',
    condition: (data) => data.score >= 1000
  },
  NO_HINTS_MASTER: {
    id: 'no_hints_master',
    name: 'No Hints Master',
    description: 'Complete a game without using any hints',
    icon: '🧩',
    category: 'special',
    condition: (data) => data.hintsUsed === 0
  },
  STRATEGIC_THINKER: {
    id: 'strategic_thinker',
    name: 'Strategic Thinker',
    description: 'Complete a difficult game (Medium+) using only 1 hint',
    icon: '🎓',
    category: 'special',
    condition: (data) => {
      const difficultLevels: DifficultyId[] = ['medium', 'hard', 'expert', 'master'];
      return difficultLevels.includes(data.difficulty) && data.hintsUsed === 1;
    }
  },
  COMBO_MASTER: {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Achieve a 10+ match combo streak in a single game',
    icon: '🔥',
    category: 'special',
    condition: (data) => data.highestCombo >= 10
  },
  TIME_ATTACK_WINNER: {
    id: 'time_attack_winner',
    name: 'Time Attack Winner',
    description: 'Complete a game in Timer Mode',
    icon: '⏱️',
    category: 'time_attack',
    condition: (data) => data.timerMode && (data.timeRemaining ?? 0) > 0
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete Timer Mode with 50% or more time remaining',
    icon: '⚡',
    category: 'time_attack',
    condition: (data) => {
      if (!data.timerMode || !data.timeRemaining || !data.totalTime) return false;
      return data.timeRemaining >= data.totalTime * 0.5;
    }
  },
  LAST_SECOND_HERO: {
    id: 'last_second_hero',
    name: 'Last Second Hero',
    description: 'Complete Timer Mode with less than 10 seconds remaining',
    icon: '😰',
    category: 'time_attack',
    condition: (data) => {
      if (!data.timerMode || !data.timeRemaining) return false;
      return data.timeRemaining > 0 && data.timeRemaining <= 10;
    }
  },
  TIME_ATTACK_MASTER: {
    id: 'time_attack_master',
    name: 'Time Attack Master',
    description: 'Complete Master difficulty in Timer Mode',
    icon: '⏰',
    category: 'time_attack',
    condition: (data) => data.timerMode && data.difficulty === 'master' && (data.timeRemaining ?? 0) > 0
  },
  CLOCK_BEATER: {
    id: 'clock_beater',
    name: 'Clock Beater',
    description: 'Complete 10 games in Timer Mode',
    icon: '🕐',
    category: 'time_attack',
    condition: () => {
      // This will be checked via a separate counter in the points store
      return false; // Handled separately
    }
  },
  DAILY_CHALLENGER: {
    id: 'daily_challenger',
    name: 'Daily Challenger',
    description: 'Complete your first daily challenge',
    icon: '📅',
    category: 'special',
    condition: () => false // Handled in daily challenge store
  },
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Complete 7 daily challenges in a row',
    icon: '🔥',
    category: 'special',
    condition: () => false // Handled in daily challenge store
  },
  MONTHLY_MASTER: {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Complete 30 daily challenges in a row',
    icon: '👑',
    category: 'special',
    condition: () => false // Handled in daily challenge store
  },
  PERFECT_CHALLENGE: {
    id: 'perfect_challenge',
    name: 'Perfect Challenge',
    description: 'Complete a daily challenge meeting all special conditions',
    icon: '✨',
    category: 'special',
    condition: () => false // Handled in daily challenge store
  }
};
