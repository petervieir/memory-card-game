#!/bin/bash

# 🧪 Comprehensive Testing Script
# Run all tests across the project

set -e

echo "🧪 Running comprehensive test suite..."

# Test Clarity contracts
echo ""
echo "📄 Testing Clarity contracts..."
cd clarity
npm run check
echo "✅ Contract validation passed"
cd ..

# Test frontend
echo ""
echo "⚛️  Testing frontend..."
cd front-end
npm run type-check
npm run lint
npm run test
cd ..

# Run integration checks
echo ""
echo "🔗 Running integration checks..."
npm run lint
npm run format:check

echo ""
echo "✅ All tests passed!"
echo ""
echo "📊 Test Summary:"
echo "  ✅ Clarity contracts: Passed"
echo "  ✅ Frontend: Passed"  
echo "  ✅ Linting: Passed"
echo "  ✅ Type checking: Passed"
echo "" 