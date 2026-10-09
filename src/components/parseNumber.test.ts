import { describe, expect, it } from "vitest";
import { parseDecimal } from "./parseNumber";

describe("parseDecimal", () => {
  it("parses whole numbers", () => {
    expect(parseDecimal("60")).toBe(60);
    expect(parseDecimal("0")).toBe(0);
  });

  it("parses decimals written with a comma", () => {
    expect(parseDecimal("60,5")).toBe(60.5);
    expect(parseDecimal("0,25")).toBe(0.25);
  });

  it("trims surrounding whitespace", () => {
    expect(parseDecimal("  60,5  ")).toBe(60.5);
  });

  it("returns null for empty input", () => {
    expect(parseDecimal("")).toBeNull();
    expect(parseDecimal("   ")).toBeNull();
  });

  it("rejects a dot as decimal separator", () => {
    expect(parseDecimal("60.5")).toBeNull();
  });

  it("rejects incomplete or malformed decimals", () => {
    expect(parseDecimal("60,")).toBeNull();
    expect(parseDecimal(",5")).toBeNull();
    expect(parseDecimal("1,2,3")).toBeNull();
  });

  it("rejects negatives and non-numeric input", () => {
    expect(parseDecimal("-1")).toBeNull();
    expect(parseDecimal("abc")).toBeNull();
  });
});
