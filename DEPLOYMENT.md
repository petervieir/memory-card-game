# Memory Game Contract Deployment Guide

This guide covers deploying the Memory Game smart contract to Stacks blockchain following Stacks Blockchain Conventions.

## Prerequisites

1. **Stacks Wallet**: Set up a Stacks wallet with STX for gas fees
2. **Private Key**: Export your private key (64-character hex string)
3. **Environment Setup**: Configure environment variables

## Environment Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Fill in your configuration:
   ```bash
   # Required: Your Stacks private key
   STACKS_PRIVATE_KEY=your_64_character_hex_private_key_here
   
   # Optional: Custom API endpoints
   STACKS_API_URL_TESTNET=https://api.testnet.hiro.so
   STACKS_API_URL_MAINNET=https://api.mainnet.hiro.so
   ```

## Deployment Commands

### Testnet Deployment
```bash
# Deploy to testnet
npm run deploy:testnet

# Verify deployment
npm run verify:testnet
```

### Mainnet Deployment
```bash
# Deploy to mainnet (requires NODE_ENV=production)
npm run deploy:mainnet

# Verify deployment
npm run verify:mainnet
```

### ABI Generation
```bash
# Generate contract ABI
npm run generate-abi
```

## Deployment Process

The deployment script performs the following steps:

1. **Environment Validation**: Checks required environment variables
2. **Network Configuration**: Sets up Stacks network (testnet/mainnet)
3. **Contract Compilation**: Reads and validates Clarity contract
4. **Fee Estimation**: Estimates deployment gas costs
5. **Transaction Broadcasting**: Deploys contract to blockchain
6. **Contract Initialization**: Performs initial setup calls
7. **ABI Generation**: Creates JSON ABI for frontend integration
8. **Deployment Recording**: Saves deployment info and artifacts

## Output Files

After deployment, the following files are created:

```
deployments/
├── testnet/
│   ├── memory-game-deployment.json    # Deployment metadata
│   └── memory-game-abi.json          # Contract ABI
└── mainnet/
    ├── memory-game-deployment.json
    └── memory-game-abi.json

abi/
└── memory-game-abi.json              # Standalone ABI file
```

## Deployment Metadata

The deployment JSON contains:
```json
{
  "contractName": "memory-game",
  "txid": "0x...",
  "deployer": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  "network": "testnet",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "contractAddress": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.memory-game"
}
```

## Contract ABI Structure

The generated ABI includes:
- **Functions**: Public and read-only functions with signatures
- **Variables**: Data variables and constants
- **Maps**: Storage maps with key/value types
- **NFTs**: Non-fungible token definitions

## Security Considerations

### Mainnet Guard
- Mainnet deployment requires `NODE_ENV=production`
- Prevents accidental mainnet deployments in development

### Private Key Security
- Never commit private keys to version control
- Use environment variables for sensitive data
- Consider hardware wallets for mainnet deployments

### Pre-deployment Checklist
- [ ] Contract passes all tests (`npm test`)
- [ ] Contract syntax is valid (`npm run test:contract`)
- [ ] Environment variables are configured
- [ ] Sufficient STX balance for deployment fees
- [ ] Network selection is correct (testnet/mainnet)

## Verification

The verification script checks:
- Transaction confirmation status
- Contract deployment success
- Read-only function availability
- Basic contract functionality

## Troubleshooting

### Common Issues

1. **Insufficient Balance**
   ```
   Error: Insufficient funds for transaction
   ```
   - Solution: Add STX to your wallet

2. **Invalid Private Key**
   ```
   Error: Invalid private key format
   ```
   - Solution: Ensure 64-character hex string

3. **Network Connection**
   ```
   Error: Network request failed
   ```
   - Solution: Check internet connection and API endpoints

4. **Contract Syntax Error**
   ```
   Error: Contract compilation failed
   ```
   - Solution: Run `npm run test:contract` to check syntax

### Debug Mode

Enable verbose logging:
```bash
DEBUG=true npm run deploy:testnet
```

## Integration

After deployment, update your frontend configuration:

```typescript
// lib/contract-config.ts
export const CONTRACT_CONFIG = {
  testnet: {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.memory-game',
    network: new StacksTestnet()
  },
  mainnet: {
    contractAddress: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.memory-game',
    network: new StacksMainnet()
  }
}
```

## Monitoring

Monitor your deployment:
- **Testnet Explorer**: https://explorer.stacks.co/?chain=testnet
- **Mainnet Explorer**: https://explorer.stacks.co/
- **API Status**: Check network status at status.hiro.so

## Support

For deployment issues:
1. Check the troubleshooting section above
2. Review Stacks documentation: https://docs.stacks.co/
3. Join the Stacks Discord: https://discord.gg/stacks 