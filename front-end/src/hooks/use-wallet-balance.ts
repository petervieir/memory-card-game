import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/contexts/WalletContext";
import { getStacksNetwork } from "@/lib/stacks";

interface StacksAccountInfo {
  balance: string;
  locked: string;
  unlock_height: number;
  nonce: number;
}

/**
 * Custom hook to fetch STX balance for the connected wallet
 */
export function useWalletBalance() {
  const { address } = useWallet();

  return useQuery({
    queryKey: ["wallet-balance", address],
    queryFn: async (): Promise<StacksAccountInfo> => {
      if (!address) {
        throw new Error("No wallet address available");
      }

      const stacksNetwork = getStacksNetwork();
      const apiUrl = stacksNetwork.coreApiUrl;

      const response = await fetch(`${apiUrl}/v1/accounts/${address}`);

      // Handle 404 for new/unfunded addresses
      if (response.status === 404) {
        console.log("ℹ️ Address not found (likely new/unfunded):", address);
        return {
          balance: "0",
          locked: "0",
          unlock_height: 0,
          nonce: 0,
        };
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: (failureCount, error) => {
      // Don't retry on 404 (new address)
      if ((error as Error)?.message?.includes("404")) return false;
      return failureCount < 3;
    },
  });
}

/**
 * Hook to get formatted STX balance
 */
export function useFormattedBalance() {
  const { data: balance, ...rest } = useWalletBalance();

  const formattedBalance = balance
    ? (parseInt(balance.balance) / 1_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      })
    : "0.00";

  return {
    balance: formattedBalance,
    rawBalance: balance,
    ...rest,
  };
}
