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

// XP & Level System
export interface PlayerLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

export interface XPSource {
  type: 'game_completion' | 'achievement' | 'daily_login' | 'daily_challenge' | 'perfect_game' | 'combo_bonus';
  amount: number;
  description: string;
}

export interface Unlockable {
  id: string;
  type: 'cosmetic' | 'title' | 'border' | 'card_back';
  name: string;
  description: string;
  levelRequired: number;
  icon?: string;
  preview?: string;
}

export interface PlayerTitle {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  color?: string;
}

export interface LevelUpReward {
  level: number;
  unlockables?: string[]; // IDs of unlockables
  title?: string; // Title ID
  specialReward?: string;
}

// XP calculation constants
export const XP_CONFIG = {
  BASE_GAME_XP: 50,
  ACHIEVEMENT_XP: 100,
  DAILY_LOGIN_XP: 25,
  DAILY_CHALLENGE_XP: 150,
  PERFECT_GAME_BONUS: 50,
  COMBO_XP_MULTIPLIER: 5, // XP per combo point above 5
  DIFFICULTY_MULTIPLIERS: {
    beginner: 1,
    easy: 1.2,
    medium: 1.5,
    hard: 1.8,
    expert: 2.2,
    master: 2.5
  } as Record<DifficultyId, number>
} as const;

// Level progression curve - exponential growth
export function calculate_xp_for_level(level: number): number {
  // Formula: base * (level^1.5)
  const BASE_XP = 100;
  return Math.floor(BASE_XP * Math.pow(level, 1.5));
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
  },
  // Level Milestone Achievements
  LEVEL_5: {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    category: 'milestone',
    condition: () => false // Handled in XP store
  },
  LEVEL_10: {
    id: 'level_10',
    name: 'Dedicated Player',
    description: 'Reach Level 10',
    icon: '🌟',
    category: 'milestone',
    condition: () => false // Handled in XP store
  },
  LEVEL_25: {
    id: 'level_25',
    name: 'Memory Expert',
    description: 'Reach Level 25',
    icon: '💫',
    category: 'milestone',
    condition: () => false // Handled in XP store
  },
  LEVEL_50: {
    id: 'level_50',
    name: 'Memory Legend',
    description: 'Reach Level 50',
    icon: '✨',
    category: 'milestone',
    condition: () => false // Handled in XP store
  },
  LEVEL_75: {
    id: 'level_75',
    name: 'Memory Master',
    description: 'Reach Level 75',
    icon: '🌠',
    category: 'milestone',
    condition: () => false // Handled in XP store
  },
  LEVEL_100: {
    id: 'level_100',
    name: 'Immortal Memory',
    description: 'Reach Level 100',
    icon: '👑',
    category: 'milestone',
    condition: () => false // Handled in XP store
  }
};

// Player Titles
export const PLAYER_TITLES: Record<string, PlayerTitle> = {
  NOVICE: {
    id: 'novice',
    name: 'Novice',
    description: 'Default title for new players',
    levelRequired: 1,
    color: '#9ca3af'
  },
  APPRENTICE: {
    id: 'apprentice',
    name: 'Apprentice',
    description: 'Learning the ropes',
    levelRequired: 5,
    color: '#60a5fa'
  },
  ADEPT: {
    id: 'adept',
    name: 'Adept',
    description: 'Skilled memory player',
    levelRequired: 10,
    color: '#34d399'
  },
  EXPERT: {
    id: 'expert',
    name: 'Expert',
    description: 'Master of memory',
    levelRequired: 25,
    color: '#a78bfa'
  },
  MASTER: {
    id: 'master',
    name: 'Memory Master',
    description: 'Elite memory champion',
    levelRequired: 50,
    color: '#f59e0b'
  },
  GRANDMASTER: {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Legendary status',
    levelRequired: 75,
    color: '#ef4444'
  },
  IMMORTAL: {
    id: 'immortal',
    name: 'Immortal',
    description: 'Peak performance',
    levelRequired: 100,
    color: '#ec4899'
  }
};

// Unlockables
export const UNLOCKABLES: Record<string, Unlockable> = {
  BLUE_BORDER: {
    id: 'blue_border',
    type: 'border',
    name: 'Blue Border',
    description: 'A cool blue card border',
    levelRequired: 5,
    icon: '🔵'
  },
  GREEN_BORDER: {
    id: 'green_border',
    type: 'border',
    name: 'Green Border',
    description: 'An energetic green card border',
    levelRequired: 10,
    icon: '🟢'
  },
  PURPLE_BORDER: {
    id: 'purple_border',
    type: 'border',
    name: 'Purple Border',
    description: 'A majestic purple card border',
    levelRequired: 20,
    icon: '🟣'
  },
  GOLD_BORDER: {
    id: 'gold_border',
    type: 'border',
    name: 'Gold Border',
    description: 'A prestigious gold card border',
    levelRequired: 30,
    icon: '🟡'
  },
  RAINBOW_BORDER: {
    id: 'rainbow_border',
    type: 'border',
    name: 'Rainbow Border',
    description: 'A dazzling rainbow card border',
    levelRequired: 50,
    icon: '🌈'
  },
  GALAXY_BACK: {
    id: 'galaxy_back',
    type: 'card_back',
    name: 'Galaxy Card Back',
    description: 'Cosmic design for your cards',
    levelRequired: 15,
    icon: '🌌'
  },
  FIRE_BACK: {
    id: 'fire_back',
    type: 'card_back',
    name: 'Fire Card Back',
    description: 'Blazing hot card design',
    levelRequired: 25,
    icon: '🔥'
  },
  ICE_BACK: {
    id: 'ice_back',
    type: 'card_back',
    name: 'Ice Card Back',
    description: 'Cool and frosty card design',
    levelRequired: 35,
    icon: '❄️'
  },
  DIAMOND_BACK: {
    id: 'diamond_back',
    type: 'card_back',
    name: 'Diamond Card Back',
    description: 'Luxurious diamond-studded design',
    levelRequired: 60,
    icon: '💎'
  }
};

// Level up rewards mapping
export const LEVEL_REWARDS: Record<number, LevelUpReward> = {
  5: { level: 5, unlockables: ['blue_border'], title: 'apprentice' },
  10: { level: 10, unlockables: ['green_border'], title: 'adept' },
  15: { level: 15, unlockables: ['galaxy_back'] },
  20: { level: 20, unlockables: ['purple_border'] },
  25: { level: 25, unlockables: ['fire_back'], title: 'expert' },
  30: { level: 30, unlockables: ['gold_border'] },
  35: { level: 35, unlockables: ['ice_back'] },
  50: { level: 50, unlockables: ['rainbow_border'], title: 'master', specialReward: 'Special Badge: Memory Legend' },
  60: { level: 60, unlockables: ['diamond_back'] },
  75: { level: 75, title: 'grandmaster', specialReward: 'Special Badge: Memory Master' },
  100: { level: 100, title: 'immortal', specialReward: 'Special Badge: Immortal Memory' }
};
