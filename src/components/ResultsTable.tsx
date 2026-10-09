import type { DirectDoughResult, SourdoughDoughResult } from "../core/types";
import { strings } from "../strings";
import { formatGrams } from "./format";
import styles from "./ResultsTable.module.css";

type ResultsTableProps =
  | { mode: "direct"; result: DirectDoughResult }
  | { mode: "sourdough"; result: SourdoughDoughResult };

function Row({ label, value }: { label: string; value: number }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{`${formatGrams(value)} ${strings.gramsUnit}`}</td>
    </tr>
  );
}

export function ResultsTable(props: ResultsTableProps) {
  return (
    <section className={styles.results}>
      <h2 className={styles.heading}>{strings.resultsTitle}</h2>

      {props.mode === "direct" ? (
        <table className={styles.table}>
          <tbody>
            <Row label={strings.flour} value={props.result.flour} />
            <Row label={strings.water} value={props.result.water} />
            <Row label={strings.saltResult} value={props.result.salt} />
            <Row label={strings.yeastResult} value={props.result.yeast} />
            <Row label={strings.totalWeight} value={props.result.totalWeight} />
          </tbody>
        </table>
      ) : (
        <>
          <table className={styles.table}>
            <tbody>
              <Row label={strings.addedFlour} value={props.result.addedFlour} />
              <Row label={strings.addedWater} value={props.result.addedWater} />
              <Row label={strings.saltResult} value={props.result.salt} />
              <Row label={strings.starterResult} value={props.result.starter} />
              <Row
                label={strings.totalWeight}
                value={props.result.totalWeight}
              />
            </tbody>
          </table>

          <h3 className={styles.subheading}>{strings.starterBreakdownTitle}</h3>
          <table className={styles.table}>
            <tbody>
              <Row
                label={strings.starterFlour}
                value={props.result.starterFlour}
              />
              <Row
                label={strings.starterWater}
                value={props.result.starterWater}
              />
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
