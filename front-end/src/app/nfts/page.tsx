"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/contexts/WalletContext";
import { safeStorage } from "@/lib/storage";
import { AppShell, PageHeader, SectionCard } from "@/components/ui";
import { BalanceNetworkBadge } from "@/components/wallet/BalanceNetworkBadge";

interface MintedNft {
  readonly dappId: string;
  readonly dappName: string;
  readonly gaiaUrl: string;
  readonly txId: string;
}

export default function MyNftsPage() {
  const { address } = useWallet();
  const [minted, setMinted] = useState<MintedNft[]>([]);

  useEffect(() => {
    if (!address) {
      setMinted([]);
      return;
    }
    const storageKey = `minted_dapp_nfts_${address}`;
    const stored = safeStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as MintedNft[];
        setMinted(parsed);
      } catch {
        setMinted([]);
      }
    }
  }, [address]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-white">← Back to Home</Link>
          <BalanceNetworkBadge />
        </div>

        <PageHeader
          title="My dApp NFTs"
          description="View your test dApp NFTs and metadata stored in Gaia."
        />

        {!address && (
          <SectionCard className="mx-auto max-w-md text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-lg font-semibold text-white">Connect your wallet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect your wallet to see the NFTs you minted.
            </p>
          </SectionCard>
        )}

        {address && minted.length === 0 && (
          <SectionCard className="mx-auto max-w-md text-center">
            <div className="text-3xl mb-2">🧩</div>
            <h3 className="text-lg font-semibold text-white">No NFTs yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Mint a test dApp NFT from the game page to see it here.
            </p>
            <Link
              href="/game"
              className="mt-4 inline-flex rounded-full bg-solv-gold px-5 py-2 text-sm font-semibold text-solv-navy"
            >
              Go to Game
            </Link>
          </SectionCard>
        )}

        {address && minted.length > 0 && (
          <SectionCard>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {minted.map((nft) => (
                <div
                  key={nft.txId}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground"
                >
                  <div className="text-white font-semibold">{nft.dappName}</div>
                  <div className="mt-2">
                    Metadata:{" "}
                    <a
                      href={nft.gaiaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-solv-gold"
                    >
                      View Gaia JSON
                    </a>
                  </div>
                  <div className="mt-1 text-xs">Tx: {nft.txId}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </AppShell>
  );
}
