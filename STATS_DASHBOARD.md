# Personal Statistics Dashboard

## Overview
A comprehensive statistics dashboard that tracks player performance metrics, progress over time, and detailed game history. This feature provides players with insights into their gameplay patterns and helps them track their improvement.

## Features Implemented

### 1. Game Statistics Store (`useStatsStore`)
- **Location**: `front-end/src/stores/useStatsStore.ts`
- **Purpose**: Centralized state management for game statistics and history
- **Features**:
  - Individual game record tracking with detailed metadata
  - Per-wallet statistics isolation
  - Difficulty-specific statistics calculation
  - Move efficiency tracking over time
  - Play time tracking for timer mode games

### 2. Statistics Dashboard Page
- **Location**: `front-end/src/app/stats/page.tsx`
- **Route**: `/stats`
- **Components**:

#### Overview Statistics Cards
- **Total Games Played**: Shows total games and number won
- **Win Rate**: Percentage with quality indicator (Excellent/Good/Keep practicing)
- **Achievement Completion**: Progress toward unlocking all achievements
- **Total Points Earned**: Lifetime points with favorite difficulty
- **Total Play Time**: Tracked from timer mode games

#### Per-Difficulty Statistics
For each difficulty level (Beginner through Master):
- Games played count
- Win rate percentage
- Average moves per game
- Best moves record
- Best score achieved
- Best completion time (for timer mode)

#### Move Efficiency Graph
- Visual bar chart showing move efficiency over time
- Displays last 20 games played
- Shows running average trend line
- Helps players track improvement
- Can be filtered by difficulty

#### Recent Games Table
- Last 5 games played
- Shows difficulty, result, moves, score, and date
- Quick overview of recent performance

#### Achievement Breakdown
- Visual breakdown of achievements by category:
  - Efficiency achievements (⚡)
  - Mastery achievements (🎯)
  - Milestone achievements (🎮)
  - Special achievements (⭐)
  - Time Attack achievements (⏱️)

### 3. Game History Recording
**Updated**: `front-end/src/components/game/GameBoard.tsx`

The GameBoard component now records detailed game history:
- Every completed game is saved with:
  - Difficulty level
  - Move count
  - Score earned
  - Hints used
  - Highest combo achieved
  - Timer mode status
  - Time remaining/total time
  - Completion status (won/lost)

Failed games (time runs out) are also recorded with:
- Zero score
- Incomplete status
- All other metrics captured

### 4. Navigation Integration
Navigation links added to:
- **Home Page** (`/`): New statistics card in main navigation grid
- **Game Page** (`/game`): Quick link in header navigation
- **Achievements Page** (`/achievements`): Link in action buttons
- **Statistics Page** (`/stats`): Links back to game and achievements

## Data Structure

### GameRecord Interface
```typescript
interface GameRecord {
  id: string;              // Unique identifier
  timestamp: number;       // Unix timestamp
  difficulty: DifficultyId;
  moves: number;
  score: number;
  hintsUsed: number;
  combo: number;
  timerMode: boolean;
  timeRemaining?: number;
  totalTime?: number;
  completed: boolean;      // true = won, false = lost
}
```

### DifficultyStats Interface
```typescript
interface DifficultyStats {
  gamesPlayed: number;
  gamesWon: number;
  totalMoves: number;
  totalScore: number;
  bestMoves: number;
  bestScore: number;
  bestTime?: number;
  averageMoves: number;
  winRate: number;
}
```

### OverallStats Interface
```typescript
interface OverallStats {
  totalGamesPlayed: number;
  totalGamesWon: number;
  winRate: number;
  totalPlayTime: number;      // In seconds
  favoriteDifficulty: DifficultyId | null;
  achievementCompletionRate: number;
}
```

## User Experience

### Empty State
When a player hasn't played any games yet, the statistics page shows:
- Friendly message encouraging first game
- Large "Play Now" button
- Clear call-to-action

### Data Visualization
- **Color-coded performance indicators**:
  - Green: Excellent performance (80%+ win rate)
  - Yellow: Good performance (50-80% win rate)
  - Gray: Room for improvement (<50% win rate)
  
