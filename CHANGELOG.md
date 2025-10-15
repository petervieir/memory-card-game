# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.2.0] - 2024-12-17

### Added
- **feat**: Strategic Hint System with point-based card pair reveals
- **feat**: Difficulty-based hint limits (1-3 hints per game depending on difficulty)
- **feat**: 3-second temporary card reveal when using hints
- **feat**: Point cost system (50 points per hint)
- **feat**: Hint counter display showing remaining hints
- **feat**: Visual feedback with toast notifications for hint usage
- **feat**: "No Hints Master" achievement for completing games without hints
- **feat**: "Strategic Thinker" achievement for efficient hint usage on difficult levels
- **docs**: Comprehensive hint system documentation (HINT_SYSTEM.md)
- **docs**: Updated FEATURES.md to reflect 15 total achievements

### Changed
- **improve**: GameBoard now tracks hint usage for achievement system
- **improve**: Card rendering supports hint-revealed state
- **improve**: Game completion data includes hints used for analytics
- **improve**: Point economy expanded with spending mechanism

### Technical
- **feat**: Added `maxHints` field to Difficulty interface
- **feat**: Added `hintsUsed` tracking in GameCompletionData
- **feat**: New `useHint` callback function with validation and reveal logic
- **feat**: State management for hint reveals with auto-reset timer
- **feat**: Integration with points store's `spendPoints` function
- **perf**: Efficient unmatched pair selection algorithm

## [3.1.0] - 2024-12-17

### Added
- **feat**: Comprehensive achievement system with 13 achievements across 4 categories
- **feat**: Real-time achievement notifications with visual feedback
- **feat**: Dedicated achievements page with category filtering
- **feat**: Achievement progress tracking with category breakdown
- **feat**: Per-wallet achievement persistence and progress tracking
- **feat**: Achievement integration with home page progress display
- **docs**: Complete achievement system documentation (ACHIEVEMENT_SYSTEM.md)
- **docs**: Updated all documentation to reflect latest features

### Changed
- **improve**: Enhanced home page with achievement progress display
- **improve**: GameBoard integration with achievement unlocking flow
- **improve**: Points store extended with achievement functionality
- **improve**: UI components with achievement status indicators

### Technical
- **feat**: Achievement evaluation system with condition-based unlocking
- **feat**: Category-based achievement organization and filtering
- **feat**: SSR-safe achievement progress tracking
- **perf**: Optimized achievement lookup and progress calculation

## [3.0.0] - 2024-12-17

### Added
- **feat**: Master difficulty level (32 cards, 8×4 grid, 2.5x multiplier)
- **feat**: Progressive difficulty unlock system
- **feat**: Per-wallet progress tracking with best scores
- **feat**: Visual unlock indicators (🔒 locked, ✅ completed)
- **feat**: Unlock notifications when completing levels
- **feat**: Enhanced difficulty selector with progress display
- **docs**: Updated documentation for 6-level system and unlock mechanics

### Changed
- **refactor**: Difficulty system now requires sequential completion
- **improve**: Grid system supports up to 8 columns for Master level
- **improve**: Enhanced UI feedback for locked/unlocked states
- **improve**: Progress persistence across wallet connections

### Technical
- **feat**: New `useDifficultyStore` for progress management
- **feat**: Integration with wallet context for progress tracking
- **perf**: Efficient progress state management with Zustand

## [2.1.0] - 2024-12-17

### Added
- **docs**: Comprehensive documentation hygiene improvements
- **docs**: GitHub issue and PR templates with documentation checklist
- **docs**: Features documentation index ([FEATURES.md](./FEATURES.md))
- **docs**: Conventional commits changelog ([CHANGELOG.md](./CHANGELOG.md))
- **docs**: Contributing guidelines with documentation emphasis

## [2.0.0] - 2024-12-17

### Added
- **feat**: Dynamic card sizing system based on window size and grid density
- **feat**: Responsive card sizing hook (`useCardSize`)
- **feat**: Automatic gap adjustment based on card size
- **feat**: Icon scaling based on card dimensions
- **docs**: Comprehensive dynamic sizing documentation

### Changed
- **refactor**: Card component to accept dynamic size classes
- **refactor**: GameBoard container to be fully responsive
- **improve**: Card sizing for better mobile experience
- **improve**: Grid layout optimization for all screen sizes

### Technical
- **perf**: Real-time window resize handling
- **perf**: Efficient card size calculations
- **fix**: Nested ternary linting warning

## [1.0.0] - 2024-12-17

### Added
- **feat**: Five-level difficulty system (Beginner to Expert)
- **feat**: Progressive card counts: 12, 16, 20, 24, 28 cards
- **feat**: Dynamic grid layouts: 4×3 to 7×4 grids
- **feat**: Difficulty-based scoring multipliers (1.0× to 2.2×)
- **feat**: Enhanced scoring system with base points and efficiency bonuses
- **feat**: Difficulty selection interface with visual feedback
- **docs**: Comprehensive difficulty system documentation

### Changed
- **refactor**: Game initialization to support multiple difficulties
- **refactor**: Scoring calculation with difficulty multipliers
- **improve**: Grid layout to support up to 7 columns
- **improve**: Game stats display with difficulty information

### Fixed
- **fix**: Game completion scoring with proper multipliers
- **fix**: Grid className generation for new column counts

## [0.2.0] - 2024-12-16

### Added
- **feat**: Complete memory card game implementation
- **feat**: Stacks wallet integration (Hiro/Leather)
- **feat**: On-chain score tracking on Stacks testnet
- **feat**: Points system with local storage
- **feat**: Image pool management system
- **feat**: Responsive design with TailwindCSS
- **feat**: Modern UI components with Radix UI

### Technical
- **feat**: Smart contract deployment on testnet
- **feat**: Multi-network support (devnet, testnet, mainnet)
- **feat**: TypeScript implementation
- **feat**: Testing setup with Jest and Vitest
- **feat**: Performance monitoring with Vercel Analytics

## [0.1.0] - 2024-12-15

### Added
- **feat**: Initial project setup with Next.js 13+ App Router
- **feat**: Monorepo structure with Turborepo
- **feat**: Clarity smart contracts for score tracking
- **feat**: Basic game board and card components
- **feat**: Wallet connection infrastructure
- **feat**: Development environment setup

### Technical
- **feat**: ESLint and Prettier configuration
- **feat**: TypeScript configuration
- **feat**: Tailwind CSS setup
- **feat**: Clarinet development environment
- **feat**: Deployment configuration for Vercel

---

## Commit Message Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Scopes (optional)
- **game**: Game logic and mechanics
- **ui**: User interface components
- **wallet**: Wallet integration
- **contracts**: Smart contracts
- **docs**: Documentation
- **config**: Configuration files

### Examples
```
feat(game): add difficulty selection system
fix(wallet): handle connection timeout errors
docs: update README with new features
refactor(ui): extract card component logic
perf(game): optimize image loading performance
```

### Breaking Changes
Breaking changes should include `BREAKING CHANGE:` in the commit body or footer:

```
feat(game): redesign scoring system

BREAKING CHANGE: The scoring calculation has been completely redesigned.
Previous score data may not be compatible with the new system.
```

---

**Note**: Dates are in YYYY-MM-DD format. All changes are documented from the perspective of the user experience and developer impact.
