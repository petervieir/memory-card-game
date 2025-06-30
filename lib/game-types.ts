// Game state types
export interface GameCard {
  id: number
  tokenId: number
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
  metadata?: NFTMetadata
}

export interface NFTMetadata {
  name: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

// Enhanced game state with pause functionality
export interface GameState {
  cards: GameCard[]
  moves: number
  matches: number
  timer: number
  isPlaying: boolean
  isPaused: boolean
  flippedCards: number[]
  gameStarted: boolean
  difficulty: DifficultyLevel
}

export interface GameStats {
  totalGames: number
  bestScore: number
  averageMoves: number
  totalMatches: number
}

// New types for difficulty levels
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface DifficultyConfig {
  level: DifficultyLevel
  name: string
  gridSize: number
  pairsCount: number
  gridCols: number
  description: string
  icon: string
}

// New types for leaderboard and player stats
export interface PlayerStats {
  bestMoves: number
  bestTime: number
  totalGames: number
  totalWins: number
}

export interface LeaderboardEntry {
  player: string
  bestMoves: number
  bestTime: number
  totalGames: number
  totalWins: number
}

export interface GameResult {
  id: string
  moves: number
  timeSeconds: number
  completed: boolean
  timestamp: number
  score: number // calculated score based on moves and time
  difficulty: DifficultyLevel
}

export interface GaiaGameHistory {
  results: GameResult[]
  totalGames: number
  bestMoves: number
  bestTime: number
  averageMoves: number
}

// Game configuration with multiple difficulty levels
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    level: 'easy',
    name: 'Easy',
    gridSize: 16,
    pairsCount: 8,
    gridCols: 4,
    description: '4×4 grid, 8 pairs',
    icon: '🟢'
  },
  medium: {
    level: 'medium',
    name: 'Medium', 
    gridSize: 36,
    pairsCount: 18,
    gridCols: 6,
    description: '6×6 grid, 18 pairs',
    icon: '🟡'
  },
  hard: {
    level: 'hard',
    name: 'Hard',
    gridSize: 64,
    pairsCount: 32,
    gridCols: 8,
    description: '8×8 grid, 32 pairs', 
    icon: '🔴'
  }
} as const

export const GAME_CONFIG = {
  FLIP_DELAY: 1000, // ms to show cards before hiding
  MATCH_DELAY: 500, // ms to show match before hiding
  MAX_HISTORY_ENTRIES: 10, // Store last 10 games in Gaia
  DEFAULT_DIFFICULTY: 'easy' as DifficultyLevel,
} as const 