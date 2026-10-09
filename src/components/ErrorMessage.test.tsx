import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("maps the invalidInput code to Italian text", () => {
    render(<ErrorMessage code="invalidInput" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Controlla i valori inseriti.",
    );
  });

  it("maps the impossibleCalculation code to Italian text", () => {
    render(<ErrorMessage code="impossibleCalculation" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Impossibile raggiungere questa idratazione",
    );
  });

  it("renders an explicit message when provided", () => {
    render(<ErrorMessage message="Compila tutti i campi." />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Compila tutti i campi.",
    );
  });
});
