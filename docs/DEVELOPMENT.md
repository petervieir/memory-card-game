# Development Guide

Development patterns, workflows, and best practices.

## Quick Start

```bash
# Create feature branch
git checkout -b feature/my-feature

# Start development
npm run dev

# Test
npm run test
npm run lint
```

## Project Structure

### Frontend
```
front-end/src/
├── app/              # Next.js pages
├── components/       # React components
├── hooks/           # Custom hooks
├── lib/             # Utilities
├── stores/          # Zustand stores
└── types/           # TypeScript types
```

### Contracts
```
clarity/
├── contracts/       # Clarity contracts
├── tests/          # Contract tests
└── deployments/    # Deployment plans
```

## Coding Standards

- Use TypeScript interfaces for object shapes
- Follow React best practices
- Use Zustand for state management
- Write tests for new features
- Update documentation

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run deploy:testnet` | Deploy contracts |

## Testing

- Write unit tests for components
- Test contract functions
- Manual testing on multiple devices
- Test wallet integration
