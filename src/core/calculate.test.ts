import { describe, expect, it } from "vitest";
import {
  DEFAULT_STARTER_HYDRATION,
  calculateDirectDough,
  calculateSourdoughDough,
} from "./calculate";
import type { DirectDoughInput, SourdoughDoughInput } from "./types";

describe("calculateDirectDough", () => {
  it("computes ingredients for 2 pizzas of 300g at 60% hydration, 2% salt, 1% yeast", () => {
    const input: DirectDoughInput = {
      numberOfPizzas: 2,
      ballWeight: 300,
      hydration: 60,
      salt: 2,
      yeast: 1,
    };

    const outcome = calculateDirectDough(input);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }

    // total weight = 2 * 300 = 600
    // denominator = 1 + 0.60 + 0.02 + 0.01 = 1.63
    const flour = 600 / 1.63;
    expect(outcome.result.flour).toBeCloseTo(flour, 10);
    expect(outcome.result.water).toBeCloseTo(flour * 0.6, 10);
    expect(outcome.result.salt).toBeCloseTo(flour * 0.02, 10);
    expect(outcome.result.yeast).toBeCloseTo(flour * 0.01, 10);
    expect(outcome.result.totalWeight).toBe(600);
  });

  it("returns ingredients that add up to the total weight", () => {
    const outcome = calculateDirectDough({
      numberOfPizzas: 2,
      ballWeight: 300,
      hydration: 60,
      salt: 2,
      yeast: 1,
    });

    if (!outcome.ok) {
      throw new Error("expected a successful calculation");
    }

    const { flour, water, salt, yeast } = outcome.result;
    expect(flour + water + salt + yeast).toBeCloseTo(600, 6);
  });

  it.each([
    [
      "zero pizzas",
      { numberOfPizzas: 0, ballWeight: 300, hydration: 60, salt: 2, yeast: 1 },
    ],
    [
      "zero ball weight",
      { numberOfPizzas: 2, ballWeight: 0, hydration: 60, salt: 2, yeast: 1 },
    ],
    [
      "negative hydration",
      { numberOfPizzas: 2, ballWeight: 300, hydration: -1, salt: 2, yeast: 1 },
    ],
    [
      "negative salt",
      { numberOfPizzas: 2, ballWeight: 300, hydration: 60, salt: -1, yeast: 1 },
    ],
    [
      "negative yeast",
      { numberOfPizzas: 2, ballWeight: 300, hydration: 60, salt: 2, yeast: -1 },
    ],
  ])("rejects %s", (_label, input: DirectDoughInput) => {
    const outcome = calculateDirectDough(input);
    expect(outcome.ok).toBe(false);
    if (outcome.ok) {
      return;
    }
    expect(outcome.code).toBe("invalidInput");
  });
});

