/**
 * Mainnet Deployment Configuration
 * Production Stacks mainnet environment settings
 */

module.exports = {
  name: "mainnet",
  description: "Stacks mainnet production environment",

  // Network settings
  network: {
    name: "mainnet",
    apiUrl: "https://stacks-node-api.mainnet.stacks.co",
    bitcoinApiUrl: "https://blockstream.info/api",
    explorerUrl: "https://explorer.stacks.co/",
  },

  // Contract deployment settings
  contracts: {
    deployer: process.env.MAINNET_DEPLOYER_ADDRESS,
    privateKey: process.env.MAINNET_DEPLOYER_PRIVATE_KEY,
    deploymentPath: "./clarity/deployments/default.mainnet-plan.yaml",
    fee: 20000, // microSTX
    requireConfirmation: true,
    requireBackup: true,
  },

  // Frontend settings
  frontend: {
    buildCommand: "npm run build:production",
    outputDir: ".next",
    env: {
      NEXT_PUBLIC_STACKS_NETWORK: "mainnet",
      NEXT_PUBLIC_STACKS_API_URL: "https://stacks-node-api.mainnet.stacks.co",
      NEXT_PUBLIC_AUTH_ORIGIN: process.env.MAINNET_FRONTEND_URL,
    },
  },

  // Production security
  security: {
    requireMultiSig: false, // Set to true for multi-sig wallets
    backupRequired: true,
    auditRequired: true,
  },

  // Deployment validation
  validation: {
    checkBalance: true,
    minBalance: 500000, // microSTX
    requireEnvVars: [
      "MAINNET_DEPLOYER_ADDRESS",
      "MAINNET_DEPLOYER_PRIVATE_KEY",
      "MAINNET_FRONTEND_URL",
      "HIRO_API_KEY",
    ],
    contractAudit: true,
    securityChecks: true,
  },
};
