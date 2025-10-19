# Daily Challenges Feature

## Overview

The Daily Challenges feature provides players with a new special challenge each day, encouraging daily engagement and habit formation. Players can complete challenges to earn bonus rewards and build streaks for additional achievements.

## Features

### 📅 Daily Challenge Generation
- **Deterministic Seeding**: Each day's challenge uses a deterministic seed based on the date, ensuring all players get the same challenge
- **Random Difficulty**: Challenges can be any difficulty level from Beginner to Master
- **Pre-seeded Card Layouts**: Card positions are deterministic for fair competition
- **Varied Conditions**: Each challenge has a unique special condition to meet

### 🎯 Special Conditions

Challenges can have one of the following special conditions:

1. **Max Moves** - Complete the game in X moves or fewer
2. **Timer** - Complete within X seconds
3. **No Hints** - Complete without using any hints
4. **Perfect Accuracy** - Maintain X% accuracy or higher
5. **Combo Streak** - Achieve a combo streak of X matches

### 💰 Bonus Rewards

- **Base Completion**: Earn points for completing the challenge
- **Condition Bonus**: Earn additional bonus points (500-3000+) if you meet the special condition
- **Multiplier**: Bonus points scale with difficulty level

### 🔥 Streak Tracking

Build consecutive day streaks to unlock special achievements:

- **Current Streak**: Days completed in a row
- **Longest Streak**: Your best streak ever
- **Total Challenges**: All challenges completed
- **Streak Milestones**: 3, 7, 14, and 30-day markers

### 🏆 Challenge Achievements

Special achievements for daily challenges:

- **Daily Challenger** (📅) - Complete your first daily challenge
- **Week Warrior** (🔥) - Complete 7 daily challenges in a row
- **Monthly Master** (👑) - Complete 30 daily challenges in a row
- **Perfect Challenge** (✨) - Complete a challenge meeting all special conditions

## Implementation Details

### Architecture

#### Types (`/front-end/src/types/game.ts`)
```typescript
interface DailyChallenge {
  id: string;                      // Format: 'challenge-YYYY-MM-DD'
  date: string;                    // Format: 'YYYY-MM-DD'
  difficulty: DifficultyId;
  specialCondition: ChallengeCondition;
  bonusPoints: number;
  seed: number;                    // For deterministic card layout
  description: string;
}

interface ChallengeCondition {
  type: 'max_moves' | 'timer' | 'no_hints' | 'perfect_accuracy' | 'combo_streak';
  requirement: number;
  description: string;
}

interface DailyChallengeCompletion {
  challengeId: string;
  completed: boolean;
  completedAt?: Date;
  moves: number;
  score: number;
  conditionMet: boolean;
}

interface ChallengeStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalChallengesCompleted: number;
}
```

#### Store (`/front-end/src/stores/useDailyChallengeStore.ts`)

The store manages:
- Challenge generation based on date
- Completion tracking per wallet
- Streak calculation and management
- Achievement unlocking
- Persistent storage across sessions

Key functions:
- `generateDailyChallenge()` - Creates a deterministic challenge for today
- `getTodayChallenge()` - Gets or generates today's challenge
- `completeChallenge()` - Records completion and awards achievements
- `updateStreak()` - Calculates and updates streak counters

#### Components

**DailyChallengeCard** (`/front-end/src/components/game/DailyChallengeCard.tsx`)
- Displays challenge details (difficulty, condition, rewards)
- Shows completion status
- Provides "Start Challenge" button
- Shows stats for completed challenges

**StreakTracker** (`/front-end/src/components/game/StreakTracker.tsx`)
- Displays current streak, best streak, and total challenges
- Shows milestone progress (3, 7, 14, 30 days)
- Provides motivational messages based on progress
- Visual indicators for achieved milestones

#### Pages

**Challenge Page** (`/front-end/src/app/challenges/page.tsx`)
- Main hub for daily challenges
- Shows today's challenge
- Displays streak tracking
- Provides information about how challenges work
- Showcases challenge achievements

#### Game Integration

**GameBoard Modifications** (`/front-end/src/components/game/GameBoard.tsx`)

The GameBoard component was enhanced to support daily challenge mode:

