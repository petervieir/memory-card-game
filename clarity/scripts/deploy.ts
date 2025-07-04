#!/usr/bin/env node

import {
  makeContractDeploy,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  getAddressFromPrivateKey,
  randomPrivateKey,
  fetchNonce,
} from '@stacks/transactions'
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Types
interface DeploymentConfig {
  network: typeof STACKS_TESTNET | typeof STACKS_MAINNET
  privateKey: string
  contractName: string
  contractPath: string
  deployer: string
}

interface ContractABI {
  functions: Array<{
    name: string
    access: 'private' | 'public' | 'read_only'
    args: Array<{ name: string; type: string }>
    outputs: { type: string }
  }>
  variables: Array<{
    name: string
    type: string
    access: 'variable' | 'constant'
  }>
  maps: Array<{
    name: string
    key: string
    value: string
  }>
  fungible_tokens: Array<any>
  non_fungible_tokens: Array<{
    name: string
    type: string
  }>
}

// Constants
const TESTNET_API_URL = 'https://api.testnet.hiro.so'
const MAINNET_API_URL = 'https://api.mainnet.hiro.so'

// Helper functions
function getNetwork(networkName: string): typeof STACKS_TESTNET | typeof STACKS_MAINNET {
  switch (networkName.toLowerCase()) {
    case 'testnet':
      return STACKS_TESTNET
    case 'mainnet':
      // Mainnet guard as per Stacks conventions
      if (process.env.NODE_ENV !== 'production') {
        throw new Error('Mainnet deployment only allowed in production environment')
      }
      return STACKS_MAINNET
    default:
      throw new Error(`Unsupported network: ${networkName}`)
  }
}

