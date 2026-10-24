import { TIMES, type Medicine, type Time } from "./types";

export type CardRow = { time: Time; medicines: Medicine[] };

const named = (m: Medicine) => m.name.trim().length > 0;

/** A named medicine with no time can't go on the card until the family member picks one. */
export function needsTime(m: Medicine): boolean {
  return named(m) && m.times.length === 0;
}

/** Turns the medicine list into the card's time-of-day rows: fixed order, empty rows left out. */
export function buildCard(medicines: Medicine[]): CardRow[] {
  const ready = medicines.filter((m) => named(m) && m.times.length > 0);
  return TIMES.map((time) => ({ time, medicines: ready.filter((m) => m.times.includes(time)) })).filter(
    (row) => row.medicines.length > 0,
  );
}

const FORM_PREFIX = /^(tab|tabs|cap|caps|syp|syr|inj|oint|susp)\.?\s+(?=\S)/i;

/** The name as shown on the card: without "Tab." / "Cap." / "Syp.", which the amount line already says. */
export function cardName(name: string): string {
  const n = name.trim();
  return n.replace(FORM_PREFIX, "") || n;
}
