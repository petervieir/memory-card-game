# Memory Card Game

A decentralized memory card game built on Stacks with Next.js. Match trios of cards to earn points, unlock achievements, and collect dApp NFTs.

🎮 **[Play Live Demo](https://memory-card-game-git-main-peters-projects-f3199619.vercel.app)**

## Features

- **Memory Card Matching** - Match trios of cards across 6 difficulty levels
- **Progressive Difficulty** - Unlock levels from Beginner (18 cards) to Master (96 cards)
- **Achievement System** - 16 achievements across 4 categories
- **XP & Leveling** - Earn XP, unlock titles, and cosmetic rewards
- **Daily Challenges** - Unique conditions with bonus rewards
- **Combo System** - Consecutive matches earn score multipliers (up to 2.0x)
- **Hint System** - Strategic hints with point costs
- **Sound System** - Dynamic sound effects and optional background music
- **dApp NFTs** - Collect promotional NFTs from Stacks dApps
- **On-Chain Scores** - Submit high scores to Stacks testnet

## Quick Start

```bash
git clone <your-repo-url>
cd MemoryCardGame
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── front-end/          # Next.js React application
├── clarity/            # Clarity smart contracts
├── scripts/            # Development scripts
├── deployment/         # Environment configurations
└── docs/              # Documentation
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers |
| `npm run build` | Build for production |
| `npm run test` | Run all tests |
| `npm run lint` | Check code quality |

## Documentation

- [Getting Started](./docs/GETTING_STARTED.md) - Setup guide
- [Features](./FEATURES.md) - Complete feature list
- [Deployment](./deployment/README.md) - Deployment guide

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Stacks, Clarity smart contracts
- **State**: Zustand
- **UI**: Radix UI components

## License

MIT License - see [LICENSE](LICENSE) file for details.
