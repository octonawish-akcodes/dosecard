import { describe, expect, it } from "vitest";
import { doseIcons, legendKeys } from "@/lib/dose";
import type { Medicine } from "@/lib/types";

describe("doseIcons", () => {
  it("draws one whole tablet per tablet and a half for ½", () => {
    expect(doseIcons(1, "tablet")).toEqual({ shape: "tablet", whole: 1, half: false, more: 0 });
    expect(doseIcons(0.5, "tablet")).toEqual({ shape: "tablet", whole: 0, half: true, more: 0 });
    expect(doseIcons(1.5, "tablet")).toEqual({ shape: "tablet", whole: 1, half: true, more: 0 });
    expect(doseIcons(2, "tablet")).toEqual({ shape: "tablet", whole: 2, half: false, more: 0 });
  });

  it("caps the pictures at four and says how many more", () => {
    expect(doseIcons(6, "drops")).toEqual({ shape: "drop", whole: 4, half: false, more: 2 });
  });

  it("uses one measuring cup for syrup, whatever the ml", () => {
    expect(doseIcons(10, "ml")).toEqual({ shape: "cup", whole: 1, half: false, more: 0 });
  });

  it("has a shape for every unit", () => {
    expect(doseIcons(1, "capsule").shape).toBe("capsule");
    expect(doseIcons(2, "puff").shape).toBe("puff");
    expect(doseIcons(1, "sachet").shape).toBe("sachet");
    expect(doseIcons(1, "other").shape).toBe("dose");
  });
});

describe("legendKeys", () => {
  const m = (amount: number, unit: Medicine["unit"], food: Medicine["food"], times: Medicine["times"] = ["morning"]) => ({
    id: String(Math.random()), name: "X", amount, unit, food, times, note: "", unsure: {},
  });

  it("lists only the pictures used on the card, in a fixed order", () => {
    expect(legendKeys([m(1, "tablet", "after"), m(0.5, "tablet", "any"), m(10, "ml", "before")])).toEqual(["tablet", "half", "cup"]);
  });

  it("ignores medicines that aren't on the card", () => {
    expect(legendKeys([m(1, "capsule", "with", []), m(2, "drops", "any")])).toEqual(["drop"]);
  });

  it("is empty when there's nothing to explain", () => {
    expect(legendKeys([])).toEqual([]);
  });
});