describe("calculateSourdoughDough", () => {
  it("defaults the starter hydration to 50%", () => {
    expect(DEFAULT_STARTER_HYDRATION).toBe(50);

    const outcome = calculateSourdoughDough({
      numberOfPizzas: 1,
      ballWeight: 250,
      hydration: 60,
      salt: 2,
      starter: 20,
    });

    if (!outcome.ok) {
      throw new Error("expected a successful calculation");
    }

    // total flour = 250 / (1 + 0.60 + 0.02) = 250 / 1.62
    const totalFlour = 250 / 1.62;
    const starter = totalFlour * 0.2;
    const starterFlour = starter / 1.5;
    const starterWater = starter - starterFlour;

    expect(outcome.result.totalFlour).toBeCloseTo(totalFlour, 10);
    expect(outcome.result.totalWater).toBeCloseTo(totalFlour * 0.6, 10);
    expect(outcome.result.starter).toBeCloseTo(starter, 10);
    expect(outcome.result.starterFlour).toBeCloseTo(starterFlour, 10);
    expect(outcome.result.starterWater).toBeCloseTo(starterWater, 10);
  });

  it("does not count the starter's flour and water twice", () => {
    const outcome = calculateSourdoughDough({
      numberOfPizzas: 1,
      ballWeight: 250,
      hydration: 60,
      salt: 2,
      starter: 20,
    });

    if (!outcome.ok) {
      throw new Error("expected a successful calculation");
    }

    const { addedFlour, addedWater, salt, starter, totalWeight } =
      outcome.result;

    // total flour = 250 / 1.62; added flour = total flour - starter flour
    const totalFlour = 250 / 1.62;
    const starterWeight = totalFlour * 0.2;
    const starterFlour = starterWeight / 1.5;
    // added water = total water - starter water
    const starterWater = starterWeight - starterFlour;

    expect(addedFlour).toBeCloseTo(totalFlour - starterFlour, 10);
    expect(addedWater).toBeCloseTo(totalFlour * 0.6 - starterWater, 10);
    expect(salt).toBeCloseTo(totalFlour * 0.02, 10);
    expect(totalWeight).toBe(250);
    expect(addedFlour + addedWater + salt + starter).toBeCloseTo(250, 6);
  });

  it("supports a custom starter hydration", () => {
    const outcome = calculateSourdoughDough({
      numberOfPizzas: 2,
      ballWeight: 300,
      hydration: 60,
      salt: 2,
      starter: 20,
      starterHydration: 70,
    });

    if (!outcome.ok) {
      throw new Error("expected a successful calculation");
    }

    // total flour = 600 / 1.62; starter flour = starter / 1.7
    const totalFlour = 600 / 1.62;
    const starter = totalFlour * 0.2;
    const starterFlour = starter / 1.7;
    const starterWater = starter - starterFlour;

    expect(outcome.result.totalFlour).toBeCloseTo(totalFlour, 10);
    expect(outcome.result.starter).toBeCloseTo(starter, 10);
    expect(outcome.result.starterFlour).toBeCloseTo(starterFlour, 10);
    expect(outcome.result.starterWater).toBeCloseTo(starterWater, 10);
    expect(outcome.result.addedFlour).toBeCloseTo(
      totalFlour - starterFlour,
      10,
    );
    expect(outcome.result.addedWater).toBeCloseTo(
      totalFlour * 0.6 - starterWater,
      10,
    );
    expect(outcome.result.salt).toBeCloseTo(totalFlour * 0.02, 10);
  });

  it("reports an impossible calculation when added water would be negative", () => {
    const outcome = calculateSourdoughDough({
      numberOfPizzas: 1,
      ballWeight: 250,
      hydration: 30,
      salt: 2,
      starter: 100,
    });

    expect(outcome.ok).toBe(false);
    if (outcome.ok) {
      return;
    }
    expect(outcome.code).toBe("impossibleCalculation");
  });

  it("reports an impossible calculation when added flour would be negative", () => {
    const outcome = calculateSourdoughDough({
      numberOfPizzas: 1,
      ballWeight: 250,
      hydration: 60,
      salt: 2,
      starter: 300,
    });

    expect(outcome.ok).toBe(false);
    if (outcome.ok) {
      return;
    }
    expect(outcome.code).toBe("impossibleCalculation");
  });

  it.each([
    [
      "zero pizzas",
      {
        numberOfPizzas: 0,
        ballWeight: 250,
        hydration: 60,
        salt: 2,
        starter: 20,
      },
    ],
    [
      "zero ball weight",
      { numberOfPizzas: 1, ballWeight: 0, hydration: 60, salt: 2, starter: 20 },
    ],
    [
      "negative starter",
      {
        numberOfPizzas: 1,
        ballWeight: 250,
        hydration: 60,
        salt: 2,
        starter: -1,
      },
    ],
    [
      "negative starter hydration",
      {
        numberOfPizzas: 1,
        ballWeight: 250,
        hydration: 60,
        salt: 2,
        starter: 20,
        starterHydration: -1,
      },
    ],
  ])("rejects %s", (_label, input: SourdoughDoughInput) => {
    const outcome = calculateSourdoughDough(input);
    expect(outcome.ok).toBe(false);
    if (outcome.ok) {
      return;
    }
    expect(outcome.code).toBe("invalidInput");
  });
});