- **Trend indicators**:
  - ↑ Positive trend
  - ↓ Negative trend
  - • Neutral trend

### Responsive Design
- Mobile-friendly layout
- Grid adapts from 1 column (mobile) to 4 columns (desktop)
- Touch-friendly interactive elements
- Readable typography at all screen sizes

## Technical Implementation

### State Management
- Uses Zustand for state management
- Persistent storage via localStorage
- Automatic wallet-specific data isolation
- SSR-compatible with safe storage wrappers

### Performance Optimizations
- Efficient data aggregation
- Memoized statistics calculations
- Optimized rendering with proper keys
- Minimal re-renders with selective state updates

### Data Persistence
- All game statistics persist across sessions
- Separate statistics per wallet address
- Automatic synchronization on wallet connect/disconnect
- No data loss on page refresh

## Future Enhancements

Potential improvements for future versions:
1. **Exportable Reports**: Download statistics as CSV/PDF
2. **Comparison Mode**: Compare stats across different time periods
3. **Goal Setting**: Set personal targets and track progress
4. **Advanced Graphs**: More detailed charts with filtering options
5. **Leaderboard Integration**: Compare with other players
6. **Streak Tracking**: Track consecutive wins/play days
7. **Time-based Analytics**: Statistics by day/week/month
8. **Performance Predictions**: AI-based difficulty recommendations

## Usage Example

```typescript
// Import the stats store
import { useStatsStore } from '@/stores/useStatsStore';

// In a component
const { 
  addGameRecord,
  getOverallStats,
  getDifficultyStats,
  getMoveEfficiencyData 
} = useStatsStore();

// Record a game
addGameRecord({
  difficulty: 'medium',
  moves: 45,
  score: 1250,
  hintsUsed: 1,
  combo: 8,
  timerMode: false,
  completed: true
});

// Get overall statistics
const stats = getOverallStats();
console.log(`Total games: ${stats.totalGamesPlayed}`);
console.log(`Win rate: ${stats.winRate.toFixed(1)}%`);

// Get difficulty-specific stats
const mediumStats = getDifficultyStats('medium');
console.log(`Medium average moves: ${mediumStats.averageMoves}`);
```

## Testing

To test the statistics dashboard:

1. **Start the development server**:
   ```bash
   cd front-end
   npm run dev
   ```

2. **Connect a wallet** at http://localhost:3000

3. **Play several games** with different:
   - Difficulty levels
   - Timer mode on/off
   - Various performance levels (wins/losses)

4. **Navigate to Statistics** at http://localhost:3000/stats

5. **Verify**:
   - All games are recorded correctly
   - Statistics calculate properly
   - Graphs display accurately
   - Navigation works smoothly
   - Data persists after refresh

## Integration Points

### Existing Systems
- **Points Store**: Integrates with achievement tracking
- **Difficulty Store**: Uses difficulty progression data
- **Timer Store**: Tracks timer mode games
- **Wallet Context**: Wallet-specific data isolation

### New Dependencies
- None! Uses existing project dependencies

## Code Quality

- ✅ TypeScript strict mode compliant
- ✅ ESLint warnings resolved
- ✅ Follows project coding conventions
- ✅ Snake_case for functions (as per project style)
- ✅ CamelCase for variables
- ✅ Proper component structure
- ✅ Accessible UI components

## Files Created/Modified

### New Files
- `front-end/src/stores/useStatsStore.ts` - Statistics store
- `front-end/src/app/stats/page.tsx` - Statistics dashboard page
- `STATS_DASHBOARD.md` - This documentation

### Modified Files
- `front-end/src/components/game/GameBoard.tsx` - Added game recording
- `front-end/src/app/page.tsx` - Added stats navigation link
- `front-end/src/app/game/page.tsx` - Added stats navigation link
- `front-end/src/app/achievements/page.tsx` - Added stats navigation link

## Summary

The Personal Statistics Dashboard provides comprehensive performance tracking and analytics for Memory Card Game players. It encourages engagement through clear visualization of progress, helps players improve through detailed statistics, and maintains separate profiles for different wallets. The implementation is performant, persistent, and seamlessly integrated with the existing game systems.

