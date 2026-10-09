import { useState } from "react";
import {
  DoughForm,
  type DoughFormValues,
  type DoughMode,
} from "./components/DoughForm";
import { ErrorMessage } from "./components/ErrorMessage";
import { ResultsTable } from "./components/ResultsTable";
import { parseDecimal } from "./components/parseNumber";
import {
  calculateDirectDough,
  calculateSourdoughDough,
} from "./core/calculate";
import type {
  DirectDoughResult,
  DoughErrorCode,
  SourdoughDoughResult,
} from "./core/types";
import { strings } from "./strings";
import styles from "./App.module.css";

type CalcState =
  | { status: "idle" }
  | { status: "validation"; message: string }
  | { status: "error"; code: DoughErrorCode }
  | { status: "success"; mode: "direct"; result: DirectDoughResult }
  | { status: "success"; mode: "sourdough"; result: SourdoughDoughResult };

const initialValues: DoughFormValues = {
  numberOfPizzas: "4",
  ballWeight: "250",
  hydration: "60",
  salt: "2",
  yeast: "0,5",
  starter: "20",
  starterHydration: "",
};

const validationMessage = strings.errorMissingValues;

export function App() {
  const [mode, setMode] = useState<DoughMode>("direct");
  const [values, setValues] = useState<DoughFormValues>(initialValues);
  const [calc, setCalc] = useState<CalcState>({ status: "idle" });

  function handleModeChange(nextMode: DoughMode) {
    setMode(nextMode);
    setCalc({ status: "idle" });
  }

  function handleChange(field: keyof DoughFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit() {
    const numberOfPizzas = parseDecimal(values.numberOfPizzas);
    const ballWeight = parseDecimal(values.ballWeight);
    const hydration = parseDecimal(values.hydration);
    const salt = parseDecimal(values.salt);

    if (
      numberOfPizzas === null ||
      ballWeight === null ||
      hydration === null ||
      salt === null
    ) {
      setCalc({ status: "validation", message: validationMessage });
      return;
    }

    if (mode === "direct") {
      const yeast = parseDecimal(values.yeast);
      if (yeast === null) {
        setCalc({ status: "validation", message: validationMessage });
        return;
      }

      const outcome = calculateDirectDough({
        numberOfPizzas,
        ballWeight,
        hydration,
        salt,
        yeast,
      });
      setCalc(
        outcome.ok
          ? { status: "success", mode: "direct", result: outcome.result }
          : { status: "error", code: outcome.code },
      );
      return;
    }

    const starter = parseDecimal(values.starter);
    if (starter === null) {
      setCalc({ status: "validation", message: validationMessage });
      return;
    }

    const rawStarterHydration = values.starterHydration.trim();
    const starterHydration =
      rawStarterHydration === ""
        ? undefined
        : parseDecimal(rawStarterHydration);
    if (starterHydration === null) {
      setCalc({ status: "validation", message: validationMessage });
      return;
    }

    const outcome = calculateSourdoughDough({
      numberOfPizzas,
      ballWeight,
      hydration,
      salt,
      starter,
      starterHydration,
    });
    setCalc(
      outcome.ok
        ? { status: "success", mode: "sourdough", result: outcome.result }
        : { status: "error", code: outcome.code },
    );
  }

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{strings.appName}</h1>
        <p className={styles.tagline}>{strings.tagline}</p>
      </header>

      <div className={styles.panel}>
        <DoughForm
          mode={mode}
          values={values}
          onModeChange={handleModeChange}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {calc.status === "validation" && (
          <ErrorMessage message={calc.message} />
        )}
        {calc.status === "error" && <ErrorMessage code={calc.code} />}
        {calc.status === "success" && calc.mode === "direct" && (
          <ResultsTable mode="direct" result={calc.result} />
        )}
        {calc.status === "success" && calc.mode === "sourdough" && (
          <ResultsTable mode="sourdough" result={calc.result} />
        )}
      </div>
    </main>
  );
}
