/**
 * Devnet Deployment Configuration
 * Local development environment settings
 */

module.exports = {
  name: "devnet",
  description: "Local development network",

  // Network settings
  network: {
    name: "devnet",
    apiUrl: "http://localhost:3999",
    bitcoinApiUrl: "http://localhost:18443",
    explorerUrl: "http://localhost:8000",
  },

  // Contract deployment settings
  contracts: {
    deployer: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", // Default devnet address
    deploymentPath: "./clarity/deployments/default.devnet-plan.yaml",
    fee: 5000, // microSTX
  },

  // Frontend settings
  frontend: {
    buildCommand: "npm run build",
    outputDir: ".next",
    port: 3000,
    env: {
      NEXT_PUBLIC_STACKS_NETWORK: "mocknet",
      NEXT_PUBLIC_STACKS_API_URL: "http://localhost:3999",
      NEXT_PUBLIC_AUTH_ORIGIN: "http://localhost:3000",
    },
  },

  // Development tools
  tools: {
    enableDebug: true,
    hotReload: true,
    autoRestart: true,
  },
};
