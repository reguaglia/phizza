/**
 * Input parameters for direct dough calculation
 */
export interface DirectDoughInput {
  /** Number of pizzas to make */
  numberOfPizzas: number;
  /** Weight of each dough ball (in grams) */
  ballWeight: number;
  /** Hydration percentage (water/flour ratio as percentage) */
  hydration: number;
  /** Salt percentage (salt/flour ratio as percentage) */
  salt: number;
  /** Yeast percentage (yeast/flour ratio as percentage) */
  yeast: number;
}

/**
 * Input parameters for sourdough dough calculation
 */
export interface SourdoughDoughInput {
  /** Number of pizzas to make */
  numberOfPizzas: number;
  /** Weight of each dough ball (in grams) */
  ballWeight: number;
  /** Hydration percentage (water/flour ratio as percentage) */
  hydration: number;
  /** Salt percentage (salt/flour ratio as percentage) */
  salt: number;
  /** Sourdough starter percentage (starter/flour ratio as percentage) */
  starter: number;
  /** Sourdough starter hydration percentage (default: 50%) */
  starterHydration?: number;
}

/**
 * Output/result from dough calculations
 */
export interface DoughResult {
  /** Total flour needed (in grams) */
  flour: number;
  /** Total water needed (in grams) */
  water: number;
  /** Total salt needed (in grams) */
  salt: number;
  /** Total yeast needed (in grams) - for direct dough */
  yeast?: number;
  /** Total starter needed (in grams) - for sourdough */
  starter?: number;
  /** Total weight of the dough (in grams) */
  totalWeight: number;
}

/**
 * Error types for dough calculations
 */
export type DoughError =
  | {
      type: "invalidInput";
      message: string;
    }
  | {
      type: "impossibleCalculation";
      message: string;
    }
  | {
      type: "negativeValue";
      message: string;
    };

/**
 * Result union type that can either be a valid dough calculation or an error
 */
export type DoughCalculationResult = DoughResult | DoughError;
