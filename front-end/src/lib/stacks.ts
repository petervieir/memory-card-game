import { StacksMainnet, StacksTestnet, StacksMocknet } from "@stacks/network";

/**
 * Get the appropriate Stacks network based on environment
 */
export function getStacksNetwork() {
  const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || "mocknet";

  switch (networkType) {
    case "mainnet":
      return new StacksMainnet();
    case "testnet":
      return new StacksTestnet();
    case "mocknet":
    case "devnet":
      return new StacksMocknet();
    default:
      return new StacksMocknet();
  }
}

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
  const stacksAddressRegex = /^S[0-9A-Z]{39}$/;
  const testnetAddressRegex = /^ST[0-9A-Z]{38}$/;

  return stacksAddressRegex.test(address) || testnetAddressRegex.test(address);
}

/**
 * Convert STX amount from microSTX to STX
 */
export function microSTXToSTX(microSTX: number): number {
  return microSTX / 1_000_000;
}

/**
 * Convert STX amount to microSTX
 */
export function STXToMicroSTX(stx: number): number {
  return Math.floor(stx * 1_000_000);
}
