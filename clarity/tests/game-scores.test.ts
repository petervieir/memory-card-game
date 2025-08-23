import { describe, it, expect } from "vitest";
import { testUtils, assertions } from "./helpers/test-utils";
import { Cl } from "@stacks/transactions";

const CONTRACT = "game-scores";

describe("game-scores", () => {
  it("returns none for users without a score", () => {
    const { wallet1 } = testUtils.getTestAccounts();
    const res = testUtils.callReadOnly(CONTRACT, "get-best-score", [Cl.principal(wallet1)], wallet1);
    assertions.expectNone(res);
  });

  it("can submit a score and retrieve it", () => {
    const { wallet1 } = testUtils.getTestAccounts();
    const tx = testUtils.callPublic(CONTRACT, "submit-score", [Cl.uint(100)], wallet1);
    assertions.expectOk(tx, Cl.uint(100));

    const ro = testUtils.callReadOnly(CONTRACT, "get-best-score", [Cl.principal(wallet1)], wallet1);
    assertions.expectSome(ro, Cl.uint(100));
  });

  it("only updates if new score is higher", () => {
    const { wallet2 } = testUtils.getTestAccounts();

    // First submit
    const tx1 = testUtils.callPublic(CONTRACT, "submit-score", [Cl.uint(200)], wallet2);
    assertions.expectOk(tx1, Cl.uint(200));

    // Submit lower score
    const tx2 = testUtils.callPublic(CONTRACT, "submit-score", [Cl.uint(150)], wallet2);
    assertions.expectOk(tx2, Cl.uint(200));

    // Should still be 200
    const ro = testUtils.callReadOnly(CONTRACT, "get-best-score", [Cl.principal(wallet2)], wallet2);
    assertions.expectSome(ro, Cl.uint(200));
  });
});