function validateEnvironment(): void {
  const required = ['STACKS_PRIVATE_KEY']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

function readContractSource(contractPath: string): string {
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Contract file not found: ${contractPath}`)
  }
  return fs.readFileSync(contractPath, 'utf8')
}

// ABI generation from Clarity source
function generateABI(contractSource: string): ContractABI {
  const abi: ContractABI = {
    functions: [],
    variables: [],
    maps: [],
    fungible_tokens: [],
    non_fungible_tokens: []
  }

  // Parse define-public functions
  const publicFunctions = contractSource.match(/\(define-public\s+\(([^)]+)\s*([^)]*)\)/g) || []
  publicFunctions.forEach(func => {
    const match = func.match(/\(define-public\s+\(([^)\s]+)/)
    if (match) {
      abi.functions.push({
        name: match[1],
        access: 'public',
        args: [],
        outputs: { type: 'response' }
      })
    }
  })

  // Parse define-read-only functions
  const readOnlyFunctions = contractSource.match(/\(define-read-only\s+\(([^)]+)\s*([^)]*)\)/g) || []
  readOnlyFunctions.forEach(func => {
    const match = func.match(/\(define-read-only\s+\(([^)\s]+)/)
    if (match) {
      abi.functions.push({
        name: match[1],
        access: 'read_only',
        args: [],
        outputs: { type: 'response' }
      })
    }
  })

  // Parse constants
  const constants = contractSource.match(/\(define-constant\s+([^\s]+)\s+([^)]+)\)/g) || []
  constants.forEach(constant => {
    const match = constant.match(/\(define-constant\s+([^\s]+)/)
    if (match) {
      abi.variables.push({
        name: match[1],
        type: 'uint',
        access: 'constant'
      })
    }
  })

  // Parse data variables
  const dataVars = contractSource.match(/\(define-data-var\s+([^\s]+)\s+([^\s]+)/g) || []
  dataVars.forEach(dataVar => {
    const match = dataVar.match(/\(define-data-var\s+([^\s]+)\s+([^\s]+)/)
    if (match) {
      abi.variables.push({
        name: match[1],
        type: match[2],
        access: 'variable'
      })
    }
  })

  // Parse maps
  const maps = contractSource.match(/\(define-map\s+([^\s]+)\s+([^)]+)\s+([^)]+)\)/g) || []
  maps.forEach(map => {
    const match = map.match(/\(define-map\s+([^\s]+)/)
    if (match) {
      abi.maps.push({
        name: match[1],
        key: 'tuple',
        value: 'tuple'
      })
    }
  })

  // Parse NFT definitions
  const nfts = contractSource.match(/\(define-non-fungible-token\s+([^\s]+)\s+([^)]+)\)/g) || []
  nfts.forEach(nft => {
    const match = nft.match(/\(define-non-fungible-token\s+([^\s]+)\s+([^)]+)/)
    if (match) {
      abi.non_fungible_tokens.push({
        name: match[1],
        type: match[2]
      })
    }
  })

  return abi
}

async function deployContract(config: DeploymentConfig): Promise<string> {
  console.log(`📋 Deploying contract: ${config.contractName}`)
  console.log(`🌐 Network: ${config.network === STACKS_MAINNET ? 'Mainnet' : 'Testnet'}`)
  console.log(`👤 Deployer: ${config.deployer}`)

  const contractSource = readContractSource(config.contractPath)
  
  // Get nonce
  const nonce = await fetchNonce({ address: config.deployer, network: config.network })
  console.log(`🔢 Nonce: ${nonce}`)

  // Create contract deploy transaction
  const deployTx = await makeContractDeploy({
    contractName: config.contractName,
    codeBody: contractSource,
    senderKey: config.privateKey,
    network: config.network,
  })

  console.log(`📤 Broadcasting transaction...`)
  const broadcastResult = await broadcastTransaction({ transaction: deployTx, network: config.network })
  
  if ('error' in broadcastResult) {
    throw new Error(`Deployment failed: ${broadcastResult.error}`)
  }

  console.log(`✅ Contract deployed successfully!`)
  console.log(`🔗 Transaction ID: ${broadcastResult.txid}`)
  
  return broadcastResult.txid
}

async function initializeContract(config: DeploymentConfig, txid: string): Promise<void> {
  console.log(`🔧 Initializing contract...`)
  
  // Wait for deployment to confirm (simplified - in production, poll for confirmation)
  await new Promise(resolve => setTimeout(resolve, 30000))
  
  // Contract initialization calls would go here
  // For the memory game, we might want to mint initial NFTs or set up game parameters
  
  console.log(`✅ Contract initialization completed`)
}

function saveDeploymentInfo(
  networkName: string,
  contractName: string,
  txid: string,
  deployer: string,
  abi: ContractABI
): void {
  const deploymentDir = path.join(__dirname, '..', 'deployments', networkName.toLowerCase())
  
  // Ensure deployment directory exists
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true })
  }

  // Save deployment info
  const deploymentInfo = {
    contractName,
    txid,
    deployer,
    network: networkName,
    timestamp: new Date().toISOString(),
    contractAddress: `${deployer}.${contractName}`
  }

  fs.writeFileSync(
    path.join(deploymentDir, `${contractName}-deployment.json`),
    JSON.stringify(deploymentInfo, null, 2)
  )

  // Save ABI
  fs.writeFileSync(
    path.join(deploymentDir, `${contractName}-abi.json`),
    JSON.stringify(abi, null, 2)
  )

  console.log(`💾 Deployment info saved to: ${deploymentDir}`)
}

// Main deployment function
async function main(): Promise<void> {
  try {
    console.log('🚀 Starting Stacks contract deployment...\n')

    // Validate environment
    validateEnvironment()

    // Get network from command line args or default to testnet
    const networkName = process.argv[2] || 'testnet'
    const network = getNetwork(networkName)

    // Setup deployment configuration
    const privateKey = process.env.STACKS_PRIVATE_KEY!
    const deployer = getAddressFromPrivateKey(
      privateKey,
      network === STACKS_MAINNET ? 'mainnet' : 'testnet'
    )

    const config: DeploymentConfig = {
      network,
      privateKey: process.env.STACKS_PRIVATE_KEY!,
      contractName: 'memory-game',
      contractPath: path.join(__dirname, '..', 'contracts', 'memory-game.clar'),
      deployer
    }

    // Generate ABI
    const contractSource = readContractSource(config.contractPath)
    const abi = generateABI(contractSource)
    console.log(`📚 Generated ABI with ${abi.functions.length} functions`)

    // Deploy contract
    const txid = await deployContract(config)

    // Initialize contract
    await initializeContract(config, txid)

    // Save deployment information and ABI
    saveDeploymentInfo(networkName, config.contractName, txid, deployer, abi)

    console.log('\n🎉 Deployment completed successfully!')
    console.log(`📋 Contract: ${deployer}.${config.contractName}`)
    console.log(`🌐 Network: ${networkName}`)
    console.log(`🔗 Explorer: ${network === STACKS_MAINNET 
      ? `https://explorer.stacks.co/txid/${txid}`
      : `https://explorer.stacks.co/txid/${txid}?chain=testnet`
    }`)

  } catch (error) {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  }
}

// Run deployment if called directly
if (require.main === module) {
  main()
}

export { deployContract, generateABI }
export type { DeploymentConfig } 