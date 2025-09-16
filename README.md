# Memory Card Game

A fully functional decentralized memory card game built on Stacks with Next.js, deployed on testnet with on-chain score tracking.

🎮 **[Play Live Demo](https://memory-card-game-git-main-peters-projects-f3199619.vercel.app)** | 📊 **[View Contracts](https://explorer.stacks.co/?chain=testnet)**

> This project was initially bootstrapped with https://github.com/hirosystems/platform-template-blank-project/tree/main, but has been heavily modified.

## ✨ Features

- **🎮 Fully Functional Game** - Memory card matching with scoring system
- **⛓️ On-Chain Score Tracking** - Best scores stored on Stacks testnet
- **🚀 Next.js 13+** with App Router and TypeScript
- **🎨 Modern UI** - Radix UI + TailwindCSS with dark/light mode
- **📊 Performance Monitoring** - Vercel Speed Insights and Analytics
- **🧪 Testing Ready** - Vitest for contracts, Jest for frontend
- **📦 Monorepo** - Organized workspace with Turborepo
- **🔧 Developer Experience** - ESLint, Prettier, VS Code extensions
- **🌐 Multi-Network** - Devnet, Testnet, Mainnet configurations
- **📜 MIT Licensed** - Open source with proper license structure

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
| [📋 Recommendations](./docs/RECOMMENDATIONS.md) | Optimization suggestions      |

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Package Licenses

- **Frontend** (`front-end/`): [MIT License](front-end/LICENSE)
- **Smart Contracts** (`clarity/`): [MIT License](clarity/LICENSE)

Each package can be distributed independently under its respective MIT license.

- Development tools (ESLint, Prettier, TypeScript)

## 🎮 Game Features

- **Memory Card Matching**: Match pairs of emoji cards
- **Scoring System**: Base points (100) + efficiency bonus
- **On-Chain Leaderboard**: Best scores stored on Stacks blockchain
- **Wallet Integration**: Connect Hiro/Leather wallets
- **Responsive Design**: Works on desktop and mobile

## 🚀 Deployment Guide

### Environment Variables (Vercel)

Add these to your Vercel project settings:

```env
NEXT_PUBLIC_GAME_SCORES_CONTRACT_ADDRESS=ST2ZPVCRZZ2T6V8DT7JCMXHRGHH7ZT7RYHPBJDWC0
NEXT_PUBLIC_GAME_SCORES_CONTRACT_NAME=game-scores
NEXT_PUBLIC_STACKS_NETWORK=testnet
```

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
