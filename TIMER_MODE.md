# Timer Mode Feature

## Overview
Timer Mode adds an optional time-based gameplay mode to the Memory Card Game, increasing replayability and challenge variety. Players can toggle between classic mode (no time limit) and timer mode (countdown timer with bonus points).

## Features Implemented

### 1. ⏱️ Timer Countdown
- Dynamic timer based on difficulty level:
  - **Beginner**: 60 seconds
  - **Easy**: 90 seconds
  - **Medium**: 100 seconds
  - **Hard**: 110 seconds
  - **Expert**: 120 seconds
  - **Master**: 120 seconds
- Visual countdown display with color-coded progress bar
- Timer stops when game is complete or time runs out

### 2. 🎯 Time Bonus Points
- Players earn **2 points per second** remaining when completing the game
- Time bonus is added before combo multiplier application
- Calculation: `(basePoints + efficiencyBonus + timeBonus) × comboMultiplier × difficultyMultiplier`
- Time bonus only applies when timer mode is enabled and game is completed before time runs out

### 3. 🏆 Time Attack Achievements
Five new achievements added in the "Time Attack" category:

| Achievement | Icon | Description | Condition |
|------------|------|-------------|-----------|
| **Time Attack Winner** | ⏱️ | Complete a game in Timer Mode | Complete any game with timer enabled |
| **Speed Demon** | ⚡ | Complete Timer Mode with 50%+ time remaining | Finish with at least half the time left |
| **Last Second Hero** | 😰 | Complete Timer Mode with <10s remaining | Clutch victory in the final seconds |
| **Time Attack Master** | ⏰ | Complete Master difficulty in Timer Mode | Beat the hardest level against the clock |
| **Clock Beater** | 🕐 | Complete 10 games in Timer Mode | Long-term timer mode dedication |

### 4. 🔄 Classic/Timed Mode Toggle
- Easy-to-use toggle button in the difficulty selector screen
- Visual indication when timer mode is active (⏱️ icon in game stats)
- Clear description of current mode
- Setting persists across sessions using Zustand persist middleware

### 5. 🔊 Timer Sound Effects
- **Warning Sound** (20s remaining): Alerts player time is running low
- **Critical Sound** (10s remaining): Urgent warning with toast notification
- **Time Up Sound**: Plays when timer reaches zero
- Sounds only play once per threshold to avoid repetition

### 6. ⚠️ Time's Up Handling
- Game becomes unplayable when time runs out
- Cards are disabled (cannot be clicked)
- No points awarded for incomplete games
- Clear visual feedback showing "Time's Up" message
- Shows progress: how many pairs were completed out of total
- Auto-returns to difficulty selector after 3 seconds

## Technical Implementation

### New Components

#### `Timer.tsx`
Reusable timer component with:
- Countdown functionality
- Color-coded display (green → yellow → orange → red)
- Progress bar visualization
- Callback support for tick and time-up events
- Time formatting (MM:SS)

### New Stores

#### `useTimerStore.ts`
Manages timer mode preference:
- Persisted setting using Zustand persist
- `timerEnabled`: boolean state
- `toggle_timer()`: Toggle timer mode on/off
- `enable_timer()`: Enable timer mode
- `disable_timer()`: Disable timer mode

### Updated Stores

#### `usePointsStore.ts`
- Added `timerModeGamesPlayed` counter
- Updated `incrementGamesPlayed()` to track timer mode games separately
- Modified achievement checking to handle "Clock Beater" achievement
- Added `time_attack` category support

#### `useDifficultyStore.ts`
No changes required - difficulty progression works the same for both modes.

### Updated Types

#### `game.ts`
Extended types to support timer mode:

```typescript
interface Difficulty {
  // ... existing fields
  timerSeconds: number; // Time limit for this difficulty
}

interface GameCompletionData {
  // ... existing fields
  timerMode: boolean; // Whether timer was enabled
  timeRemaining?: number; // Seconds left when completed
  totalTime?: number; // Total time available
}

type AchievementCategory = 'moves' | 'difficulty' | 'milestone' | 'special' | 'time_attack';
```

