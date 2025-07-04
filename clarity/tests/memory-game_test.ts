import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.7.1/index.ts";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Clarinet.test({
  name: "Memory Game - Basic functionality",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const player = accounts.get("wallet_1")!;

    // Test minting a card
    let block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "mint",
        [types.utf8("https://example.com/metadata.json")],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectUint(1);

    // Test starting a game
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "start-game",
        [types.utf8("https://gaia.example.com/game.json")],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectOk().expectBool(true);

    // Test flipping a card
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "flip-card-game",
        [types.uint(1)],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 4);
    block.receipts[0].result.expectOk().expectList([types.uint(1)]);

    // Test flipping a second card
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "flip-card-game",
        [types.uint(2)],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 5);
    block.receipts[0].result.expectOk().expectList([types.uint(1), types.uint(2)]);

    // Test checking match
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "check-match",
        [],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 6);
    const matchResult = block.receipts[0].result.expectOk();
    assertEquals(matchResult.expectTuple()["card1"], types.uint(1));
    assertEquals(matchResult.expectTuple()["card2"], types.uint(2));

    // Test resetting game
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "reset-game",
        [],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 7);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Memory Game - Error handling",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const player = accounts.get("wallet_1")!;
    const otherPlayer = accounts.get("wallet_2")!;

    // Test flipping card without starting game
    let block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "flip-card-game",
        [types.uint(1)],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectList([types.uint(1)]);

    // Test flipping more than 2 cards
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "flip-card-game",
        [types.uint(2)],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectOk().expectList([types.uint(1), types.uint(2)]);

    // Try to flip a third card
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "flip-card-game",
        [types.uint(3)],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 4);
    block.receipts[0].result.expectErr().expectUint(420); // ERR_ALREADY_FLIPPED

    // Test checking match with only one card
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "check-match",
        [],
        otherPlayer.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 5);
    block.receipts[0].result.expectErr().expectUint(421); // ERR_NEED_TWO_CARDS
  },
});

Clarinet.test({
  name: "Memory Game - Read-only functions",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const player = accounts.get("wallet_1")!;

    // Start a game first
    let block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "start-game",
        [types.utf8("https://gaia.example.com/game.json")],
        player.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);

    // Test get-player-game-uri
    let result = chain.callReadOnlyFn(
      "memory-game",
      "get-player-game-uri",
      [types.principal(player.address)],
      player.address
    );

    result.result.expectSome().expectUtf8("https://gaia.example.com/game.json");

    // Test get-player-flipped
    result = chain.callReadOnlyFn(
      "memory-game",
      "get-player-flipped",
      [types.principal(player.address)],
      player.address
    );

    result.result.expectSome().expectList([]);

    // Flip a card and test again
    block = chain.mineBlock([
      Tx.contractCall(
        "memory-game",
        "flip-card-game",
        [types.uint(1)],
        player.address
      ),
    ]);

    result = chain.callReadOnlyFn(
      "memory-game",
      "get-player-flipped",
      [types.principal(player.address)],
      player.address
    );

    result.result.expectSome().expectList([types.uint(1)]);
  },
}); 