# Contributing to Memory Card Game

Thank you for your interest in contributing to the Memory Card Game! This document provides guidelines for contributing to the project.

## 🚀 Quick Start for Contributors

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install` in the project root
3. **Start development**: `npm run dev` for the frontend
4. **Make your changes** following our guidelines below
5. **Test thoroughly** across different devices and difficulty levels
6. **Submit a pull request** with proper documentation

## 📋 Contribution Checklist

Before submitting any contribution, please ensure:

### Code Quality
- [ ] Code follows existing style conventions
- [ ] TypeScript types are properly defined
- [ ] ESLint passes without errors
- [ ] Code is properly commented
- [ ] No console.log statements left in production code

### Testing
- [ ] Manual testing completed on multiple screen sizes
- [ ] All difficulty levels tested (if game mechanics changed)
- [ ] Wallet integration tested (if applicable)
- [ ] Automated tests added/updated for new functionality
- [ ] All existing tests still pass

### Documentation Checklist ⭐
**This is critical - please don't skip this section!**

- [ ] **Code Documentation**
  - [ ] New functions/components have JSDoc comments
  - [ ] Complex logic is explained with inline comments
  - [ ] Type definitions include descriptions where helpful

- [ ] **User Documentation**
  - [ ] [FEATURES.md](./FEATURES.md) updated if new features added
  - [ ] [README.md](./README.md) updated if main functionality changed
  - [ ] [front-end/README.md](./front-end/README.md) updated if frontend changes

- [ ] **Specialized Documentation**
  - [ ] [DIFFICULTY_SYSTEM.md](./DIFFICULTY_SYSTEM.md) updated if difficulty mechanics changed
  - [ ] [DYNAMIC_SIZING.md](./DYNAMIC_SIZING.md) updated if sizing logic changed
  - [ ] New `.md` files created for significant new features

- [ ] **Changelog**
  - [ ] [CHANGELOG.md](./CHANGELOG.md) updated with proper conventional commit format
  - [ ] Version bump considered (if breaking changes)

- [ ] **Cross-References**
  - [ ] Links between related documentation updated
  - [ ] New features referenced in appropriate existing docs
  - [ ] Screenshots/examples updated if UI changed

## 🎯 Types of Contributions

### 🐛 Bug Fixes
- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include steps to reproduce and expected behavior
- Test fix across different screen sizes and difficulties

### ✨ New Features
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Discuss major features in issues before implementing
- Consider impact on existing game balance and UX

### 📚 Documentation
- Use the [documentation template](.github/ISSUE_TEMPLATE/documentation.md)
- Even small documentation improvements are valuable!
- Ensure accuracy and clarity for different skill levels

### 🎨 UI/UX Improvements
- Test changes across all difficulty levels
- Verify responsive behavior on mobile/tablet/desktop
- Consider accessibility implications

## 🎮 Game-Specific Guidelines

### Difficulty System Changes
If modifying the difficulty system:
- Test all 5 difficulty levels (Beginner through Expert)
- Verify scoring calculations work correctly
- Update [DIFFICULTY_SYSTEM.md](./DIFFICULTY_SYSTEM.md)
- Consider impact on existing player progress

### UI/Layout Changes
If modifying the user interface:
- Test dynamic card sizing across different screen sizes
- Verify grid layouts work for all difficulty levels (4×3 to 7×4)
- Update [DYNAMIC_SIZING.md](./DYNAMIC_SIZING.md) if sizing logic changes
- Include screenshots in your PR

### Smart Contract Changes
If modifying Clarity contracts:
- Include comprehensive tests for new functionality
- Consider gas costs and optimization
- Document any breaking changes
- Test on devnet/testnet before mainnet

## 💻 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Stacks wallet (Hiro/Leather) for testing

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/MemoryCardGame.git
cd MemoryCardGame

# Install dependencies
npm install

# Start frontend development
cd front-end
npm run dev

# Start contract testing (in another terminal)
cd clarity
npx clarinet test
```

### Testing Guidelines
- Test all difficulty levels when making game changes
- Verify responsive design on mobile/tablet/desktop
- Test wallet connection and on-chain transactions
- Run automated tests: `npm test`

## 📝 Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Build/tooling changes

### Examples
```
feat(game): add timer challenge mode
fix(ui): resolve card sizing on mobile devices
docs: update difficulty system documentation
refactor(wallet): improve connection error handling
```

## 🔍 Code Review Process

1. **Automated Checks**: PR must pass all CI checks
2. **Manual Review**: Code reviewed by maintainers
3. **Documentation Review**: Ensure docs checklist completed
4. **Testing Verification**: Functionality tested by reviewers
5. **Approval**: At least one maintainer approval required

## 🆘 Getting Help

- **Questions**: Open a [Discussion](https://github.com/your-username/MemoryCardGame/discussions)
- **Bugs**: Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Features**: Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Documentation**: Use the [documentation template](.github/ISSUE_TEMPLATE/documentation.md)

## 📋 Pull Request Template

When submitting a PR, our [template](.github/pull_request_template.md) includes a comprehensive documentation checklist. Please complete it thoroughly - this helps maintain our high documentation standards and makes the project accessible to all contributors.

## 🙏 Recognition

Contributors who help improve documentation are especially valued! Good documentation makes the project accessible to everyone and is just as important as code contributions.

Thank you for contributing to making the Memory Card Game better for everyone! 🎮
