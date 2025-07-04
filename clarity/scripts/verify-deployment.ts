#!/usr/bin/env node

import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions'
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

// Types
interface DeploymentInfo {
  contractName: string
  txid: string
  deployer: string
  network: string
  timestamp: string
  contractAddress: string
}

// Helper functions
function getNetwork(networkName: string) {
  switch (networkName.toLowerCase()) {
    case 'testnet':
      return STACKS_TESTNET
    case 'mainnet':
      return STACKS_MAINNET
    default:
      throw new Error(`Unsupported network: ${networkName}`)
  }
}

function loadDeploymentInfo(networkName: string, contractName: string): DeploymentInfo {
  const deploymentPath = path.join(
    __dirname,
    '..',
    'deployments',
    networkName.toLowerCase(),
    `${contractName}-deployment.json`
  )
  
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment info not found: ${deploymentPath}`)
  }
  
  return JSON.parse(fs.readFileSync(deploymentPath, 'utf8'))
}

async function verifyContractDeployment(
  network: any,
  contractAddress: string,
  contractName: string
): Promise<void> {
  console.log(`🔍 Verifying contract deployment...`)
  
  try {
    // Test read-only function calls
    const tests = [
      {
        name: 'get-last-token-id',
        description: 'Check last token ID',
        args: []
      },
      {
        name: 'get-player-game-uri',
        description: 'Check player game URI getter',
        args: [standardPrincipalCV(contractAddress.split('.')[0])]
      }
    ]

    for (const test of tests) {
      console.log(`  ⏳ Testing ${test.name}...`)
      
      try {
        const result = await fetchCallReadOnlyFunction({
          contractAddress,
          contractName,
          functionName: test.name,
          functionArgs: test.args,
          senderAddress: contractAddress.split('.')[0],
          network,
        })

        const jsonResult = cvToJSON(result)
        console.log(`  ✅ ${test.description}: ${JSON.stringify(jsonResult.value)}`)
      } catch (error) {
        console.log(`  ❌ ${test.description}: Failed - ${error}`)
      }
    }

  } catch (error) {
    throw new Error(`Contract verification failed: ${error}`)
  }
}

async function checkTransactionStatus(network: any, txid: string): Promise<void> {
  console.log(`🔍 Checking transaction status...`)
  
  const apiUrl = network === STACKS_MAINNET
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so'
  
  try {
    const response = await fetch(`${apiUrl}/extended/v1/tx/${txid}`)
    const txData = await response.json()
    
    console.log(`  📊 Status: ${txData.tx_status}`)
    console.log(`  ⛽ Fee: ${txData.fee_rate} STX`)
    console.log(`  🏗️  Block: ${txData.block_height || 'Pending'}`)
    
    if (txData.tx_status === 'success') {
      console.log(`  ✅ Transaction confirmed successfully`)
    } else if (txData.tx_status === 'pending') {
      console.log(`  ⏳ Transaction still pending...`)
    } else {
      console.log(`  ❌ Transaction failed: ${txData.tx_result?.repr || 'Unknown error'}`)
    }
    
  } catch (error) {
    console.log(`  ❌ Failed to fetch transaction: ${error}`)
  }
}

// Main verification function
async function main(): Promise<void> {
  try {
    console.log('🔍 Starting deployment verification...\n')

    const networkName = process.argv[2] || 'testnet'
    const contractName = process.argv[3] || 'memory-game'
    
    const network = getNetwork(networkName)
    const deploymentInfo = loadDeploymentInfo(networkName, contractName)
    
    console.log(`📋 Contract: ${deploymentInfo.contractAddress}`)
    console.log(`🌐 Network: ${deploymentInfo.network}`)
    console.log(`📅 Deployed: ${deploymentInfo.timestamp}`)
    console.log(`🔗 Transaction: ${deploymentInfo.txid}\n`)

    // Check transaction status
    await checkTransactionStatus(network, deploymentInfo.txid)
    console.log()

    // Verify contract functionality
    await verifyContractDeployment(
      network,
      deploymentInfo.contractAddress,
      contractName
    )

    console.log('\n✅ Verification completed!')
    
  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

// Run verification if called directly
if (require.main === module) {
  main()
} 