// Network types
export type StacksNetwork = "mainnet" | "testnet" | "mocknet";

// Wallet connection types
export interface WalletInfo {
  address: string;
  publicKey: string;
  network: StacksNetwork;
}

// Basic transaction types
export interface TransactionResult {
  txId: string;
  error?: string;
}

// Account info from Stacks API
export interface StacksAccount {
  balance: string;
  locked: string;
  unlock_height: number;
  nonce: number;
}

// Basic API response type
export interface StacksApiResponse<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}
