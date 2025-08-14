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
      setAddress(
        userData.profile.stxAddress.mainnet ||
          userData.profile.stxAddress.testnet
      );
    } else {
      setAddress(null);
    }
  }, []);

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
