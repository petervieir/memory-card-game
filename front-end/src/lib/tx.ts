import { openContractCall } from "@stacks/connect";
import { AnchorMode, UIntCV, uintCV } from "@stacks/transactions";
import { getStacksNetwork } from "./stacks";

/**
 * Parse contract id env into address and name.
 * Supports formats:
 * - ST...::game-scores
 * - ST... .game-scores
 */
function parseContractEnv(contractId?: string): { address: string; name: string } | null {
  if (!contractId) return null;
  if (contractId.includes("::")) {
    const [address, name] = contractId.split("::");
    return address && name ? { address, name } : null;
  }
  if (contractId.includes(".")) {
    const [address, name] = contractId.split(".");
    return address && name ? { address, name } : null;
  }
  return null;
}

export type SubmitScoreParams = {
  score: number;
  onFinish?: () => void;
  onCancel?: () => void;
};

/**
 * Opens the wallet to submit the score to the on-chain contract.
 * Requires NEXT_PUBLIC_GAME_SCORES_CONTRACT to be set, e.g.:
 * ST3...::game-scores
 */
export async function submitScoreTx({ score, onFinish, onCancel }: SubmitScoreParams) {
  const featureEnabled = (process.env.NEXT_PUBLIC_ENABLE_SUBMIT_SCORE || "").toLowerCase();
  if (!(featureEnabled === "1" || featureEnabled === "true")) {
    throw new Error("Submit score feature is disabled");
  }

  const parsed = parseContractEnv(process.env.NEXT_PUBLIC_GAME_SCORES_CONTRACT);
  if (!parsed) {
    throw new Error(
      "NEXT_PUBLIC_GAME_SCORES_CONTRACT is not set or invalid. Expected 'ST...::game-scores'"
    );
  }

  const network = getStacksNetwork();
  const args: [UIntCV] = [uintCV(score)];

  await openContractCall({
    network,
    contractAddress: parsed.address,
    contractName: parsed.name,
    functionName: "submit-score",
    functionArgs: args,
    anchorMode: AnchorMode.Any,
    onFinish,
    onCancel,
  });
}
