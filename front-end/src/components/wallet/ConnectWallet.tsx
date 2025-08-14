"use client";

import { useState } from "react";
import { showConnect } from "@stacks/connect";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { truncateAddress } from "@/lib/utils";
import { CopyIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useWallet } from "@/contexts/WalletContext";

export function ConnectWallet() {
  const { address, userSession, refresh } = useWallet();
  const [didCopy, setDidCopy] = useState(false);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: "Stacks dApp Template (Next.js)",
        icon: window.location.origin + "/icon.png",
      },
      userSession,
      onFinish: () => {
        refresh();
        toast.success("Wallet connected!");
      },
      onCancel: () => {
        toast("Connection cancelled.");
      },
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut(window.location.origin);
    refresh();
    toast.success("Wallet disconnected.");
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setDidCopy(true);
      setTimeout(() => setDidCopy(false), 1000);
    }
  };

  if (address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Wallet Connected</CardTitle>
          <CardDescription>You are connected to Stacks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-mono text-sm">
              {truncateAddress(address)}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAddress}
                title={didCopy ? "Copied!" : "Copy address"}
              >
                <CopyIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDisconnect}
                title="Disconnect"
              >
                <Cross1Icon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connect Wallet</CardTitle>
        <CardDescription>Connect your wallet to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="stacks"
          size="lg"
          className="w-full"
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      </CardContent>
    </Card>
  );
}

export default ConnectWallet;
