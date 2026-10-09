import type { DoughErrorCode } from "../core/types";
import { strings } from "../strings";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  code?: DoughErrorCode;
  message?: string;
}

const MESSAGES: Record<DoughErrorCode, string> = {
  invalidInput: strings.errorInvalidInput,
  impossibleCalculation: strings.errorImpossibleCalculation,
};

export function ErrorMessage({ code, message }: ErrorMessageProps) {
  const text = message ?? (code ? MESSAGES[code] : "");

  return (
    <p className={styles.error} role="alert">
      {text}
    </p>
  );
}
