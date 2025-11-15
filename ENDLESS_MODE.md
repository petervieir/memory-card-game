# 🌊 Endless Mode Feature

## Overview

Endless Mode is a challenging game mode where players progress through all difficulty levels with increasing complexity. Players have **3 lives** - make 3 mistakes and it's game over!

## Key Features

### 1. Progressive Difficulty System
- **Starts at Beginner**: All players begin at the easiest level
- **Auto-Advance**: Complete a level to automatically move to the next difficulty
- **6 Difficulty Levels**: Beginner → Easy → Medium → Hard → Expert → Master

### 2. Lives System
- **3 Lives Total**: Players start with 3 lives
- **Lose a Life**: Each incorrect card match costs 1 life
- **Game Over**: When all 3 lives are lost, the endless run ends
- **Visual Feedback**: Lives are prominently displayed in the game UI

### 3. Cumulative Scoring
- **Points Accumulate**: Score from each completed level adds to your total
- **Level Bonuses**: Higher difficulties award more points
- **Combo Multipliers**: Maintain combos across levels for bonus multipliers
- **Final Score**: Displayed when the run ends (either by losing all lives or completing all levels)

### 4. Endless Champion Leaderboard
- **Top 10 Display**: Shows the highest scores from all players
- **Personal Best**: Track your best endless mode score
- **Detailed Stats**: 
  - Total score
  - Levels completed
  - Highest difficulty reached
  - Timestamp
- **Wallet-Based**: Scores are tied to connected wallet addresses

## Gameplay Flow

1. **Start Endless Mode**
   - Navigate to `/endless` page
   - Click "Start Endless Mode" button
   - Redirected to game with `?mode=endless` parameter

2. **Play Through Levels**
   - Complete levels to advance
   - Manage your 3 lives carefully
   - Watch mistakes - each non-match costs a life!
   - Score accumulates across all levels

3. **Game End Conditions**
   - **Victory**: Complete all 6 difficulties (Master level)
   - **Defeat**: Lose all 3 lives

4. **Post-Game**
   - Score is saved to leaderboard
   - Personal best is updated (if applicable)
   - Achievements are unlocked
   - View your rank on the leaderboard

## New Achievements

Eight new achievements specifically for Endless Mode:

| Achievement | Icon | Description |
|------------|------|-------------|
| **Endless Explorer** | 🌊 | Complete your first endless mode run |
| **Endless Survivor** | 🛡️ | Reach level 3 in endless mode |
| **Endless Warrior** | ⚔️ | Reach level 5 in endless mode |
| **Endless Champion** | 👑 | Complete all 6 difficulties in endless mode |
| **Endless High Scorer** | 💎 | Score 1000+ points in a single endless mode run |
| **Endless Legend** | 🔱 | Score 2500+ points in a single endless mode run |
| **Clutch Player** | 💪 | Complete an endless level with only 1 life remaining |
| **Perfect Endless Level** | ✨ | Complete an endless level without losing any lives |

## Technical Implementation

### New Store: `useEndlessModeStore`

```typescript
// Location: front-end/src/stores/useEndlessModeStore.ts

interface EndlessRunState {
  isActive: boolean;
  currentDifficultyIndex: number;
  livesRemaining: number;
  cumulativeScore: number;
  levelsCompleted: number;
  mistakesMade: number;
  startedAt: number;
}

interface EndlessLeaderboardEntry {
  id: string;
  walletAddress: string;
  score: number;
  levelsCompleted: number;
  highestDifficulty: DifficultyId;
  timestamp: number;
}
```

**Key Functions:**
- `start_endless_mode()`: Initialize a new endless run
- `advance_to_next_level(levelScore)`: Move to next difficulty and add score
- `record_mistake()`: Reduce lives by 1
- `end_endless_mode(finalScore)`: End run and save to leaderboard
- `check_endless_achievements()`: Check and return unlocked achievements

### Updated Components

1. **GameBoard.tsx**
   - Added endless mode detection via URL parameter `?mode=endless`
   - Integrated lives tracking
   - Auto-advance logic on level completion
   - Mistake tracking (non-matches reduce lives)
   - Special UI display for endless mode stats
   - Achievement unlocking integration

