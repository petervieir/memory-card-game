/**
 * Testnet Deployment Configuration
 * Stacks testnet environment settings
 */

module.exports = {
  name: "testnet",
  description: "Stacks testnet environment",

  // Network settings
  network: {
    name: "testnet",
    apiUrl: "https://stacks-node-api.testnet.stacks.co",
    bitcoinApiUrl: "https://blockstream.info/testnet/api",
    explorerUrl: "https://explorer.stacks.co/",
  },

  // Contract deployment settings
  contracts: {
    deployer: process.env.TESTNET_DEPLOYER_ADDRESS,
    privateKey: process.env.TESTNET_DEPLOYER_PRIVATE_KEY,
    deploymentPath: "./clarity/deployments/default.testnet-plan.yaml",
    fee: 10000, // microSTX
    requireConfirmation: true,
  },

  // Frontend settings
  frontend: {
    buildCommand: "npm run build:production",
    outputDir: ".next",
    env: {
      NEXT_PUBLIC_STACKS_NETWORK: "testnet",
      NEXT_PUBLIC_STACKS_API_URL: "https://stacks-node-api.testnet.stacks.co",
      NEXT_PUBLIC_AUTH_ORIGIN: process.env.TESTNET_FRONTEND_URL,
    },
  },

  // Deployment validation
  validation: {
    checkBalance: true,
    minBalance: 100000, // microSTX
    requireEnvVars: [
      "TESTNET_DEPLOYER_ADDRESS",
      "TESTNET_DEPLOYER_PRIVATE_KEY",
      "TESTNET_FRONTEND_URL",
    ],
  },
};
