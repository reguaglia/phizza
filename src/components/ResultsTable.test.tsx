import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DirectDoughResult, SourdoughDoughResult } from "../core/types";
import { ResultsTable } from "./ResultsTable";

describe("ResultsTable", () => {
  it("renders direct dough ingredients with formatted grams", () => {
    const result: DirectDoughResult = {
      flour: 368.1,
      water: 220.9,
      salt: 7.4,
      yeast: 3.7,
      totalWeight: 600,
    };

    render(<ResultsTable mode="direct" result={result} />);

    expect(screen.getByText("Farina")).toBeInTheDocument();
    expect(screen.getByText("368,1 g")).toBeInTheDocument();
    expect(screen.getByText("600 g")).toBeInTheDocument();
    expect(screen.queryByText("Dettaglio pasta madre")).not.toBeInTheDocument();
  });

  it("renders sourdough ingredients and the starter breakdown", () => {
    const result: SourdoughDoughResult = {
      addedFlour: 133.7,
      addedWater: 82.3,
      salt: 3.1,
      starter: 30.9,
      starterFlour: 20.6,
      starterWater: 10.3,
      totalFlour: 154.3,
      totalWater: 92.6,
      totalWeight: 250,
    };

    render(<ResultsTable mode="sourdough" result={result} />);

    expect(screen.getByText("Farina da aggiungere")).toBeInTheDocument();
    expect(screen.getByText("133,7 g")).toBeInTheDocument();
    expect(screen.getByText("Dettaglio pasta madre")).toBeInTheDocument();
    expect(screen.getByText("Farina nella pasta madre")).toBeInTheDocument();
    expect(screen.getByText("20,6 g")).toBeInTheDocument();
    expect(screen.queryByText("Lievito")).not.toBeInTheDocument();
  });
});
