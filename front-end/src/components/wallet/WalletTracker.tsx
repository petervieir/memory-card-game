"use client";

import { useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { usePointsStore } from '@/stores/usePointsStore';

/**
 * Global wallet tracker component that handles wallet state changes
 * across the entire app, ensuring points are properly managed when
 * wallet connects/disconnects regardless of which page the user is on.
 */
export function WalletTracker() {
  const { address } = useWallet();
  const { setWalletAddress } = usePointsStore();

  useEffect(() => {
    setWalletAddress(address);
  }, [address, setWalletAddress]);

  // This component doesn't render anything, it just tracks wallet state
  return null;
}
