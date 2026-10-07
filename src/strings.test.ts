import { describe, expect, it } from "vitest";
import { strings } from "./strings";

describe("strings", () => {
  it("has no empty user-facing values", () => {
    for (const value of Object.values(strings)) {
      expect(value).not.toBe("");
    }
  });
});
