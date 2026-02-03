# Memory Card Game Frontend

A fully functional memory card game frontend deployed on Vercel with on-chain score tracking on Stacks testnet.

🎮 **[Play Live Demo](https://memory-card-game-git-main-peters-projects-f3199619.vercel.app)**

## Features

- **🎮 Complete Game**: Memory card matching with 6 progressive difficulty levels and achievement system
- **🎯 Advanced Difficulty System**: Beginner (12 cards) to Master (32 cards) with progressive unlocking - [See Difficulty System](../DIFFICULTY_SYSTEM.md)
- **🏆 Achievement System**: 13 achievements across 4 categories with real-time unlocking - [See Achievement System](../ACHIEVEMENT_SYSTEM.md)
- **📱 Dynamic Responsive Design**: Cards automatically resize based on screen size and grid density - [See Dynamic Sizing](../DYNAMIC_SIZING.md)
- **⛓️ Blockchain Integration**: Submit scores to Stacks smart contracts with per-wallet tracking
- **📊 Performance Monitoring**: Vercel Speed Insights and Analytics for optimization
- **🚀 Modern Tech Stack**: Next.js 13+ with App Router, TypeScript, and React 18
- **🎨 Beautiful UI**: Radix UI + TailwindCSS with smooth animations and visual feedback
- **🔗 Wallet Integration**: Full Hiro/Leather wallet support with balance display
- **📱 Mobile-First Design**: Optimized experience across all devices and screen sizes
- **🌐 Multi-Network Support**: Seamless switching between Devnet, Testnet, and Mainnet

📚 **[View All Features](../FEATURES.md)** | 📝 **[Changelog](../CHANGELOG.md)**

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the Dev Server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Connect your Stacks wallet** (Hiro/Leather) on Devnet (mocknet).

## Environment Configuration

### For Local Development

Create a `.env.local` file:

```env
# Network configuration
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_AUTH_ORIGIN=http://localhost:3000

# Contract configuration (testnet)
NEXT_PUBLIC_GAME_SCORES_CONTRACT_ADDRESS=ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0
NEXT_PUBLIC_GAME_SCORES_CONTRACT_NAME=game-scores
```

### For Production (Vercel)

Add these environment variables in your Vercel project settings:

```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_GAME_SCORES_CONTRACT_ADDRESS=ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0
NEXT_PUBLIC_GAME_SCORES_CONTRACT_NAME=game-scores
NEXT_PUBLIC_DAPP_NFT_CONTRACT_ADDRESS=ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0
NEXT_PUBLIC_DAPP_NFT_CONTRACT_NAME=dapp-promo-nft
NEXT_PUBLIC_AUTH_ORIGIN=https://memory-card-game-xi-navy.vercel.app
```

## Project Structure

- `front-end/` — Next.js app, UI, wallet connect, and global state
- `clarity/` — (optional) Clarity contracts, not included by default
- `src/components/wallet/ConnectWallet.tsx` — Wallet connect/disconnect UI
- `src/contexts/WalletContext.tsx` — Global wallet state/context
- `src/lib/stacks.ts` — Stacks network config and utilities

## What's Included

- **Complete Memory Card Game** with scoring and on-chain leaderboard
- **Vercel Speed Insights** for performance monitoring
- **Vercel Analytics** for user behavior tracking
- **Wallet Integration** with Hiro/Leather support
- **Modern UI Components** with Radix UI and TailwindCSS
- **Responsive Design** that works on all devices

## Game Features

### 🎯 Core Gameplay
- **Memory Challenge**: Match pairs of high-quality image cards across 6 progressive difficulty levels
- **Progressive Unlocking**: Complete each difficulty to unlock the next challenge level
- **Dynamic Grids**: From 4×3 (Beginner) to 8×4 (Master) responsive grid layouts
- **Smart Image Pool**: 56+ unique images with intelligent rotation and selection

### 📊 Advanced Scoring System
- **Dynamic Base Points**: 120-400 points based on difficulty level
- **Efficiency Bonuses**: Earn up to 5 points per move saved under the bonus threshold
- **Difficulty Multipliers**: 1.0× to 2.5× multipliers for progressive reward scaling
- **Achievement Integration**: Unlock achievements for perfect games, speed completion, and milestones

### 🏆 Achievement System
- **13 Total Achievements**: Comprehensive progression tracking across 4 categories
- **Move Efficiency**: Perfect Game, Speed Master, Efficiency Expert
- **Difficulty Mastery**: Unique badges for completing each difficulty level
- **Milestone Tracking**: First Victory, Veteran Player, Century Club achievements
- **Special Rewards**: High Scorer achievement for exceptional performance
- **Real-time Notifications**: Instant feedback when achievements are unlocked
- **Progress Visualization**: Category breakdown and overall completion percentage

### 🔗 Blockchain & Wallet Integration
- **On-Chain Leaderboards**: Submit high scores to Stacks testnet smart contracts
- **Per-Wallet Tracking**: All progress, achievements, and scores tied to wallet address
- **Multi-Wallet Support**: Seamlessly switch between different connected wallets
- **Persistent Progress**: Achievement and difficulty progress saved per wallet

### 📱 Responsive Design
- **Adaptive Card Sizing**: Cards automatically resize based on screen dimensions and grid density
- **Mobile Optimization**: Touch-friendly interface with optimized spacing
- **Cross-Device Consistency**: Seamless experience from mobile to desktop
- **Dynamic Grid Gaps**: Intelligent spacing adjustment based on card size

> **Latest in v3.0**: [Comprehensive Achievement System](../ACHIEVEMENT_SYSTEM.md) with 13 achievements, [Progressive Unlock System](../DIFFICULTY_SYSTEM.md) with Master difficulty, and [Dynamic Card Sizing](../DYNAMIC_SIZING.md) for optimal display

## Performance Monitoring

This app includes:
- **Speed Insights**: Core Web Vitals and performance metrics
- **Analytics**: Page views, user behavior, and geographic data

---

**Happy building!**
