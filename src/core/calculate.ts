import type {
  DirectDoughInput,
  DirectDoughOutcome,
  DoughError,
  SourdoughDoughInput,
  SourdoughDoughOutcome,
} from "./types";

/**
 * Default sourdough starter hydration, in percent.
 */
export const DEFAULT_STARTER_HYDRATION = 50;

/**
 * Error messages are developer-facing (English). The UI maps `code` to Italian text.
 */
function invalidInput(message: string): DoughError {
  return { ok: false, code: "invalidInput", message };
}

function impossibleCalculation(message: string): DoughError {
  return { ok: false, code: "impossibleCalculation", message };
}

function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function validateCommonInput(input: {
  numberOfPizzas: number;
  ballWeight: number;
  hydration: number;
  salt: number;
}): DoughError | null {
  if (!isPositive(input.numberOfPizzas)) {
    return invalidInput("Number of pizzas must be greater than zero");
  }
  if (!isPositive(input.ballWeight)) {
    return invalidInput("Ball weight must be greater than zero");
  }
  if (!isNonNegative(input.hydration)) {
    return invalidInput("Hydration cannot be negative");
  }
  if (!isNonNegative(input.salt)) {
    return invalidInput("Salt cannot be negative");
  }
  return null;
}

function validateDirectDoughInput(input: DirectDoughInput): DoughError | null {
  const commonError = validateCommonInput(input);
  if (commonError) {
    return commonError;
  }
  if (!isNonNegative(input.yeast)) {
    return invalidInput("Yeast cannot be negative");
  }
  return null;
}

function validateSourdoughDoughInput(
  input: SourdoughDoughInput,
): DoughError | null {
  const commonError = validateCommonInput(input);
  if (commonError) {
    return commonError;
  }
  if (!isNonNegative(input.starter)) {
    return invalidInput("Starter cannot be negative");
  }
  if (
    input.starterHydration !== undefined &&
    !isNonNegative(input.starterHydration)
  ) {
    return invalidInput("Starter hydration cannot be negative");
  }
  return null;
}

/**
 * Direct dough: yeast is extra mass, so it belongs in the flour denominator.
 *   flour = totalWeight / (1 + hydration + salt + yeast)
 */
export function calculateDirectDough(
  input: DirectDoughInput,
): DirectDoughOutcome {
  const error = validateDirectDoughInput(input);
  if (error) {
    return error;
  }

  const totalWeight = input.numberOfPizzas * input.ballWeight;
  const hydration = input.hydration / 100;
  const salt = input.salt / 100;
  const yeast = input.yeast / 100;

  const flour = totalWeight / (1 + hydration + salt + yeast);

  return {
    ok: true,
    result: {
      flour,
      water: flour * hydration,
      salt: flour * salt,
      yeast: flour * yeast,
      totalWeight,
    },
  };
}

/**
 * Sourdough: the starter is made of flour and water that already live inside the
 * total flour and total water, so it must NOT join the flour denominator.
 *   totalFlour = totalWeight / (1 + hydration + salt)
 * The starter's flour and water are then subtracted to find what to add.
 */
export function calculateSourdoughDough(
  input: SourdoughDoughInput,
): SourdoughDoughOutcome {
  const error = validateSourdoughDoughInput(input);
  if (error) {
    return error;
  }

  const totalWeight = input.numberOfPizzas * input.ballWeight;
  const hydration = input.hydration / 100;
  const salt = input.salt / 100;
  const starterRatio = input.starter / 100;
  const starterHydration =
    (input.starterHydration ?? DEFAULT_STARTER_HYDRATION) / 100;

  const totalFlour = totalWeight / (1 + hydration + salt);
  const totalWater = totalFlour * hydration;

  const starter = totalFlour * starterRatio;
  const starterFlour = starter / (1 + starterHydration);
  const starterWater = starter - starterFlour;

  const addedFlour = totalFlour - starterFlour;
  const addedWater = totalWater - starterWater;

  if (addedFlour < 0 || addedWater < 0) {
    return impossibleCalculation(
      "Target hydration cannot be reached with this starter amount",
    );
  }

  return {
    ok: true,
    result: {
      addedFlour,
      addedWater,
      salt: totalFlour * salt,
      starter,
      starterFlour,
      starterWater,
      totalFlour,
      totalWater,
      totalWeight,
    },
  };
}