2. **New Page: /endless**
   - How to play instructions
   - Difficulty progression display
   - Personal best showcase
   - Top 10 leaderboard
   - Start/Continue game buttons
   - Wallet connection requirement

3. **Home Page (page.tsx)**
   - Added new card linking to `/endless` mode
   - Styled with cyan gradient and "NEW" badge
   - Positioned prominently in game mode grid

### Game Types Updates

**Added Endless Category:**
- New achievement category: `'endless'`
- 8 new achievement definitions
- Updated `getAchievementProgress()` to include endless category

## UI/UX Features

### In-Game Display
```
🌊 ENDLESS MODE - Level 3
❤️ Lives: 2  🏆 Score: 750  😤 Hard - 42 moves
```

### Visual Feedback
- **Life Lost**: Red toast notification with remaining lives
- **Level Complete**: Success toast with score and next difficulty
- **Game Over**: Large notification with final score
- **Achievement Unlocked**: Achievement badge animation

### Leaderboard Design
- Top 3 get medal emojis (🥇🥈🥉)
- Current user highlighted in blue
- Score prominently displayed
- Detailed stats per entry
- Responsive grid layout

## User Journey

### New Player
1. See "Endless Mode" card on home page with NEW badge
2. Click to visit endless mode page
3. Read instructions and see difficulty progression
4. Connect wallet (required)
5. Click "Start Endless Mode"
6. Play through beginner level carefully
7. Advance or game over based on performance

### Returning Player
1. Navigate to endless page
2. See personal best displayed
3. View leaderboard position
4. Start new run or continue existing run
5. Attempt to beat personal best
6. Climb the leaderboard

## Storage & Persistence

- **Zustand Store**: Persistent storage via localStorage
- **Wallet-Based**: All data tied to connected wallet
- **Leaderboard**: Top 100 scores stored per wallet
- **Current Run**: Saved and can be continued later
- **Personal Best**: Automatically updated on new high scores

## Navigation

- **Home → Endless**: Click "Endless Mode" card
- **Endless → Game**: Click "Start/Continue" button
- **Game → Endless**: Automatic redirect after run ends
- **Endless → Home**: "Back to Home" button

## Future Enhancements (Optional)

Potential additions for future updates:

1. **Global Leaderboard**: Merge leaderboards across all users
2. **Weekly Challenges**: Special endless mode variants
3. **Life Powerups**: Ability to earn extra lives
4. **Difficulty Modifiers**: Speed mode, memory mode, etc.
5. **Endless Streaks**: Track consecutive successful runs
6. **Social Sharing**: Share high scores and achievements
7. **Endless Mode Stats**: Dedicated stats page for endless metrics

## Testing Checklist

- [ ] Endless mode starts at Beginner difficulty
- [ ] Lives decrease on incorrect matches
- [ ] Game ends when 0 lives remain
- [ ] Score accumulates across levels
- [ ] Auto-advance to next difficulty on completion
- [ ] Leaderboard updates after run ends
- [ ] Personal best updates when score is higher
- [ ] Achievements unlock correctly
- [ ] Can continue interrupted run
- [ ] UI displays correct stats (lives, score, level)
- [ ] Toast notifications appear at right times
- [ ] Page navigation works correctly

## Code Locations

- **Store**: `front-end/src/stores/useEndlessModeStore.ts`
- **Page**: `front-end/src/app/endless/page.tsx`
- **Game Logic**: `front-end/src/components/game/GameBoard.tsx`
- **Types**: `front-end/src/types/game.ts`
- **Home Link**: `front-end/src/app/page.tsx`

## Summary

Endless Mode adds significant replayability to the Memory Card Game by introducing:
- Progressive difficulty with high stakes
- Lives system that punishes mistakes
- Competitive leaderboard
- New achievements to unlock
- Clear progression path for players

The mode is fully integrated with existing systems (wallet, points, achievements, stats) and provides a cohesive experience that encourages players to improve their memory skills and compete for the top spot on the leaderboard.

**Play URL**: `/endless` or click the "🌊 Endless Mode" card on the home page!

