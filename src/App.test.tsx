import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: "Calcola" }));
}

describe("App", () => {
  it("calculates direct dough from the default values", () => {
    render(<App />);

    submit();

    expect(screen.getByText("Farina")).toBeInTheDocument();
    expect(screen.getByText("615,4 g")).toBeInTheDocument();
    expect(screen.getByText("1000 g")).toBeInTheDocument();
  });

  it("calculates sourdough dough after switching mode", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("Pasta madre"));
    submit();

    expect(screen.getByText("Farina da aggiungere")).toBeInTheDocument();
    expect(screen.getByText("Dettaglio pasta madre")).toBeInTheDocument();
  });

  it("shows a validation message when a required field is empty", () => {
    render(<App />);

    fill("Numero di pizze", "");
    submit();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Inserisci tutti i valori richiesti usando la virgola per i decimali.",
    );
  });

  it("shows the invalid-input error when the core rejects the values", () => {
    render(<App />);

    fill("Numero di pizze", "0");
    submit();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Controlla i valori inseriti.",
    );
  });

  it("shows an impossible-calculation error for incompatible sourdough values", () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText("Pasta madre"));
    fill("Pasta madre (%)", "100");
    fill("Idratazione (%)", "30");
    submit();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Impossibile raggiungere questa idratazione",
    );
  });
});
