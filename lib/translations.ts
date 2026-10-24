import type { Food, LangCode, Time, Unit } from "./types";

export type Labels = {
  /** The language's name in its own script, for the picker. */
  name: string;
  dir: "ltr" | "rtl";
  title: string;
  times: Record<Time, string>;
  food: Record<Food, string>;
  /** [singular, plural] */
  units: Record<Unit, [string, string]>;
  call: string;
  made: string;
  disclaimer: string;
};

const en: Labels = {
  name: "English only",
  dir: "ltr",
  title: "Medicine timetable",
  times: { morning: "Morning", afternoon: "Afternoon", evening: "Evening", night: "Night", needed: "Only when needed" },
  food: { before: "Before food", after: "After food", with: "With food", any: "Any time" },
  units: {
    tablet: ["tablet", "tablets"],
    capsule: ["capsule", "capsules"],
    ml: ["ml", "ml"],
    drops: ["drop", "drops"],
    puff: ["puff", "puffs"],
    sachet: ["sachet", "sachets"],
    other: ["dose", "doses"],
  },
  call: "If unsure, call",
  made: "Made on",
  disclaimer: "Copied from the prescription. Check with your doctor or pharmacist.",
};

export const LABELS: Partial<Record<LangCode, Labels>> = { en };

export function labels(lang: LangCode): Labels {
  return LABELS[lang] ?? en;
}

export const ENGLISH = en;

/** "1 tablet", "2 tablets", "½ tablet", "5 ml" */
export function amountText(l: Labels, amount: number, unit: Unit): string {
  const n = amount === 0.5 ? "½" : Number.isInteger(amount) ? String(amount) : String(amount);
  const [one, many] = l.units[unit];
  return `${n} ${amount <= 1 ? one : many}`;
}
