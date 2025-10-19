# 🎖️ XP & Level System

## Overview

The XP & Level System is a comprehensive progression system that tracks player advancement through experience points (XP) and levels. It provides long-term engagement through unlockables, titles, and milestone achievements.

## Features

### 1. Experience Points (XP)

Players earn XP from multiple sources:

- **Game Completion**: Base XP (50) + difficulty multiplier
  - Beginner: 1.0x
  - Easy: 1.2x
  - Medium: 1.5x
  - Hard: 1.8x
  - Expert: 2.2x
  - Master: 2.5x

- **Perfect Game Bonus**: +50 XP (completing within bonus move limit)

- **Combo Bonus**: +5 XP per combo point above 5

- **Achievements**: +100 XP per achievement unlocked

- **Daily Challenges**: +150 XP for completion

- **Daily Login**: +25 XP (with streak bonuses)
  - 7+ day streak: +25 bonus XP
  - 30+ day streak: +50 bonus XP

### 2. Level Progression

- **Starting Level**: 1
- **Progression Curve**: Exponential (BASE_XP * level^1.5)
- **No Level Cap**: Players can level up infinitely

**XP Requirements by Level:**
- Level 1→2: 100 XP
- Level 2→3: 283 XP
- Level 5→6: 1,118 XP
- Level 10→11: 3,162 XP
- Level 25→26: 19,843 XP
- Level 50→51: 56,095 XP
- Level 100→101: 158,489 XP

### 3. Player Titles

Titles are prestigious ranks that unlock at specific levels:

| Title | Level | Color | Description |
|-------|-------|-------|-------------|
| Novice | 1 | Gray | Default title for new players |
| Apprentice | 5 | Blue | Learning the ropes |
| Adept | 10 | Green | Skilled memory player |
| Expert | 25 | Purple | Master of memory |
| Memory Master | 50 | Orange | Elite memory champion |
| Grandmaster | 75 | Red | Legendary status |
| Immortal | 100 | Pink | Peak performance |

- Players can switch between unlocked titles
- Active title is displayed on profile and level badge
- Titles are color-coded for visual distinction

### 4. Unlockables

#### Card Borders
- **Blue Border** - Level 5
- **Green Border** - Level 10
- **Purple Border** - Level 20
- **Gold Border** - Level 30
- **Rainbow Border** - Level 50

#### Card Backs
- **Galaxy Card Back** - Level 15
- **Fire Card Back** - Level 25
- **Ice Card Back** - Level 35
- **Diamond Card Back** - Level 60

### 5. Level Milestone Achievements

Special achievements for reaching level milestones:

- **Rising Star** ⭐ - Level 5
- **Dedicated Player** 🌟 - Level 10
- **Memory Expert** 💫 - Level 25
- **Memory Legend** ✨ - Level 50
- **Memory Master** 🌠 - Level 75
- **Immortal Memory** 👑 - Level 100

### 6. Level Up Rewards

| Level | Rewards |
|-------|---------|
| 5 | Blue Border, Apprentice title |
| 10 | Green Border, Adept title |
| 15 | Galaxy Card Back |
| 20 | Purple Border |
| 25 | Fire Card Back, Expert title |
| 30 | Gold Border |
| 35 | Ice Card Back |
| 50 | Rainbow Border, Memory Master title, Special Badge |
| 60 | Diamond Card Back |
| 75 | Grandmaster title, Special Badge |
| 100 | Immortal title, Special Badge |

## User Interface

### Components

1. **LevelBadge**
   - Displays current level and title
   - Shows in profile and home page
   - Color-coded by title

2. **XPProgressBar**
   - Visual progress to next level
   - Shows current XP / required XP
   - Animated progress bar
   - Available in multiple sizes (sm, md, lg)

3. **DetailedXPProgress**
   - Full progress display with percentage
   - Total XP counter
   - Level and XP remaining information

4. **LevelUpModal**
   - Animated celebration modal
   - Shows new level achieved
   - Displays all unlocked rewards
   - Lists new titles, unlockables, and special rewards
   - Auto-plays level unlock sound

5. **Profile Page** (`/profile`)
   - Complete player statistics
   - Level and XP history
   - Title selection interface
   - Unlockables showcase
   - Next reward preview
   - Login streak tracker
   - XP history chart (last 7 days)

## Technical Implementation

### Store: `useXPStore`