### Sound Effects

Added three new sound effect types:
- `timer_warning`: Plays at 20 seconds
- `timer_critical`: Plays at 10 seconds
- `time_up`: Plays when time expires

*Note: Currently using placeholder sounds (card-mismatch.mp3). Custom timer sounds can be added to `/public/sounds/` directory.*

## User Experience

### Difficulty Selector Screen
- Prominent timer mode toggle button with clear visual states
- Contextual description explaining current mode
- Orange highlight when timer mode is active
- Sound feedback on toggle

### During Gameplay
- Timer display in the top-right corner of game stats bar
- Color-coded timer (green → yellow → orange → red)
- Progress bar showing time remaining visually
- "HURRY!" message appears when <10 seconds remain
- Timer icon (⏱️) shown in difficulty name when active

### Game Completion
#### Success (Timer Mode)
- Shows total points including time bonus breakdown
- Example: "Time Bonus: 40 pts (20s left)"
- All other bonuses (efficiency, combo) still apply

#### Time's Up
- Red-themed message box
- Clear "Time's Up!" heading
- Shows partial progress
- No points awarded
- Returns to selector after 3 seconds

## Points Calculation Example

**Scenario**: Medium difficulty, Timer Mode, completed in 35 moves with 25 seconds remaining, 5x combo

```
Base Points:         200
Efficiency Bonus:    +50  (45 - 35 = 10 moves × 5 points)
Time Bonus:          +50  (25 seconds × 2 points)
Subtotal:            300
Combo Multiplier:    ×1.5 (5x combo)
After Combo:         450
Difficulty Mult:     ×1.5 (Medium)
Final Score:         675 points
```

## Statistics Tracking

Timer mode games are tracked separately:
- Total games played (all modes)
- Timer mode games played (separate counter)
- Both tracked per wallet address
- Used for "Clock Beater" achievement

## Future Enhancements

Potential improvements for future versions:
1. Custom timer sounds (tick-tock, warning beeps, alarm)
2. Timer mode leaderboards
3. Speed run mode (minimize time instead of moves)
4. Time attack tournaments/events
5. Adjustable time limits (easy/medium/hard timer settings)
6. Time penalties for wrong matches
7. Time bonuses for perfect moves
8. Daily timer challenges

## Testing Checklist

- [x] Timer starts when game begins with timer mode enabled
- [x] Timer counts down correctly (1 second intervals)
- [x] Timer stops when game completes
- [x] Time bonus calculated correctly
- [x] Time's up ends game appropriately
- [x] Cards become unclickable after time's up
- [x] Sound effects play at correct thresholds
- [x] Timer persists setting across page refreshes
- [x] Achievements unlock correctly
- [x] Classic mode unaffected when timer disabled
- [x] UI updates appropriately for both modes
- [x] Time bonus shown in completion message
- [x] Timer display colors change appropriately

## Migration Notes

**Backwards Compatibility**: 
- Existing player progress is preserved
- Timer mode defaults to OFF for existing players
- All existing achievements remain unlocked
- Classic mode scoring unchanged

**New Players**:
- Timer mode is OFF by default
- Can be enabled at any time from difficulty selector
- Setting persists across sessions

## Code Files Modified

### Created
- `/front-end/src/components/game/Timer.tsx`
- `/front-end/src/stores/useTimerStore.ts`
- `/TIMER_MODE.md`

### Modified
- `/front-end/src/components/game/GameBoard.tsx`
- `/front-end/src/components/game/DifficultySelector.tsx`
- `/front-end/src/stores/usePointsStore.ts`
- `/front-end/src/hooks/useSoundEffects.ts`
- `/front-end/src/types/game.ts`

## Summary

The Timer Mode feature successfully adds a new dimension to gameplay without disrupting the existing experience. Players can choose their preferred playstyle, and the achievement system encourages trying both modes. The implementation is clean, performant, and follows the existing codebase patterns.

