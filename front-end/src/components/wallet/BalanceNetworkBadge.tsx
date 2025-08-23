"use client";

import { useFormattedBalance } from '@/hooks/use-wallet-balance';
import { useWallet } from '@/contexts/WalletContext';

/**
 * Component that displays wallet balance and current network
 */
export function BalanceNetworkBadge() {
  const { address } = useWallet();
  const { balance, isLoading, error } = useFormattedBalance();
  
  // Get network from environment
  const network = process.env.NEXT_PUBLIC_STACKS_NETWORK || "testnet";
  const networkDisplayName = network === "mocknet" ? "devnet" : network;

  if (!address) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-xs">
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        <span className="text-muted-foreground">No wallet connected</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground capitalize">{networkDisplayName}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-xs">
      {/* Network indicator */}
      <div className={`w-2 h-2 rounded-full ${
        network === "mainnet" ? "bg-green-400" : 
        network === "testnet" ? "bg-yellow-400" : 
        "bg-blue-400"
      }`}></div>
      
      {/* Balance */}
      <span className="font-medium">
        {isLoading ? "..." : error ? "Error" : `${balance} STX`}
      </span>
      
      {/* Separator */}
      <span className="text-muted-foreground">•</span>
      
      {/* Network */}
      <span className="text-muted-foreground capitalize">{networkDisplayName}</span>
    </div>
  );
}
