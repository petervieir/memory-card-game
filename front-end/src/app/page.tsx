"use client";

import { ConnectWallet } from "@/components/wallet/ConnectWallet";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 stacks-gradient bg-clip-text text-transparent">
            Memory Card Game
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Play a simple memory card game on Stacks. Connect your wallet to earn
            points you can use in the store.
          </p>
        </div>

        {/* Connect Wallet Section */}
        <div className="max-w-xl mx-auto flex justify-center">
          <ConnectWallet />
        </div>
      </div>
    </main>
  );
}