**State:**
- `totalXP`: Lifetime XP earned
- `level`: Current player level
- `currentXP`: XP progress in current level
- `unlockedItems`: Array of unlocked cosmetic IDs
- `currentTitle`: Active title ID
- `unlockedTitles`: Array of unlocked title IDs
- `lastLoginDate`: Last login date for streak tracking
- `loginStreak`: Current consecutive login days
- `xpHistory`: Array of XP gains with timestamps

**Key Methods:**
- `addXP(source)`: Award XP and check for level ups
- `calculate_game_xp(data)`: Calculate XP from game completion
- `check_daily_login()`: Award daily login XP and track streaks
- `setActiveTitle(titleId)`: Change active player title
- `getPlayerLevel()`: Get current level stats
- `getXPHistoryByDay()`: Get XP gains grouped by day

### Integration Points

1. **GameBoard** (`/game`)
   - Awards XP on game completion
   - Bonus XP for achievements
   - Daily challenge XP
   - Shows level up modal

2. **WalletContext**
   - Checks daily login on wallet connect
   - Awards daily login XP automatically

3. **Home Page**
   - Displays level badge
   - Shows XP progress bar
   - Links to profile page

4. **PointsStore Integration**
   - Level milestone achievements unlock automatically
   - Achievement XP awarded on unlock

## Formulas

### XP Calculation
```typescript
// Base game XP
baseXP = 50

// With difficulty
gameXP = baseXP * difficultyMultiplier

// Perfect game bonus
if (isPerfectGame) gameXP += 50

// Combo bonus
if (combo > 5) gameXP += (combo - 5) * 5

// Final XP
totalXP = Math.floor(gameXP)
```

### Level Progression
```typescript
// XP required for next level
xpRequired = Math.floor(100 * Math.pow(level, 1.5))

// Example:
// Level 1: 100 XP
// Level 2: 283 XP
// Level 10: 3,162 XP
```

## Sound Effects

- **Level Up**: Plays when leveling up
- **Level Unlock**: Plays when viewing level up modal

## Storage

All XP data is persisted per wallet address:
- Stored in browser localStorage
- Separate data for each connected wallet
- Automatically syncs on wallet connection
- Survives page refreshes and browser restarts

## Future Enhancements

Potential additions to the system:

1. **Seasonal Rewards**: Special unlockables during events
2. **Prestige System**: Reset level for exclusive rewards
3. **XP Boosters**: Temporary multipliers for XP gain
4. **Leaderboards**: Compare levels with other players
5. **Custom Avatars**: Unlock profile pictures
6. **Battle Pass**: Seasonal progression track
7. **Level Badges**: Visual indicators next to username
8. **XP Multiplier Events**: Double XP weekends

## Best Practices

### For Players
1. Log in daily for streak bonuses
2. Complete daily challenges for maximum XP
3. Maintain combo streaks for bonus XP
4. Aim for perfect games (+50 XP bonus)
5. Unlock achievements for 100 XP each

### For Developers
1. XP amounts are configurable in `XP_CONFIG`
2. Level rewards defined in `LEVEL_REWARDS`
3. Titles and unlockables defined in separate constants
4. Store is independent and can be used anywhere
5. Wallet-specific data prevents cross-contamination

## API Reference

### XP Config Constants

```typescript
XP_CONFIG = {
  BASE_GAME_XP: 50,
  ACHIEVEMENT_XP: 100,
  DAILY_LOGIN_XP: 25,
  DAILY_CHALLENGE_XP: 150,
  PERFECT_GAME_BONUS: 50,
  COMBO_XP_MULTIPLIER: 5,
  DIFFICULTY_MULTIPLIERS: {
    beginner: 1,
    easy: 1.2,
    medium: 1.5,
    hard: 1.8,
    expert: 2.2,
    master: 2.5
  }
}
```

### Level Calculation

```typescript
function calculate_xp_for_level(level: number): number {
  const BASE_XP = 100;
  return Math.floor(BASE_XP * Math.pow(level, 1.5));
}
```

## Changelog

### Version 1.0.0 (Initial Release)
- Complete XP & Level system
- 7 player titles
- 9 unlockable cosmetics
- 6 level milestone achievements
- Daily login tracking with streaks
- Profile page with progression stats
- Level up celebration modal
- XP history tracking
- Wallet-specific persistence

---

Created as part of the Memory Card Game on Stacks blockchain.

