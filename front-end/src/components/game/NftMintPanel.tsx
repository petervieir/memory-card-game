"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { openContractCall } from "@stacks/connect";
import { AnchorMode, stringAsciiCV } from "@stacks/transactions";
import { useWallet } from "@/contexts/WalletContext";
import { getStacksNetwork } from "@/lib/stacks";
import { uploadNftMetadata } from "@/lib/gaia";
import { SectionCard } from "@/components/ui";

interface DappInfo {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly bonus: string;
  readonly challenge: string;
}

const TEST_DAPPS: DappInfo[] = [
  {
    id: "stacksswap",
    name: "StacksSwap",
    url: "https://stacksswap.com",
    bonus: "10% trading fee discount",
    challenge: "Complete 5 trades to unlock the bonus",
  },
  {
    id: "hiro-wallet",
    name: "Hiro Wallet",
    url: "https://hiro.so",
    bonus: "Early access to wallet features",
    challenge: "Connect and verify your wallet",
  },
  {
    id: "gamma",
    name: "Gamma",
    url: "https://gamma.io",
    bonus: "Exclusive NFT drop access",
    challenge: "Collect any 3 NFTs",
  },
];

interface MintedNft {
  readonly dappId: string;
  readonly dappName: string;
  readonly gaiaUrl: string;
  readonly txId: string;
}

export function NftMintPanel() {
  const { address, userSession } = useWallet();
  const [selectedDappId, setSelectedDappId] = useState(TEST_DAPPS[0]?.id ?? "");
  const [isMinting, setIsMinting] = useState(false);
  const [minted, setMinted] = useState<MintedNft[]>([]);

  const contractAddress = process.env.NEXT_PUBLIC_DAPP_NFT_CONTRACT_ADDRESS;
  const contractName = process.env.NEXT_PUBLIC_DAPP_NFT_CONTRACT_NAME || "dapp-promo-nft";

  const selectedDapp = TEST_DAPPS.find((dapp) => dapp.id === selectedDappId);

  const handleMint = async () => {
    if (!address || !selectedDapp) {
      toast.error("Connect your wallet first");
      return;
    }
    if (!contractAddress) {
      toast.error("Missing NEXT_PUBLIC_DAPP_NFT_CONTRACT_ADDRESS");
      return;
    }

    try {
      setIsMinting(true);

      const metadata = {
        name: `${selectedDapp.name} Explorer Badge`,
        description: `Promotional NFT for ${selectedDapp.name}.`,
        image: "https://placehold.co/600x600/png?text=Stacks+dApp+NFT",
        external_url: selectedDapp.url,
        attributes: [
          { trait_type: "dapp_name", value: selectedDapp.name },
          { trait_type: "dapp_url", value: selectedDapp.url },
          { trait_type: "bonus", value: selectedDapp.bonus },
          { trait_type: "challenge", value: selectedDapp.challenge },
          { trait_type: "rarity", value: "Rare" },
        ],
        minted_at: new Date().toISOString(),
      };

      const gaiaFileName = `${selectedDapp.id}-${Date.now()}`;
      const gaiaUrl = await uploadNftMetadata(userSession, metadata, gaiaFileName);

      await new Promise<void>((resolve, reject) => {
        openContractCall({
          contractAddress,
          contractName,
          functionName: "mint-dapp-nft",
          functionArgs: [
            stringAsciiCV(selectedDapp.id),
            stringAsciiCV(gaiaUrl),
          ],
          network: getStacksNetwork(),
          anchorMode: AnchorMode.Any,
          onFinish: ({ txId }) => {
            setMinted((prev) => [
              {
                dappId: selectedDapp.id,
                dappName: selectedDapp.name,
                gaiaUrl,
                txId,
              },
              ...prev,
            ]);
            toast.success("Mint transaction submitted!");
            resolve();
          },
          onCancel: () => reject(new Error("Mint cancelled")),
        });
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Mint failed");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <SectionCard
      title="Test dApp NFT Mint (Testnet)"
      description="Manual mint for testing Gaia storage + SIP-009 NFT contract."
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Select dApp
            </label>
            <select
              value={selectedDappId}
              onChange={(event) => setSelectedDappId(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            >
              {TEST_DAPPS.map((dapp) => (
                <option key={dapp.id} value={dapp.id} className="text-black">
                  {dapp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground">
            <div className="font-semibold text-white">{selectedDapp?.name}</div>
            <div className="mt-1 text-xs">Bonus: {selectedDapp?.bonus}</div>
            <div className="mt-1 text-xs">Challenge: {selectedDapp?.challenge}</div>
          </div>
        </div>

        <button
          onClick={handleMint}
          disabled={isMinting || !address}
          className="rounded-full bg-solv-gold px-4 py-2 text-sm font-semibold text-solv-navy disabled:opacity-50"
        >
          {isMinting ? "Minting..." : "Mint Test NFT"}
        </button>

        {minted.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Minted NFTs
            </div>
            {minted.map((item) => (
              <div
                key={item.txId}
                className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground"
              >
                <div className="text-white">{item.dappName}</div>
                <div className="mt-1">
                  Metadata:{" "}
                  <a href={item.gaiaUrl} target="_blank" rel="noreferrer" className="text-solv-gold">
                    View Gaia JSON
                  </a>
                </div>
                <div className="mt-1">Tx: {item.txId}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
