import type { DirectDoughInput, SourdoughDoughInput, DoughCalculationResult } from "./types";

/**
 * Validates direct dough input parameters
 */
function validateDirectDoughInput(input: DirectDoughInput): void {
  if (input.numberOfPizzas <= 0) {
    throw new Error("Number of pizzas must be greater than zero");
  }
  if (input.ballWeight <= 0) {
    throw new Error("Ball weight must be greater than zero");
  }
  if (input.hydration < 0) {
    throw new Error("Hydration cannot be negative");
  }
  if (input.salt < 0) {
    throw new Error("Salt percentage cannot be negative");
  }
  if (input.yeast < 0) {
    throw new Error("Yeast percentage cannot be negative");
  }
}

/**
 * Validates sourdough dough input parameters
 */
function validateSourdoughDoughInput(input: SourdoughDoughInput): void {
  if (input.numberOfPizzas <= 0) {
    throw new Error("Number of pizzas must be greater than zero");
  }
  if (input.ballWeight <= 0) {
    throw new Error("Ball weight must be greater than zero");
  }
  if (input.hydration < 0) {
    throw new Error("Hydration cannot be negative");
  }
  if (input.salt < 0) {
    throw new Error("Salt percentage cannot be negative");
  }
  if (input.starter < 0) {
    throw new Error("Starter percentage cannot be negative");
  }
  if (input.starterHydration !== undefined && input.starterHydration < 0) {
    throw new Error("Starter hydration cannot be negative");
  }
}

/**
 * Calculates ingredients for direct dough
 */
export function calculateDirectDough(input: DirectDoughInput): DoughCalculationResult {
  try {
    validateDirectDoughInput(input);
    
    // Calculate total weight
    const totalWeight = input.numberOfPizzas * input.ballWeight;
    
    // Calculate flour amount using the formula
    // flour = total weight / (1 + hydration + salt% + yeast%)
    const totalPercentage = 1 + input.hydration / 100 + input.salt / 100 + input.yeast / 100;
    const flour = totalWeight / totalPercentage;
    
    // Calculate other ingredients
    const water = flour * (input.hydration / 100);
    const salt = flour * (input.salt / 100);
    const yeast = flour * (input.yeast / 100);
    
    return {
      flour,
      water,
      salt,
      yeast,
      totalWeight
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        type: "invalidInput",
        message: error.message
      };
    }
    return {
      type: "invalidInput",
      message: "Unknown error occurred"
    };
  }
}

/**
 * Calculates ingredients for sourdough dough
 */
export function calculateSourdoughDough(input: SourdoughDoughInput): DoughCalculationResult {
  try {
    validateSourdoughDoughInput(input);
    
    // Set default starter hydration if not provided
    const starterHydration = input.starterHydration ?? 50;
    
    // Calculate total weight
    const totalWeight = input.numberOfPizzas * input.ballWeight;
    
    // Calculate flour amount using the formula for sourdough
    // In sourdough, the starter percentage is relative to TOTAL flour (including starter's own flour)
    // The starter itself contains flour and water in a certain ratio
    // Starter flour = starter / (1 + starter hydration)
    // Starter water = starter * starter hydration / (1 + starter hydration)  
    // For this calculation:
    // Total flour = starter flour + added flour = starter / (1 + starter hydration) + added flour  
    // We know: total flour = totalWeight / (1 + hydration + salt% + starter%)
    // And also: total flour = starter flour + added flour
    const totalPercentage = 1 + input.hydration / 100 + input.salt / 100 + input.starter / 100;
    const totalFlour = totalWeight / totalPercentage;
    
    // Calculate starter flour and water
    const starterFlour = input.starter / (1 + starterHydration / 100);
    const starterWater = input.starter * starterHydration / 100 / (1 + starterHydration / 100);
    
    // Calculate added ingredients
    const addedFlour = totalFlour - starterFlour;
    const addedWater = totalWeight * (input.hydration / 100) - starterWater;
    
    // Validate that we don't have negative amounts (impossible calculations)
    if (addedFlour < 0 || addedWater < 0) {
      return {
        type: "impossibleCalculation",
        message: "Cannot achieve target hydration with given starter percentage"
      };
    }
    
    const salt = totalFlour * (input.salt / 100);
    
    // Recalculate water as the sum of starter water and added water
    const water = starterWater + addedWater;
    
    return {
      flour: totalFlour,
      water,
      salt,
      starter: input.starter,
      totalWeight
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        type: "invalidInput",
        message: error.message
      };
    }
    return {
      type: "invalidInput",
      message: "Unknown error occurred"
    };
  }
}
