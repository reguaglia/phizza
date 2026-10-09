import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DoughForm, type DoughFormValues, type DoughMode } from "./DoughForm";

const emptyValues: DoughFormValues = {
  numberOfPizzas: "",
  ballWeight: "",
  hydration: "",
  salt: "",
  yeast: "",
  starter: "",
  starterHydration: "",
};

function renderForm(overrides: { mode?: DoughMode } = {}) {
  const props = {
    mode: overrides.mode ?? ("direct" as DoughMode),
    values: emptyValues,
    onModeChange: vi.fn(),
    onChange: vi.fn(),
    onSubmit: vi.fn(),
  };
  render(<DoughForm {...props} />);
  return props;
}

describe("DoughForm", () => {
  it("shows the yeast field in direct mode", () => {
    renderForm({ mode: "direct" });

    expect(screen.getByLabelText("Lievito (%)")).toBeInTheDocument();
    expect(screen.queryByLabelText("Pasta madre (%)")).not.toBeInTheDocument();
  });

  it("shows the starter fields in sourdough mode", () => {
    renderForm({ mode: "sourdough" });

    expect(screen.getByLabelText("Pasta madre (%)")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Idratazione pasta madre (%)"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Lievito (%)")).not.toBeInTheDocument();
  });

  it("reports changes to the matching field", () => {
    const props = renderForm();

    fireEvent.change(screen.getByLabelText("Numero di pizze"), {
      target: { value: "4" },
    });

    expect(props.onChange).toHaveBeenCalledWith("numberOfPizzas", "4");
  });

  it("reports mode changes", () => {
    const props = renderForm({ mode: "direct" });

    fireEvent.click(screen.getByLabelText("Pasta madre"));

    expect(props.onModeChange).toHaveBeenCalledWith("sourdough");
  });

  it("submits the form", () => {
    const props = renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Calcola" }));

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });
});
