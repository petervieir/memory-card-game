#!/bin/bash

# 🚀 Deployment Script
# Deploy contracts and frontend to different environments

set -e

ENVIRONMENT=${1:-devnet}
VALID_ENVS=("devnet" "testnet" "mainnet")

# Function to display usage
usage() {
    echo "Usage: $0 [environment]"
    echo ""
    echo "Environments:"
    echo "  devnet   - Deploy to local devnet (default)"
    echo "  testnet  - Deploy to Stacks testnet"
    echo "  mainnet  - Deploy to Stacks mainnet"
    echo ""
    echo "Examples:"
    echo "  $0              # Deploy to devnet"
    echo "  $0 testnet      # Deploy to testnet"
    echo "  $0 mainnet      # Deploy to mainnet"
}

# Validate environment
if [[ ! " ${VALID_ENVS[@]} " =~ " ${ENVIRONMENT} " ]]; then
    echo "❌ Invalid environment: $ENVIRONMENT"
    usage
    exit 1
fi

echo "🚀 Deploying to $ENVIRONMENT environment..."

# Check if required files exist
if [ "$ENVIRONMENT" != "devnet" ]; then
    if [ ! -f "clarity/.env.local" ]; then
        echo "❌ clarity/.env.local not found. Please create it with your deployment keys."
        exit 1
    fi
fi

# Deploy contracts
echo "📄 Deploying Clarity contracts..."
cd clarity

case $ENVIRONMENT in
    "devnet")
        npm run deploy:devnet
        ;;
    "testnet")
        npm run deploy:testnet
        ;;
    "mainnet")
        echo "⚠️  MAINNET DEPLOYMENT - Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            # Add mainnet deployment command when ready
            echo "🚧 Mainnet deployment not configured yet"
            exit 1
        else
            echo "❌ Deployment cancelled"
            exit 1
        fi
        ;;
esac

cd ..

# Build frontend for production
echo "🏗️  Building frontend..."
cd front-end
npm run build:production
cd ..

echo ""
echo "🎉 Deployment to $ENVIRONMENT complete!"
echo ""
echo "📋 Next steps:"
if [ "$ENVIRONMENT" = "devnet" ]; then
    echo "  1. Start your frontend: npm run dev:frontend"
    echo "  2. Visit http://localhost:3000"
else
    echo "  1. Deploy your frontend to hosting platform"
    echo "  2. Update environment variables with deployed contract addresses"
fi
echo "" 