import { TIMES, type Medicine, type Time } from "./types";

const named = (m: Medicine) => m.name.trim().length > 0;

/** A named medicine with no time can't go on the card until the family member picks one. */
export function needsTime(m: Medicine): boolean {
  return named(m) && m.times.length === 0;
}

/** The tick chart: one row per ready medicine, a column per time of day ("when needed" only if used). */
export function buildChart(medicines: Medicine[]): { cols: Time[]; rows: Medicine[] } {
  const rows = medicines.filter((m) => named(m) && m.times.length > 0);
  const cols = TIMES.filter((t) => t !== "needed" || rows.some((m) => m.times.includes("needed")));
  return { cols, rows };
}

const FORM_PREFIX = /^(tab|tabs|cap|caps|syp|syr|inj|oint|susp)\.?\s+(?=\S)/i;

/** The name as shown on the card: without "Tab." / "Cap." / "Syp.", which the amount line already says. */
export function cardName(name: string): string {
  const n = name.trim();
  return n.replace(FORM_PREFIX, "") || n;
}
