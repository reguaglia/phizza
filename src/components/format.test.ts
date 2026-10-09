import { describe, expect, it } from "vitest";
import { formatGrams } from "./format";

describe("formatGrams", () => {
  it("keeps whole grams without decimals", () => {
    expect(formatGrams(600)).toBe("600");
    expect(formatGrams(0)).toBe("0");
  });

  it("rounds to at most one decimal using the Italian separator", () => {
    expect(formatGrams(368.09815950920245)).toBe("368,1");
    expect(formatGrams(3.68)).toBe("3,7");
    expect(formatGrams(12.34)).toBe("12,3");
  });

  it("groups large amounts following Italian rules", () => {
    expect(formatGrams(1000)).toBe("1000");
    expect(formatGrams(1234567.89)).toBe("1.234.567,9");
  });
});
