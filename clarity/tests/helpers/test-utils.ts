import { Cl } from "@stacks/transactions";
import { expect } from "vitest";

// Global simnet is provided by vitest-environment-clarinet
declare const simnet: any;

// Extend vitest matchers with Clarinet-specific matchers
declare module "vitest" {
  interface Assertion<T = any> {
    toBeOk(expected?: any): T;
    toBeErr(expected?: any): T;
    toBeSome(expected?: any): T;
    toBeNone(): T;
    toBeUint(expected: number): T;
    toBeAscii(expected: string): T;
  }
}

/**
 * Test utility functions for Clarity contracts
 */

export const testUtils = {
  /**
   * Helper to get accounts for testing
   */
  getTestAccounts() {
    const accounts = simnet.getAccounts();
    return {
      deployer: accounts.get("deployer")!,
      wallet1: accounts.get("wallet_1")!,
      wallet2: accounts.get("wallet_2")!,
      wallet3: accounts.get("wallet_3")!,
    };
  },

  /**
   * Helper to call a read-only function and return the result
   */
  callReadOnly(
    contract: string,
    functionName: string,
    args: any[] = [],
    sender?: string
  ) {
    const accounts = this.getTestAccounts();
    const caller = sender || accounts.deployer;
    return simnet.callReadOnlyFn(contract, functionName, args, caller);
  },

  /**
   * Helper to call a public function and return the result
   */
  callPublic(
    contract: string,
    functionName: string,
    args: any[] = [],
    sender?: string
  ) {
    const accounts = this.getTestAccounts();
    const caller = sender || accounts.deployer;
    return simnet.callPublicFn(contract, functionName, args, caller);
  },

  /**
   * Helper to advance blocks
   */
  mineBlocks(count: number) {
    simnet.mineEmptyBlocks(count);
  },

  /**
   * Helper to get current block height
   */
  getCurrentBlockHeight() {
    return simnet.blockHeight;
  },

  /**
   * Common Clarity value constructors
   */
  clarity: {
    uint: (value: number) => Cl.uint(value),
    int: (value: number) => Cl.int(value),
    bool: (value: boolean) => Cl.bool(value),
    ascii: (value: string) => Cl.stringAscii(value),
    utf8: (value: string) => Cl.stringUtf8(value),
    principal: (value: string) => Cl.principal(value),
    tuple: (data: Record<string, any>) => Cl.tuple(data),
    list: (items: any[]) => Cl.list(items),
    none: () => Cl.none(),
    some: (value: any) => Cl.some(value),
    ok: (value: any) => Cl.ok(value),
    err: (value: any) => Cl.error(value),
  },
};

/**
 * Common test assertions
 */
export const assertions = {
  /**
   * Assert that a transaction was successful
   */
  expectOk(result: any, expectedValue?: any) {
    if (expectedValue !== undefined) {
      expect(result).toBeOk(expectedValue);
    } else {
      expect(result).toBeOk();
    }
  },

  /**
   * Assert that a transaction failed
   */
  expectErr(result: any, expectedError?: any) {
    if (expectedError !== undefined) {
      expect(result).toBeErr(expectedError);
    } else {
      expect(result).toBeErr();
    }
  },

  /**
   * Assert that a value is some
   */
  expectSome(result: any, expectedValue?: any) {
    if (expectedValue !== undefined) {
      expect(result).toBeSome(expectedValue);
    } else {
      expect(result).toBeSome();
    }
  },

  /**
   * Assert that a value is none
   */
  expectNone(result: any) {
    expect(result).toBeNone();
  },

  /**
   * Assert uint value
   */
  expectUint(result: any, expectedValue: number) {
    expect(result).toBeUint(expectedValue);
  },

  /**
   * Assert ASCII string value
   */
  expectAscii(result: any, expectedValue: string) {
    expect(result).toBeAscii(expectedValue);
  },
};
