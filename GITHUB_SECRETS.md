# 🔐 GitHub Secrets Configuration

This document outlines the required GitHub secrets for CI/CD deployment and automation.

## 📋 Required Secrets

### 🔑 GitHub Token

**Secret Name**: `GITHUB_TOKEN`

**Description**: Personal Access Token for GitHub API access

**Required Scopes**:
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows
- `write:packages` - Upload packages to GitHub Package Registry
- `read:org` - Read org and team membership

**How to Create**:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select the required scopes
4. Set expiration (recommend 1 year for CI/CD)
5. Copy the token and add it to your repository secrets

### 🌐 Vercel Configuration

**Secret Name**: `VERCEL_TOKEN`

**Description**: Vercel API token for deployment

**How to Get**:
1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token with appropriate scope
3. Copy the token

**Secret Name**: `VERCEL_ORG_ID`

**Description**: Vercel organization ID

**How to Get**:
1. Go to Vercel Dashboard → Settings → General
2. Copy the "Team ID" (this is your org ID)

**Secret Name**: `VERCEL_PROJECT_ID`

**Description**: Vercel project ID

**How to Get**:
1. Go to your project in Vercel Dashboard
2. Go to Settings → General
3. Copy the "Project ID"

### 🔗 Stacks Network Configuration

#### Testnet Environment

**Secret Name**: `TESTNET_DEPLOYER_ADDRESS`

**Description**: Stacks testnet address for contract deployment

**Secret Name**: `TESTNET_DEPLOYER_PRIVATE_KEY`

**Description**: Private key for the testnet deployer address

**Secret Name**: `TESTNET_FRONTEND_URL`

**Description**: Frontend URL for testnet deployment (e.g., https://your-app.vercel.app)

#### Mainnet Environment

**Secret Name**: `MAINNET_DEPLOYER_ADDRESS`

**Description**: Stacks mainnet address for contract deployment

**Secret Name**: `MAINNET_DEPLOYER_PRIVATE_KEY`

**Description**: Private key for the mainnet deployer address

**Secret Name**: `MAINNET_FRONTEND_URL`

**Description**: Frontend URL for mainnet deployment (e.g., https://your-app.com)

**Secret Name**: `HIRO_API_KEY`

**Description**: Hiro API key for mainnet operations

**How to Get**:
1. Go to [Hiro Developer Portal](https://dev.hiro.so/)
2. Create an account and generate an API key
3. Copy the API key

## 🚀 Setting Up Secrets

### Method 1: GitHub Web Interface

1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each secret with the exact name and value

### Method 2: GitHub CLI

```bash
# Install GitHub CLI
npm install -g @github/cli

# Login to GitHub
gh auth login

# Add secrets
gh secret set GITHUB_TOKEN --body "your_token_here"
gh secret set VERCEL_TOKEN --body "your_vercel_token_here"
gh secret set TESTNET_DEPLOYER_ADDRESS --body "your_testnet_address_here"
# ... continue for all secrets
```

### Method 3: Environment Variables (Local Development)

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

## 🔒 Security Best Practices

### Token Management

1. **Use Fine-Grained Tokens**: Create tokens with minimal required permissions
2. **Set Expiration Dates**: Don't create tokens that never expire
3. **Rotate Regularly**: Update tokens every 6-12 months
4. **Monitor Usage**: Check token usage in GitHub settings

### Private Key Security

1. **Use Dedicated Wallets**: Create separate wallets for deployment
2. **Never Commit Keys**: Never commit private keys to version control
3. **Use Hardware Wallets**: For mainnet, consider using hardware wallets
4. **Backup Securely**: Store private keys in secure password managers

### Environment Separation

1. **Separate Environments**: Use different keys for testnet/mainnet
2. **Environment-Specific Secrets**: Don't mix testnet and mainnet keys
3. **Access Control**: Limit who can access production secrets

## 🧪 Testing Secrets

### Verify GitHub Token

```bash
# Test GitHub API access
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### Verify Vercel Token

```bash
# Test Vercel API access
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user
```

### Verify Stacks Connection

```bash
# Test Stacks network connection
npm run test:contracts
```

## 🚨 Troubleshooting

### Common Issues

1. **Token Expired**: Check token expiration date and create new one
2. **Insufficient Permissions**: Verify token has required scopes
3. **Wrong Environment**: Ensure secrets are set for correct environment
4. **Network Issues**: Check if your IP is blocked by GitHub/Vercel

### Debug Commands

```bash
# Check GitHub token permissions
gh auth status

# Test Vercel connection
vercel whoami

# Test Stacks network
npm run console:devnet
```

## 📚 Additional Resources

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Vercel API Documentation](https://vercel.com/docs/api)
- [Stacks Documentation](https://docs.stacks.co)
- [Hiro Developer Portal](https://dev.hiro.so/)

---

**⚠️ Important**: Never share your private keys or tokens publicly. If a key is compromised, revoke it immediately and create a new one.
