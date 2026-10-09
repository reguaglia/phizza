import { strings } from "../strings";
import styles from "./DoughForm.module.css";

export type DoughMode = "direct" | "sourdough";

export interface DoughFormValues {
  numberOfPizzas: string;
  ballWeight: string;
  hydration: string;
  salt: string;
  yeast: string;
  starter: string;
  starterHydration: string;
}

interface DoughFormProps {
  mode: DoughMode;
  values: DoughFormValues;
  onModeChange: (mode: DoughMode) => void;
  onChange: (field: keyof DoughFormValues, value: string) => void;
  onSubmit: () => void;
}

export function DoughForm({
  mode,
  values,
  onModeChange,
  onChange,
  onSubmit,
}: DoughFormProps) {
  function renderField(name: keyof DoughFormValues, label: string) {
    return (
      <div className={styles.field}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type="text"
          inputMode="decimal"
          value={values[name]}
          onChange={(event) => onChange(name, event.target.value)}
        />
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h2 className={styles.heading}>{strings.formTitle}</h2>

      <fieldset className={styles.mode}>
        <legend>{strings.modeLabel}</legend>
        <div className={styles.modeOptions}>
          <label className={styles.radio}>
            <input
              type="radio"
              name="mode"
              value="direct"
              checked={mode === "direct"}
              onChange={() => onModeChange("direct")}
            />
            {strings.modeDirect}
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="mode"
              value="sourdough"
              checked={mode === "sourdough"}
              onChange={() => onModeChange("sourdough")}
            />
            {strings.modeSourdough}
          </label>
        </div>
      </fieldset>

      {renderField("numberOfPizzas", strings.numberOfPizzas)}
      {renderField("ballWeight", strings.ballWeight)}
      {renderField("hydration", strings.hydration)}
      {renderField("salt", strings.salt)}
      {mode === "direct" ? (
        renderField("yeast", strings.yeast)
      ) : (
        <>
          {renderField("starter", strings.starter)}
          {renderField("starterHydration", strings.starterHydration)}
        </>
      )}

      <button className={styles.submit} type="submit">
        {strings.submit}
      </button>
    </form>
  );
}
