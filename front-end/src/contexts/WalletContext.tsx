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
const userSession = new UserSession({ appConfig });

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

  const refresh = useCallback(() => {
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
  }, []);

  // Keep address in sync across tabs and wallet state changes
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "blockstack-session") {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