1. **URL Parameters**: Detects `?mode=daily-challenge&challengeId=...`
2. **Deterministic Seeding**: Uses seeded random for card selection and shuffling
3. **Auto-difficulty**: Sets difficulty from challenge, skips difficulty selector
4. **Condition Checking**: Evaluates special conditions on completion
5. **Bonus Awarding**: Grants bonus points when conditions are met
6. **Challenge Completion**: Records completion and unlocks achievements

### Seeded Random Generation

```typescript
function create_seeded_random(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
```

This ensures:
- Same challenge for all players each day
- Fair competition
- Reproducible card layouts
- Deterministic shuffling

### Wallet Integration

Daily challenges are wallet-specific:
- Each wallet has its own completion history
- Streaks are tracked per wallet
- Achievements are wallet-bound
- Data persists across sessions

### Navigation Updates

Added daily challenges to navigation:
- **Home Page**: Featured card with "NEW" badge
- **Game Page**: Quick link in header
- **Challenge Page**: Links to other game modes

## User Flow

### First Time User

1. **Home Page**: See "Daily Challenges" card with NEW badge
2. **Click Card**: Navigate to challenges page
3. **Connect Wallet**: Required to participate
4. **View Challenge**: See today's difficulty, condition, and rewards
5. **Start Challenge**: Click "Start Challenge" button
6. **Play Game**: Auto-starts with predetermined difficulty and cards
7. **Complete**: Game ends, checks condition, awards points
8. **Celebrate**: See completion message, bonus points (if earned)
9. **Track Progress**: View updated streak and achievement unlocks

### Returning User

1. **Navigate to Challenges**: From any page
2. **Check Status**: See if today's challenge is completed
3. **View Streak**: Monitor current streak and progress to next milestone
4. **Play Challenge**: If not completed, start the challenge
5. **Check Achievements**: View unlocked challenge achievements

## Design Decisions

### Why Deterministic Seeding?
- Ensures fairness - all players face the same challenge
- Enables global leaderboards (future feature)
- Prevents gaming the system by restarting
- Creates shared experience among players

### Why Daily Reset?
- Encourages daily engagement
- Prevents burnout from too many challenges
- Creates anticipation for new challenges
- Allows time for players to complete challenges

### Why Streak Tracking?
- Builds habits and routine
- Provides long-term goals
- Rewards consistent engagement
- Creates sense of accomplishment

### Why Special Conditions?
- Adds variety to challenges
- Increases difficulty and skill requirement
- Provides meaningful bonus rewards
- Keeps gameplay interesting

## Future Enhancements

Potential additions to the feature:

1. **Global Leaderboard**: Compare scores with other players on same daily challenge
2. **Challenge History**: View past challenges and completions
3. **Challenge Tiers**: Bronze/Silver/Gold based on performance
4. **Social Sharing**: Share challenge completions on social media
5. **Weekly Challenges**: Longer, more complex challenges
6. **Challenge Packs**: Themed series of challenges
7. **Custom Challenges**: Create and share challenges with friends
8. **Speed Run Mode**: Compete for fastest completion time
9. **Challenge Replay**: Replay past challenges for practice
10. **Multi-day Events**: Special events spanning multiple days

## Testing Recommendations

### Unit Tests
- Challenge generation with fixed dates
- Seeded random number generation
- Streak calculation logic
- Condition checking for all types
- Achievement unlock triggers

### Integration Tests
- Complete flow from challenge page to game completion
- Wallet switching maintains separate data
- Streak updates correctly across days
- Bonus points awarded when conditions met
- Achievement notifications display properly

### Manual Testing
- Test all special condition types
- Verify deterministic card layout
- Check streak calculation edge cases
- Test wallet switching
- Verify achievement unlocks
- Test navigation flow

## Analytics & Metrics

Track these metrics to measure success:

- Daily Active Users (DAU)
- Challenge Completion Rate
- Average Streak Length
- Condition Success Rate
- Time to Complete Challenge
- Return Rate (next day engagement)
- Achievement Unlock Rate

## Conclusion

The Daily Challenges feature adds a compelling reason for players to return daily, creates a sense of progression through streaks, and provides additional rewards for skilled play. The deterministic seeding ensures fair competition while maintaining the fun and challenge of the memory card game.

