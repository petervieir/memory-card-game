# Game Features

Complete guide to all features in the Memory Card Game.

## Core Gameplay

### Memory Card Matching
- Match **trios** of identical cards (3 cards per match)
- 6 difficulty levels: Beginner → Intermediate → Advanced → Expert → Legend → Master
- Progressive unlocking: Complete each level to unlock the next
- Dynamic grid layouts: 3×6 to 8×12 responsive grids

### Difficulty System
| Level | Cards | Pairs | Grid | Multiplier |
|-------|-------|-------|------|------------|
| Beginner | 18 | 6 | 3×6 | 1.0x |
| Intermediate | 24 | 8 | 4×6 | 1.2x |
| Advanced | 30 | 10 | 5×6 | 1.5x |
| Expert | 42 | 14 | 6×7 | 1.8x |
| Legend | 60 | 20 | 8×8 | 2.2x |
| Master | 96 | 32 | 8×12 | 2.5x |

## Scoring System

### Base Points
- Varies by difficulty (120-400 points)
- Capped at 10 points maximum per game (for betting/store economy)

### Bonuses
- **Efficiency Bonus**: Up to 5 points per move saved under threshold
- **Combo Multipliers**: 1.2x (3+), 1.5x (5+), 2.0x (10+)
- **Difficulty Multipliers**: 1.0x to 2.5x based on level
- **Time Bonus**: Remaining seconds × 2 (if timer enabled)

### Final Score Formula
```
Score = min(10, (Base + Efficiency + Time) × Combo × Difficulty)
```

## Achievement System

16 achievements across 4 categories:

### Move Efficiency
- **Perfect Game** - Complete within move limit
- **Speed Master** - Complete in under 30 seconds
- **Efficiency Expert** - Complete with 50% fewer moves than limit

### Difficulty Mastery
- Complete each difficulty level (6 achievements)

### Milestones
- **First Victory** - Win your first game
- **Veteran Player** - Play 10 games
- **Century Club** - Play 100 games

### Special
- **High Scorer** - Score 500+ points
- **No Hints Master** - Complete without hints
- **Strategic Thinker** - Efficient hint usage
- **Combo Master** - Achieve 10+ combo streak

## XP & Leveling

### XP Sources
- **Base Game**: 50 XP per completion
- **Difficulty Multipliers**: 1.0x to 2.5x
- **Perfect Game**: +50 XP bonus
- **Combo Bonuses**: +5 XP per combo above 5
- **Achievements**: +100 XP per unlock
- **Daily Challenges**: +150 XP
- **Daily Login**: +25 XP (with streak bonuses)

### Player Titles
- **Novice** (Level 1)
- **Apprentice** (Level 5)
- **Adept** (Level 10)
- **Expert** (Level 25)
- **Memory Master** (Level 50)
- **Grandmaster** (Level 75)
- **Immortal** (Level 100)

### Unlockables
- **Card Borders**: Blue, Green, Purple, Gold, Rainbow
- **Card Backs**: Galaxy, Fire, Ice, Diamond

## Combo System

Build consecutive matches for score multipliers:
- **3-4 matches**: 1.2x multiplier
- **5-9 matches**: 1.5x multiplier
- **10+ matches**: 2.0x multiplier

Visual feedback with color-coded badges and pulse animations.

## Hint System

- **Cost**: 50 points per hint
- **Limit**: 1-3 hints per game (based on difficulty)
- **Effect**: Reveals 3 matching cards for 3 seconds
- **Strategy**: Balance point preservation with assistance

## Daily Challenges

- Unique conditions each day
- Special requirements (timer, no hints, perfect game, etc.)
- Bonus points and XP rewards
- Streak tracking

## Sound System

- **Sound Effects**: Card flips, matches, achievements, etc.
- **Background Music**: Optional looping music
- **Volume Controls**: Independent sliders for effects and music
- **Persistent Settings**: Saved per browser

## dApp NFTs

- Collect promotional NFTs from Stacks dApps
- One NFT per dApp per player (unique, rare)
- Transferable and tradeable
- Metadata stored in Gaia storage
- Includes dApp info, bonuses, and challenges

## Blockchain Integration

- **Stacks Wallet**: Connect with Hiro or Leather
- **On-Chain Scores**: Submit high scores to Clarity contracts
- **Per-Wallet Data**: Points, achievements, progress tracked per address
- **Multi-Network**: Devnet, Testnet, Mainnet support

## UI/UX

- **Responsive Design**: Mobile-first with adaptive layouts
- **Dark Theme**: solv.finance-inspired palette
- **Animations**: Smooth transitions and visual feedback
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Optimized rendering and lazy loading
