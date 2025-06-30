# 🃏 Blockchain Memory Card Game

A modern take on the classic memory matching game, powered by the Stacks blockchain. This project combines the nostalgic gameplay of memory cards with Web3 technology, creating a decentralized gaming experience where each card is an NFT and game state persists on the blockchain.

## 🎮 Features

### Core Gameplay
- **Classic Memory Game**: Flip cards to find matching pairs
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Score Tracking**: Real-time scoring and game statistics

### Blockchain Integration
- **NFT Cards**: Each memory card is a unique NFT following SIP-009 standard
- **Wallet Connection**: Integrate with Hiro Wallet or Xverse
- **On-Chain Game State**: Game progress tracked on Stacks blockchain
- **Decentralized Storage**: Card metadata stored on Gaia network
- **Smart Contract Logic**: Clarity contracts handle game rules and verification

## 🛠 Technology Stack

### Frontend
- **Next.js 15.3.4** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **TanStack React Query** - Efficient data fetching and caching

### Blockchain
- **Stacks Blockchain** - Bitcoin-secured smart contracts
- **Clarity Smart Contracts** - Secure, decidable smart contract language
- **Stacks.js** - JavaScript SDK for Stacks integration
- **Gaia Storage** - Decentralized storage for game data

### Development Tools
- **Jest** - Unit testing framework
- **Clarinet** - Clarity development environment
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- [Clarinet](https://docs.hiro.so/clarinet) for smart contract development
- Stacks wallet (Hiro Wallet or Xverse)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd memory-game
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game.

### Smart Contract Development

1. Check contracts
```bash
npm run test:contract
```

2. Run contract tests
```bash
clarinet test
```

3. Deploy to testnet
```bash
npm run deploy:testnet
```

## 🎯 Game Flow

1. **Connect Wallet**: Players connect their Stacks wallet
2. **Start Game**: Initialize a new game session, minting NFT cards
3. **Flip Cards**: Click cards to reveal them and find matches
4. **Match Verification**: Smart contracts verify matches on-chain
5. **Score Tracking**: Points and statistics recorded on blockchain
6. **Game Completion**: Final scores persisted for leaderboards

## 🏗 Project Structure

```
memory-game/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── FlipCard.tsx       # Memory card component
│   ├── MemoryGame.tsx     # Main game component
│   └── WalletConnect.tsx  # Blockchain wallet integration
├── contracts/             # Clarity smart contracts
├── lib/                   # Utility functions and services
├── scripts/               # Deployment and utility scripts
├── tests/                 # Contract tests
└── __tests__/             # Frontend tests
```

## 🧪 Testing

Run all tests:
```bash
npm run test:all
```

Frontend tests only:
```bash
npm test
```

Smart contract tests:
```bash
npm run test:contract
```

## 🚀 Deployment

### Testnet
```bash
npm run deploy:testnet
npm run verify:testnet
```

### Mainnet
```bash
npm run deploy:mainnet
npm run verify:mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Stacks Blockchain](https://stacks.org/)
- UI components from [Radix UI](https://radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
