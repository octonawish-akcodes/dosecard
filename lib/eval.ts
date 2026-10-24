import type { CheckField, Food, Medicine, Time, Unit } from "./types";

/** What a careful pharmacist reads for one medicine on a test prescription. `key` is a word from its name. */
export type Truth = { key: string; amount: number; unit: Unit; times: Time[]; food: Food };

export type Field = "amount" | "unit" | "times" | "food";
const FIELDS: Field[] = ["amount", "unit", "times", "food"];

export type RowScore = {
  key: string;
  found: boolean;
  read?: string;
  fields: Record<Field, boolean>;
  /** Wrong fields the reader had marked Please check (so the family member would look again). */
  flaggedWrong: Field[];
};

export type PrescriptionScore = { rows: RowScore[]; extra: string[] };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const has = (name: string, key: string) => ` ${norm(name)} `.includes(` ${norm(key)}`);
const sameTimes = (a: Time[], b: Time[]) => a.length === b.length && a.every((t) => b.includes(t));

/** Scores one prescription: each true medicine against the read row whose name contains its key. */
export function scorePrescription(truth: Truth[], read: Medicine[], ignore: string[] = []): PrescriptionScore {
  const used = new Set<string>();
  const rows = truth.map((t): RowScore => {
    const m = read.find((r) => !used.has(r.id) && has(r.name, t.key));
    if (!m) return { key: t.key, found: false, fields: { amount: false, unit: false, times: false, food: false }, flaggedWrong: [] };
    used.add(m.id);
    const fields = {
      amount: m.amount === t.amount,
      unit: m.unit === t.unit,
      times: sameTimes(m.times, t.times),
      food: m.food === t.food,
    };
    const unsureOf = (f: Field): CheckField => (f === "unit" ? "amount" : f);
    const flaggedWrong = FIELDS.filter((f) => !fields[f] && m.unsure[unsureOf(f)]);
    return { key: t.key, found: true, read: m.name, fields, flaggedWrong };
  });
  const extra = read.filter((r) => !used.has(r.id) && !ignore.some((k) => has(r.name, k))).map((r) => r.name);
  return { rows, extra };
}

export function summarise(scores: PrescriptionScore[]) {
  const rows = scores.flatMap((s) => s.rows);
  const found = rows.filter((r) => r.found);
  const perField = Object.fromEntries(FIELDS.map((f) => [f, found.filter((r) => r.fields[f]).length])) as Record<Field, number>;
  const wrong = found.flatMap((r) => FIELDS.filter((f) => !r.fields[f]).map((f) => ({ r, f })));
  return {
    prescriptions: scores.length,
    medicines: rows.length,
    found: found.length,
    fields: found.length * FIELDS.length,
    fieldsRight: Object.values(perField).reduce((a, b) => a + b, 0),
    perField,
    rowsRight: found.filter((r) => FIELDS.every((f) => r.fields[f])).length,
    wrongFields: wrong.length,
    wrongFlagged: wrong.filter(({ r, f }) => r.flaggedWrong.includes(f)).length,
    extra: scores.reduce((n, s) => n + s.extra.length, 0),
  };
}
