import { openContractCall } from "@stacks/connect";
import { AnchorMode, uintCV } from "@stacks/transactions";
import { getStacksNetwork } from "./stacks";

type SubmitScoreResult = {
  txId: string;
};

function getGameScoresContract() {
  const contractAddress = process.env.NEXT_PUBLIC_GAME_SCORES_CONTRACT_ADDRESS;
  const contractName =
    process.env.NEXT_PUBLIC_GAME_SCORES_CONTRACT_NAME || "game-scores";

  if (!contractAddress || contractAddress.trim().length === 0) {
    throw new Error(
      "Missing NEXT_PUBLIC_GAME_SCORES_CONTRACT_ADDRESS env var (e.g., ST... address)"
    );
  }

  return { contractAddress, contractName };
}

export async function submitScore(score: number): Promise<SubmitScoreResult> {
  if (!Number.isFinite(score) || score < 0) {
    throw new Error("Score must be a non-negative number");
  }

  const { contractAddress, contractName } = getGameScoresContract();
  const network = getStacksNetwork();

  return new Promise((resolve, reject) => {
    openContractCall({
      contractAddress,
      contractName,
      functionName: "submit-score",
      functionArgs: [uintCV(Math.floor(score))],
      network,
      anchorMode: AnchorMode.Any,
      onFinish: ({ txId }) => resolve({ txId }),
      onCancel: () => reject(new Error("User cancelled score submission")),
    });
  });
}
