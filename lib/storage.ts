import { LABELS } from "./translations";
import type { AppState } from "./types";

const KEY = "dosecard:v1";

/** Reads the saved list from this browser; anything missing or malformed gives null. */
export function load(store: Pick<Storage, "getItem"> | undefined = globalThis.localStorage): AppState | null {
  try {
    const raw = store?.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<AppState>;
    if (!Array.isArray(s.medicines)) return null;
    return {
      medicines: s.medicines,
      lang: s.lang && s.lang in LABELS ? s.lang : "en",
      patient: typeof s.patient === "string" ? s.patient : "",
      phone: typeof s.phone === "string" ? s.phone : "",
    };
  } catch {
    return null;
  }
}

/** Saves to this browser only. Blocked or full storage just means nothing is remembered. */
export function save(state: AppState, store: Pick<Storage, "setItem"> | undefined = globalThis.localStorage): void {
  try {
    store?.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
