#!/bin/bash

# 🚀 Development Setup Script
# This script sets up the entire development environment

set -e

echo "🔧 Setting up Stacks + Next.js Template Development Environment..."

# Check Node.js version
echo "📋 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build all packages
echo "🏗️  Building packages..."
npm run build

# Check if Clarinet is installed
echo "📋 Checking Clarinet installation..."
if ! command -v clarinet &> /dev/null; then
    echo "⚠️  Clarinet is not installed. Installing via npm..."
    npm install -g @hirosystems/clarinet
else
    echo "✅ Clarinet is installed: $(clarinet --version)"
fi

# Setup environment files
echo "🔧 Setting up environment files..."
if [ ! -f "front-end/.env.local" ]; then
    echo "📄 Creating front-end/.env.local from template..."
    cp front-end/.env.example front-end/.env.local
fi

if [ ! -f "clarity/.env.local" ]; then
    echo "📄 Creating clarity/.env.local from template..."
    cp clarity/.env.example clarity/.env.local
fi

# Check contracts
echo "🔍 Checking Clarity contracts..."
cd clarity && npm run check && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Update environment variables in .env.local files"
echo "  2. Run 'npm run dev' to start development"
echo "  3. Visit http://localhost:3000 to see your dApp"
echo ""
echo "🛠️  Available commands:"
echo "  npm run dev              - Start all development servers"
echo "  npm run dev:frontend     - Start only frontend"
echo "  npm run dev:contracts    - Start Clarinet console"
echo "  npm run test             - Run all tests"
echo "  npm run lint             - Check code quality"
echo "" 