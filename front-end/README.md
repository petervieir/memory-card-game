# Memory Card Game Frontend

A fully functional memory card game frontend deployed on Vercel with on-chain score tracking on Stacks testnet.

🎮 **[Play Live Demo](https://memory-card-game-git-main-peters-projects-f3199619.vercel.app)**

## Features

- **🎮 Complete Game**: Memory card matching with emoji cards
- **⛓️ On-Chain Scores**: Best scores stored on Stacks blockchain
- **📊 Performance Monitoring**: Vercel Speed Insights and Analytics
- **🚀 Next.js 13+** with App Router and TypeScript
- **🎨 Modern UI**: Radix UI + TailwindCSS with beautiful design
- **🔗 Wallet Integration**: Hiro/Leather wallet support
- **📱 Responsive**: Works perfectly on desktop and mobile
- **🌐 Multi-Network**: Devnet, Testnet, and Mainnet support

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

- **🎯 Memory Challenge**: Match pairs of emoji cards
- **📊 Smart Scoring**: Base points (100) + efficiency bonus for fewer moves
- **🏆 On-Chain Leaderboard**: Best scores permanently stored on Stacks
- **💰 Wallet Required**: Connect wallet to play and earn points
- **🎨 Beautiful UI**: Modern, accessible design with animations

## Performance Monitoring

This app includes:
- **Speed Insights**: Core Web Vitals and performance metrics
- **Analytics**: Page views, user behavior, and geographic data

---

**Happy building!**
