import { describe, expect, it } from "vitest";
import { scorePrescription, summarise, type Truth } from "@/lib/eval";
import type { Medicine } from "@/lib/types";

const read = (name: string, over: Partial<Medicine> = {}): Medicine => ({
  id: name, name, amount: 1, unit: "tablet", times: ["morning"], food: "any", note: "", unsure: {}, ...over,
});
const truth = (key: string, over: Partial<Truth> = {}): Truth => ({ key, amount: 1, unit: "tablet", times: ["morning"], food: "any", ...over });

describe("scorePrescription", () => {
  it("matches medicines by name and scores each field", () => {
    const s = scorePrescription(
      [truth("metformin", { times: ["morning", "night"], food: "after" }), truth("amlodipine")],
      [read("Tab. Metformin 500 mg", { times: ["night", "morning"], food: "after" }), read("Tab. Amlodipine 5", { amount: 2 })],
    );
    expect(s.rows.map((r) => [r.key, r.found, r.fields])).toEqual([
      ["metformin", true, { amount: true, unit: true, times: true, food: true }],
      ["amlodipine", true, { amount: false, unit: true, times: true, food: true }],
    ]);
    expect(s.extra).toEqual([]);
  });

  it("counts a missed medicine and a made-up one, but not lines marked ignore", () => {
    const s = scorePrescription([truth("metformin"), truth("losartan")], [read("Metformin"), read("Diclofenac gel"), read("Vitamin C")], ["diclofenac"]);
    expect(s.rows.find((r) => r.key === "losartan")?.found).toBe(false);
    expect(s.extra).toEqual(["Vitamin C"]);
  });

  it("records whether a wrong field was marked Please check", () => {
    const s = scorePrescription([truth("telmisartan", { amount: 0.5 })], [read("Telmisartan", { amount: 1, unsure: { amount: true } })]);
    expect(s.rows[0].flaggedWrong).toEqual(["amount"]);
  });
});

describe("summarise", () => {
  it("adds up medicines found, fields right, rows fully right and extras", () => {
    const a = scorePrescription([truth("a"), truth("b")], [read("A"), read("B", { food: "after" })]);
    const b = scorePrescription([truth("c")], [read("Zz")]);
    expect(summarise([a, b])).toMatchObject({
      medicines: 3, found: 2, fields: 8, fieldsRight: 7, rowsRight: 1, extra: 1,
    });
  });
});
