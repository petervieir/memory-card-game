# 🚀 Deployment Configurations

This directory contains environment-specific deployment configurations for the Memory Card Game project.

## 📁 Structure

```
deployment/
├── devnet.config.js     # Local development environment
├── testnet.config.js    # Stacks testnet environment
├── mainnet.config.js    # Production mainnet environment
└── README.md           # This file
```

## 🌐 Environments

### 🔧 Devnet (Local Development)

- **Purpose**: Local development and testing
- **Network**: Local mocknet
- **Requirements**: None (uses default devnet accounts)
- **Usage**: `npm run deploy:devnet` or `./scripts/deploy.sh devnet`

### 🧪 Testnet

- **Purpose**: Pre-production testing with real network conditions
- **Network**: Stacks testnet
- **Requirements**:
  - Testnet STX for deployment fees
  - Environment variables configured
- **Usage**: `npm run deploy:testnet` or `./scripts/deploy.sh testnet`

### 🌍 Mainnet (Production)

- **Purpose**: Production deployment
- **Network**: Stacks mainnet
- **Requirements**:
  - Mainnet STX for deployment fees
  - Security review completed
  - Environment variables configured
- **Usage**: `./scripts/deploy.sh mainnet`

## 🔑 Required Environment Variables

### Testnet

```bash
TESTNET_DEPLOYER_ADDRESS=your_testnet_address
TESTNET_DEPLOYER_PRIVATE_KEY=your_testnet_private_key
TESTNET_FRONTEND_URL=https://your-testnet-app.com
```

### Mainnet

```bash
MAINNET_DEPLOYER_ADDRESS=your_mainnet_address
MAINNET_DEPLOYER_PRIVATE_KEY=your_mainnet_private_key
MAINNET_FRONTEND_URL=https://your-production-app.com
HIRO_API_KEY=your_hiro_api_key
```

## 📋 Pre-deployment Checklist

### Testnet

- [ ] Contracts pass all tests
- [ ] Environment variables configured
- [ ] Testnet STX available for fees
- [ ] Frontend builds successfully

### Mainnet

- [ ] All testnet testing completed
- [ ] Security audit performed
- [ ] Environment variables configured
- [ ] Mainnet STX available for fees
- [ ] Backup and recovery plan in place
- [ ] Frontend optimized for production

## 🛡️ Security Notes

- **Never commit private keys** to version control
- Use `.env.local` files for sensitive configuration
- Consider using hardware wallets for mainnet deployments
- Always test on testnet first
- Keep deployment keys secure and backed up

## 🔧 Usage Examples

```bash
# Deploy to devnet (local)
npm run deploy:devnet

# Deploy to testnet
./scripts/deploy.sh testnet

# Deploy to mainnet (with confirmation)
./scripts/deploy.sh mainnet
```
