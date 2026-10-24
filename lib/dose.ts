import type { Unit } from "./types";

export type DoseShape = "tablet" | "capsule" | "drop" | "cup" | "puff" | "sachet" | "dose";

const SHAPE: Record<Unit, DoseShape> = {
  tablet: "tablet",
  capsule: "capsule",
  drops: "drop",
  ml: "cup",
  puff: "puff",
  sachet: "sachet",
  other: "dose",
};

const MAX = 4;

/** What to draw for one dose: whole pictures, an optional half (tablets only), and how many didn't fit. */
export function doseIcons(amount: number, unit: Unit): { shape: DoseShape; whole: number; half: boolean; more: number } {
  const shape = SHAPE[unit];
  // Syrup is measured, not counted: one cup with the ml written beside it.
  if (shape === "cup") return { shape, whole: 1, half: false, more: 0 };
  const count = Math.floor(amount);
  const half = shape === "tablet" && amount - count >= 0.5;
  const whole = Math.min(count, MAX);
  return { shape, whole, half, more: count - whole };
}
