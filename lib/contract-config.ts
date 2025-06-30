import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network'

// Contract configuration for different networks
export const CONTRACT_CONFIG = {
  testnet: {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'memory-game',
    network: STACKS_TESTNET,
    explorerUrl: 'https://explorer.stacks.co/?chain=testnet'
  },
  mainnet: {
    contractAddress: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 
    contractName: 'memory-game',
    network: STACKS_MAINNET,
    explorerUrl: 'https://explorer.stacks.co/'
  }
} as const

// Get current network configuration
export function getNetworkConfig() {
  const isDev = process.env.NODE_ENV === 'development'
  const networkName = isDev ? 'testnet' : 'mainnet'
  
  const config = CONTRACT_CONFIG[networkName]
  
  if (!config.contractAddress) {
    console.warn(`⚠️  Contract address not configured for ${networkName}. Please deploy the contract first.`)
  }
  
  return {
    ...config,
    networkName,
    isTestnet: networkName === 'testnet'
  }
}

// Contract function names (from ABI)
export const CONTRACT_FUNCTIONS = {
  // Public functions
  MINT: 'mint',
  FLIP_CARD: 'flip-card',
  TRANSFER: 'transfer',
  START_GAME: 'start-game',
  FLIP_CARD_GAME: 'flip-card-game',
  CHECK_MATCH: 'check-match',
  RESET_GAME: 'reset-game',
  
  // Read-only functions
  GET_LAST_TOKEN_ID: 'get-last-token-id',
  GET_TOKEN_URI: 'get-token-uri',
  GET_OWNER: 'get-owner',
  GET_PLAYER_GAME_URI: 'get-player-game-uri',
  GET_PLAYER_FLIPPED: 'get-player-flipped'
} as const

// Error codes from contract
export const CONTRACT_ERRORS = {
  ERR_UNAUTHORIZED: 401,
  ERR_NOT_FOUND: 404,
  ERR_ALREADY_FLIPPED: 410
} as const

// Helper to get contract address for current network
export function getContractAddress(): string {
  const isDev = process.env.NODE_ENV === 'development'
  const networkName = isDev ? 'testnet' : 'mainnet'
  const config = CONTRACT_CONFIG[networkName]
  
  if (!config.contractAddress) {
    throw new Error(`Contract not deployed on ${networkName}. Run: npm run deploy:${networkName}`)
  }
  
  return config.contractAddress
}

// Helper to get explorer URL for a transaction
export function getExplorerUrl(txid: string): string {
  const config = getNetworkConfig()
  return `${config.explorerUrl}${config.isTestnet ? '' : '/'}txid/${txid}${config.isTestnet ? '?chain=testnet' : ''}`
}

// Helper to update contract address after deployment
export function updateContractAddress(network: 'testnet' | 'mainnet', address: string): void {
  console.log(`📝 Update CONTRACT_CONFIG.${network}.contractAddress to: ${address}`)
  console.log(`   File: lib/contract-config.ts`)
}

// Helper to get config based on environment
export function getContractConfig() {
  const isMainnet = process.env.NODE_ENV === 'production'
  return isMainnet ? CONTRACT_CONFIG.mainnet : CONTRACT_CONFIG.testnet
} 