import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { AppConfig, UserSession } from "@stacks/auth";

const appConfig = new AppConfig(["store_write"]);

// Initialize userSession safely for SSR
let userSession: UserSession;
if (typeof window !== 'undefined') {
  userSession = new UserSession({ appConfig });
} else {
  // Create a mock session for SSR that won't cause errors
  userSession = {
    isUserSignedIn: () => false,
    loadUserData: () => null,
  } as UserSession;
}

type WalletContextType = {
  address: string | null;
  userSession: UserSession;
  refresh: () => void;
};

const WalletContext = createContext<WalletContextType>({
  address: null,
  userSession,
  refresh: () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before accessing wallet functions
  useEffect(() => {
    setIsClient(true);
  }, []);

  const refresh = useCallback(() => {
    // Only run on client side to avoid SSR issues
    if (!isClient || typeof window === 'undefined') {
      return;
    }

    try {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || "testnet";
        // Choose correct address by network
        if (networkType === "mainnet") {
          setAddress(userData?.profile?.stxAddress?.mainnet ?? null);
        } else {
          // testnet or mocknet/devnet -> use testnet address
          setAddress(userData?.profile?.stxAddress?.testnet ?? null);
        }
      } else {
        setAddress(null);
      }
    } catch (error) {
      console.warn('Error refreshing wallet session:', error);
      setAddress(null);
    }
  }, [isClient]);

  // Keep address in sync across tabs and wallet state changes
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const onStorage = (event: StorageEvent) => {
      if (event.key === "blockstack-session") {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh, isClient]);

  useEffect(() => {
    if (isClient) {
      refresh();
    }
  }, [refresh, isClient]);

  const contextValue = useMemo(
    () => ({ address, userSession, refresh }),
    [address, refresh]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
