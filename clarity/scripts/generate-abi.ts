#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import { generateABI } from './deploy'

// Main ABI generation function
async function main(): Promise<void> {
  try {
    console.log('📚 Generating contract ABI...\n')

    const contractName = process.argv[2] || 'memory-game'
    const contractPath = path.join(__dirname, '..', 'contracts', `${contractName}.clar`)
    
    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found: ${contractPath}`)
    }

    // Read contract source
    const contractSource = fs.readFileSync(contractPath, 'utf8')
    
    // Generate ABI
    const abi = generateABI(contractSource)
    
    // Save ABI to output directory
    const outputDir = path.join(__dirname, '..', 'abi')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    const abiPath = path.join(outputDir, `${contractName}-abi.json`)
    fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2))
    
    console.log(`✅ ABI generated successfully!`)
    console.log(`📂 Output: ${abiPath}`)
    console.log(`📊 Functions: ${abi.functions.length}`)
    console.log(`📊 Variables: ${abi.variables.length}`)
    console.log(`📊 Maps: ${abi.maps.length}`)
    console.log(`📊 NFTs: ${abi.non_fungible_tokens.length}`)
    
    // Display function summary
    if (abi.functions.length > 0) {
      console.log('\n📋 Functions:')
      abi.functions.forEach(func => {
        console.log(`  • ${func.name} (${func.access})`)
      })
    }
    
  } catch (error) {
    console.error('❌ ABI generation failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
} 