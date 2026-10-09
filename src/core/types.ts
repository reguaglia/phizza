/**
 * Input parameters for direct dough calculation.
 * Percentages are expressed as whole numbers (e.g. 60 means 60%).
 */
export interface DirectDoughInput {
  numberOfPizzas: number;
  ballWeight: number;
  hydration: number;
  salt: number;
  yeast: number;
}

/**
 * Input parameters for sourdough dough calculation.
 * Percentages are expressed as whole numbers (e.g. 60 means 60%).
 * `starterHydration` defaults to 50% when omitted.
 */
export interface SourdoughDoughInput {
  numberOfPizzas: number;
  ballWeight: number;
  hydration: number;
  salt: number;
  starter: number;
  starterHydration?: number;
}

/**
 * Ingredients to add for direct dough. All weights are in grams.
 */
export interface DirectDoughResult {
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  totalWeight: number;
}

/**
 * Ingredients to add for sourdough dough. All weights are in grams.
 * `starterFlour` and `starterWater` describe the split inside the starter.
 */
export interface SourdoughDoughResult {
  addedFlour: number;
  addedWater: number;
  salt: number;
  starter: number;
  starterFlour: number;
  starterWater: number;
  totalFlour: number;
  totalWater: number;
  totalWeight: number;
}

export type DoughErrorCode = "invalidInput" | "impossibleCalculation";

export interface DoughError {
  ok: false;
  code: DoughErrorCode;
  message: string;
}

export interface DoughSuccess<T> {
  ok: true;
  result: T;
}

export type DoughOutcome<T> = DoughSuccess<T> | DoughError;

export type DirectDoughOutcome = DoughOutcome<DirectDoughResult>;
export type SourdoughDoughOutcome = DoughOutcome<SourdoughDoughResult>;
