# Memory Card Game

A fully functional decentralized memory card game built on Stacks with Next.js, deployed on testnet with on-chain score tracking.

🎮 **[Play Live Demo](https://memory-card-game-git-main-peters-projects-f3199619.vercel.app)** | 📊 **[View Contracts](https://explorer.stacks.co/?chain=testnet)**

> This project was initially bootstrapped with https://github.com/hirosystems/platform-template-blank-project/tree/main, but has been heavily modified.

## ✨ Features

- **🎮 Fully Functional Game** - Memory card matching with 6 difficulty levels and progressive unlocking
- **🎯 Advanced Difficulty System** - Beginner (12 cards) to Master (32 cards) with dynamic scoring multipliers
- **💡 Strategic Hint System** - Point-based hints with difficulty-scaled limits and 3-second reveals
- **🔥 Combo System** - Consecutive match rewards with multipliers up to 2.0x for epic combos
- **🏆 Comprehensive Achievement System** - 16 achievements across 4 categories (Efficiency, Mastery, Milestones, Special)

sound-effects
- **🔊 Immersive Sound System** - Dynamic sound effects and optional background music with volume controls

main
- **📱 Dynamic Responsive Design** - Cards auto-resize based on screen size and grid density for optimal experience
- **⛓️ On-Chain Score Tracking** - Submit high scores to Stacks testnet with wallet-specific leaderboards
- **🚀 Modern Tech Stack** - Next.js 13+ with App Router, TypeScript, and React 18
- **🎨 Beautiful UI** - Radix UI + TailwindCSS with smooth animations and visual feedback
- **📊 Performance Monitoring** - Vercel Speed Insights and Analytics for optimization
- **🧪 Comprehensive Testing** - Vitest for smart contracts, Jest for frontend components
- **📦 Organized Monorepo** - Turborepo workspace with clear separation of concerns
- **🔧 Excellent DX** - ESLint, Prettier, TypeScript, VS Code extensions
- **🌐 Multi-Network Support** - Devnet, Testnet, Mainnet configurations with environment switching
- **📜 Open Source** - MIT Licensed with proper package-level licensing

📚 **[View All Features](./FEATURES.md)** | 📝 **[Changelog](./CHANGELOG.md)**

## 🎯 Live Deployment

- **Frontend**: Deployed on [Vercel](https://memory-card-game-git-main-peters-projects-f3199619.vercel.app)
- **Contracts**: Deployed on Stacks Testnet
  - `game-scores`: `ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0.game-scores`
  - `helpers`: `ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0.helpers`
  - `sip-009-trait`: `ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0.sip-009-trait`

## ⚡ Quick Start

```bash
# Clone and setup
git clone <your-repo-url>
cd MemoryCardGame
./scripts/dev-setup.sh

# Start development
npm run dev
```

**That's it!** Visit [http://localhost:3000](http://localhost:3000) to see your dApp.

📖 **New to the project?** Check out our [Getting Started Guide](./docs/GETTING_STARTED.md)

## 📁 Project Structure

```
├── front-end/           # Next.js React application
│   ├── src/components/  # React components (UI, wallet, contracts)
│   ├── src/contexts/    # React contexts (wallet state)
│   ├── src/hooks/       # Custom hooks
│   ├── src/lib/         # Utilities and configurations
│   └── LICENSE         # MIT license for frontend package
├── clarity/             # Smart contracts and tests
│   ├── contracts/       # Clarity smart contracts
│   ├── tests/          # Contract tests (Vitest)
│   ├── deployments/    # Network deployment plans
│   └── LICENSE         # MIT license for contracts package
├── scripts/            # Development and deployment scripts
├── deployment/         # Environment-specific configurations
├── docs/              # Documentation
├── .vscode/           # VS Code settings and extensions
└── LICENSE            # MIT license for entire project
```

## 🛠️ Development Commands

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `npm run dev`            | Start all development servers        |
| `npm run build`          | Build all packages for production    |
| `npm run test`           | Run all tests (contracts + frontend) |
| `npm run lint`           | Check code quality                   |
| `npm run format`         | Format all code                      |
| `npm run deploy:devnet`  | Deploy contracts to local devnet     |
| `npm run deploy:testnet` | Deploy contracts to testnet          |

## 📚 Documentation

| Guide                                           | Description                   |
| ----------------------------------------------- | ----------------------------- |
| [🚀 Getting Started](./docs/GETTING_STARTED.md) | Setup and first steps         |
| [🔨 Development Guide](./docs/DEVELOPMENT.md)   | Coding patterns and workflows |
| [🚀 Deployment Guide](./deployment/README.md)   | Environment deployments       |
| [🔊 Sound System](./SOUND_SYSTEM.md)            | Audio implementation guide    |
| [📋 Recommendations](./docs/RECOMMENDATIONS.md) | Optimization suggestions      |
| [🤝 Contributing Guide](./CONTRIBUTING.md)      | How to contribute to the project |

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Package Licenses

- **Frontend** (`front-end/`): [MIT License](front-end/LICENSE)
- **Smart Contracts** (`clarity/`): [MIT License](clarity/LICENSE)

Each package can be distributed independently under its respective MIT license.

- Development tools (ESLint, Prettier, TypeScript)

## 🎮 Game Features

### 🎯 Core Gameplay
- **Memory Card Matching**: Match pairs of high-quality image cards across 6 difficulty levels
- **Progressive Difficulty**: Unlock new challenges by completing previous levels (12 to 32 cards)
- **Dynamic Grid Layouts**: From 4×3 grids to challenging 8×4 layouts
- **Smart Image Pool**: 56+ unique images with intelligent rotation system

### 📊 Advanced Scoring
- **Dynamic Base Points**: 120-400 points based on difficulty level
- **Efficiency Bonuses**: Earn up to 5 points per move saved under the bonus threshold
- **Combo Multipliers**: 1.2× (3+ combo), 1.5× (5+ combo), 2.0× (10+ combo)
- **Difficulty Multipliers**: 1.0× to 2.5× multipliers for higher difficulties
- **Achievement Integration**: Unlock achievements for perfect games, speed runs, and combos

### 🏆 Achievement System
- **16 Unique Achievements**: Spanning 4 categories for comprehensive progression tracking
- **Move Efficiency**: Perfect Game, Speed Master, Efficiency Expert
- **Difficulty Mastery**: Complete each difficulty level for unique badges
- **Milestones**: First Victory, Veteran Player (10 games), Century Club (100 games)
- **Special Rewards**: High Scorer, No Hints Master, Strategic Thinker, Combo Master

### 💡 Hint System
- **Strategic Assistance**: Reveal matching pairs temporarily for 50 points
- **Difficulty-Based Limits**: 1-3 hints available depending on game difficulty
- **Smart Trade-offs**: Balance point preservation with strategic hint usage
- **Achievement Integration**: Special rewards for no-hint completions

### 🔥 Combo System
- **Consecutive Match Rewards**: Build streaks for increasing score multipliers
- **3-Tier Multipliers**: 1.2x, 1.5x, and 2.0x bonuses for 3+, 5+, and 10+ combos
- **Dynamic Visual Effects**: Color-coded badges with pulse animations at milestones
- **Skill-Based Scoring**: Master memory skills for dramatically higher scores

### 🔊 Sound System
- **Dynamic Sound Effects**: Audio feedback for card flips, matches, achievements, and more
- **Background Music**: Optional looping music with smooth fade in/out
- **Volume Controls**: Independent sliders for effects and music
- **Persistent Settings**: Audio preferences saved per browser
- **No Required Files**: Game works perfectly without sound files (graceful degradation)

### 🔗 Blockchain Integration
- **On-Chain Leaderboards**: Submit high scores to Stacks testnet smart contracts
- **Wallet-Specific Progress**: All achievements and scores tied to your wallet address
- **Multi-Wallet Support**: Seamlessly switch between different Stacks wallets
- **Network Flexibility**: Support for Devnet, Testnet, and Mainnet deployments

## 🚀 Deployment Guide

### Environment Variables (Vercel)

Add these to your Vercel project settings:

```env
# Network Configuration
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_AUTH_ORIGIN=https://your-domain.vercel.app

# Smart Contract Configuration (Testnet)
NEXT_PUBLIC_GAME_SCORES_CONTRACT_ADDRESS=ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0
NEXT_PUBLIC_GAME_SCORES_CONTRACT_NAME=game-scores

# Optional: Analytics and Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

📖 **Detailed Setup**: See [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) for complete configuration instructions.

### Local Development

```bash
# Copy environment template
cp front-end/.env.local.example front-end/.env.local

# Start development
npm run dev
```

---

**Happy building! 🎉**

## 📖 Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [Hiro Tools](https://docs.hiro.so)
# Trigger deployment
