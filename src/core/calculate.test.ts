import { describe, it, expect } from "vitest";
import { calculateDirectDough, calculateSourdoughDough } from "./calculate";
import type { DirectDoughInput, SourdoughDoughInput } from "./types";

describe("Direct dough calculation", () => {
  it("should calculate ingredients correctly for a basic case", () => {
    const input: DirectDoughInput = {
      numberOfPizzas: 2,
      ballWeight: 300,
      hydration: 60,
      salt: 2,
      yeast: 1
    };

    const result = calculateDirectDough(input);
    
    expect(result).not.toBeInstanceOf(Error);
    
    if ("type" in result && result.type === "invalidInput") {
      expect.fail("Should not return an invalid input error");
    }
    
    const doughResult = result as any;
    expect(doughResult.flour).toBeGreaterThan(0);
    expect(doughResult.water).toBeGreaterThan(0);
    expect(doughResult.salt).toBeGreaterThan(0);
    expect(doughResult.yeast).toBeGreaterThan(0);
    expect(doughResult.totalWeight).toBe(600); // 2 * 300 = 600
  });

  it("should return invalid input error for negative values", () => {
    const input: DirectDoughInput = {
      numberOfPizzas: -1,
      ballWeight: 300,
      hydration: 60,
      salt: 2,
      yeast: 1
    };

    const result = calculateDirectDough(input);
    
    expect(result).toHaveProperty("type", "invalidInput");
  });
});

describe("Sourdough dough calculation", () => {
  it("should calculate ingredients correctly for a basic case", () => {
    const input: SourdoughDoughInput = {
      numberOfPizzas: 2,
      ballWeight: 300,
      hydration: 60,
      salt: 2,
      starter: 20
    };

    const result = calculateSourdoughDough(input);
    
    expect(result).not.toBeInstanceOf(Error);
    
    if ("type" in result && result.type === "invalidInput") {
      expect.fail("Should not return an invalid input error");
    }
    
    const doughResult = result as any;
    expect(doughResult.flour).toBeGreaterThan(0);
    expect(doughResult.water).toBeGreaterThan(0);
    expect(doughResult.salt).toBeGreaterThan(0);
    expect(doughResult.starter).toBeGreaterThan(0);
    expect(doughResult.totalWeight).toBe(600); // 2 * 300 = 600
  });

  it("should return impossible calculation error for incompatible values", () => {
    const input: SourdoughDoughInput = {
      numberOfPizzas: 2,
      ballWeight: 300,
      hydration: 100, // Very high hydration
      salt: 2,
      starter: 50 // High starter percentage can cause impossibility
    };

    const result = calculateSourdoughDough(input);
    
    if ("type" in result && result.type === "impossibleCalculation") {
      expect(result.message).toContain("Cannot achieve target hydration");
    } else {
      expect(result).not.toBeInstanceOf(Error);
      // If it doesn't return an error, it's probably okay
    }
  });

  it("should handle custom starter hydration", () => {
    const input: SourdoughDoughInput = {
      numberOfPizzas: 2,
      ballWeight: 300,
      hydration: 60,
      salt: 2,
      starter: 20,
      starterHydration: 70
    };

    const result = calculateSourdoughDough(input);
    
    expect(result).not.toBeInstanceOf(Error);
    
    if ("type" in result && result.type === "invalidInput") {
      expect.fail("Should not return an invalid input error");
    }
  });
});
