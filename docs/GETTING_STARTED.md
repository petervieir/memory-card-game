# 🚀 Getting Started

Welcome to the Memory Card Game! This guide will help you set up your development environment and start building.

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - For version control
- **Stacks Wallet** - [Hiro Wallet](https://wallet.hiro.so/) or [Leather](https://leather.io/)

## ⚡ Quick Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd MemoryCardGame
npm install
```

### 2. Run Setup Script

```bash
./scripts/dev-setup.sh
```

This script will:

- ✅ Check Node.js version
- ✅ Install dependencies
- ✅ Install Clarinet (if needed)
- ✅ Create environment files
- ✅ Validate contract setup
- ✅ Build all packages

### 3. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your dApp!

## 🔧 Manual Setup

If you prefer manual setup:

### Install Dependencies

```bash
npm install
```

### Setup Environment Files

```bash
# Copy environment templates
cp front-end/.env.example front-end/.env.local
cp clarity/.env.example clarity/.env.local
```

### Install Clarinet

```bash
npm install -g @hirosystems/clarinet
```

### Verify Setup

```bash
npm run test
npm run lint
```

## 🌐 Configure Your Wallet

1. Install [Hiro Wallet](https://wallet.hiro.so/) or [Leather](https://leather.io/)
2. Create a new wallet or import existing
3. Switch to **Mocknet/Devnet** in wallet settings
4. Visit your dApp and connect wallet

## 📁 Project Structure

```
├── front-end/           # Next.js React application
│   ├── src/components/  # React components
│   ├── src/contexts/    # React contexts
│   ├── src/hooks/       # Custom hooks
│   ├── src/lib/         # Utilities
│   └── LICENSE         # MIT license for frontend
├── clarity/             # Smart contracts
│   ├── contracts/       # Clarity contracts
│   ├── tests/          # Contract tests
│   ├── deployments/    # Deployment configs
│   └── LICENSE         # MIT license for contracts
├── scripts/            # Development scripts
├── deployment/         # Environment configs
├── docs/              # Documentation
└── LICENSE            # MIT license for project
```

## 🛠️ Available Commands

### Development

```bash
npm run dev              # Start all development servers
npm run dev:frontend     # Start only frontend
npm run dev:contracts    # Start Clarinet console
```

### Building

```bash
npm run build            # Build all packages
npm run build:frontend   # Build frontend only
npm run build:contracts  # Check contracts only
```

### Testing

```bash
npm run test             # Run all tests
npm run test:frontend    # Test frontend only
npm run test:contracts   # Test contracts only
npm run test:watch       # Watch mode
```

### Code Quality

```bash
npm run lint             # Check all code
npm run lint:fix         # Fix linting issues
npm run format           # Format all code
npm run type-check       # TypeScript checking
```

## 🚨 Troubleshooting

### Common Issues

**Port 3000 already in use:**

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev:frontend
```

**Clarinet not found:**

```bash
npm install -g @hirosystems/clarinet
# Or install locally
npm install @hirosystems/clarinet-sdk
```

**Wallet not connecting:**

- Ensure wallet is on Mocknet/Devnet
- Clear browser cache
- Check browser console for errors

### Need Help?

- 📖 [Full Documentation](./README.md)
- 🔧 [Development Guide](./DEVELOPMENT.md)
- 🚀 [Deployment Guide](../deployment/README.md)
- 🐛 [Common Issues](./TROUBLESHOOTING.md)

## 🎯 Next Steps

1. 📖 Read the [Development Guide](./DEVELOPMENT.md)
2. 🔍 Explore the [example components](../front-end/src/components/)
3. 📝 Check out the [sample contracts](../clarity/contracts/)
4. 🚀 Deploy to [testnet](../deployment/README.md)

Happy building! 🎉
