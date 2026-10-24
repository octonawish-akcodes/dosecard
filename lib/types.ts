export const TIMES = ["morning", "afternoon", "evening", "night", "needed"] as const;
export type Time = (typeof TIMES)[number];

export const FOODS = ["before", "after", "with", "any"] as const;
export type Food = (typeof FOODS)[number];

export const UNITS = ["tablet", "capsule", "ml", "drops", "puff", "sachet", "other"] as const;
export type Unit = (typeof UNITS)[number];

/** Fields the reader can mark as uncertain; editing a field clears its mark. */
export type CheckField = "name" | "amount" | "times" | "food";

export type Medicine = {
  id: string;
  name: string;
  amount: number;
  unit: Unit;
  times: Time[];
  food: Food;
  note: string;
  unsure: Partial<Record<CheckField, true>>;
};

export type LangCode =
  | "en" | "hi" | "bn" | "mr" | "te" | "ta" | "gu" | "kn" | "ml" | "pa" | "ur"
  | "es" | "fr" | "ar" | "zh" | "pt";

export type AppState = {
  medicines: Medicine[];
  lang: LangCode;
  patient: string;
  phone: string;
};

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function blankMedicine(): Medicine {
  return { id: newId(), name: "", amount: 1, unit: "tablet", times: [], food: "any", note: "", unsure: {} };
}
