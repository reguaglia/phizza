import { strings } from "./strings";
import styles from "./App.module.css";

export function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>{strings.appName}</h1>
      <p className={styles.tagline}>{strings.tagline}</p>
    </main>
  );
}
