# Memory Card Game Frontend

Frontend for the Memory Card Game on Stacks, with a focus on simplicity and Devnet-first development.

## Features

- Next.js 13+ (App Router)
- Radix UI + TailwindCSS for beautiful, accessible components
- Stacks wallet connect/disconnect (Hiro/Leather)
- Zustand, React Query, and best-practice project structure
- Devnet (mocknet) ready by default
- Easily switch between Devnet, Testnet, and Mainnet

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the Dev Server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Connect your Stacks wallet** (Hiro/Leather) on Devnet (mocknet).

## Switching Networks

By default, the project uses **Devnet (mocknet)**. To switch networks, set the environment variable:

```bash
NEXT_PUBLIC_STACKS_NETWORK=mainnet   # or testnet, or mocknet
```

You can add this to a `.env.local` file:

```
NEXT_PUBLIC_STACKS_NETWORK=mocknet
NEXT_PUBLIC_AUTH_ORIGIN=http://localhost:3000

> Tip: You can copy from `.env.local.example` if present.
```

## Project Structure

- `front-end/` — Next.js app, UI, wallet connect, and global state
- `clarity/` — (optional) Clarity contracts, not included by default
- `src/components/wallet/ConnectWallet.tsx` — Wallet connect/disconnect UI
- `src/contexts/WalletContext.tsx` — Global wallet state/context
- `src/lib/stacks.ts` — Stacks network config and utilities

## What’s Included

- No example contracts or voting logic — just the essentials to start your own dApp
- All packages and structure for rapid Stacks dApp development

## Next Steps

- Add your own pages, components, and contract logic as needed
- Deploy your own Clarity contracts to Devnet, Testnet, or Mainnet

---

**Happy building!**
