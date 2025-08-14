# Memory Card Game

A decentralized memory card game built on Stacks with Next.js.

> This project was initially bootstrapped with https://github.com/hirosystems/platform-template-blank-project/tree/main, but has been heavily modified.

## ✨ Features

- **🚀 Next.js 13+** with App Router and TypeScript
- **⛓️ Stacks Integration** - Wallet connect, contract interactions
- **🎨 Modern UI** - Radix UI + TailwindCSS with dark/light mode
- **🧪 Testing Ready** - Vitest for contracts, Jest for frontend
- **📦 Monorepo** - Organized workspace with Turborepo
- **🔧 Developer Experience** - ESLint, Prettier, VS Code extensions
- **🌐 Multi-Network** - Devnet, Testnet, Mainnet configurations
- **📜 MIT Licensed** - Open source with proper license structure

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

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start all development servers        |
| `npm run build`         | Build all packages for production    |
| `npm run test`          | Run all tests (contracts + frontend) |
| `npm run lint`          | Check code quality                   |
| `npm run format`        | Format all code                      |
| `npm run deploy:devnet` | Deploy contracts to local devnet     |

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

## 🔗 What's Not Included

This is a **minimal starter** - basic memory card game functionality with room for expansion.

## 📚 Next Steps

1. **Add game contracts** to the `clarity/contracts/` folder
2. **Build game UI** in `front-end/src/components/`
3. **Deploy to testnet/mainnet** when ready

---

**Happy building! 🎉**

## 📖 Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [Hiro Tools](https://docs.hiro.so)
