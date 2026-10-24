import { describe, expect, it } from "vitest";
import { LABELS, LANGS, amountText, labels } from "@/lib/translations";
import { FOODS, TIMES, UNITS } from "@/lib/types";

describe("translations", () => {
  it("covers all 16 languages", () => {
    expect(LANGS.map((g) => g.codes).flat().sort()).toEqual(
      ["ar", "bn", "en", "es", "fr", "gu", "hi", "kn", "ml", "mr", "pa", "pt", "ta", "te", "ur", "zh"].sort(),
    );
    for (const code of LANGS.flatMap((g) => g.codes)) expect(LABELS[code], code).toBeDefined();
  });

  it("gives every language every label, none empty", () => {
    for (const [code, l] of Object.entries(LABELS)) {
      const strings = [
        l.name, l.title, l.call, l.made, l.disclaimer, l.key,
        ...TIMES.map((t) => l.times[t]),
        ...FOODS.map((f) => l.food[f]),
        ...UNITS.flatMap((u) => l.units[u]),
      ];
      for (const s of strings) expect(s?.trim(), code).toBeTruthy();
    }
  });

  it("marks Urdu and Arabic as right-to-left and everything else left-to-right", () => {
    for (const [code, l] of Object.entries(LABELS)) expect(l.dir, code).toBe(code === "ur" || code === "ar" ? "rtl" : "ltr");
  });

  it("writes amounts with the right singular or plural", () => {
    expect(amountText(labels("en"), 1, "tablet")).toBe("1 tablet");
    expect(amountText(labels("en"), 2, "tablet")).toBe("2 tablets");
    expect(amountText(labels("en"), 0.5, "tablet")).toBe("½ tablet");
    expect(amountText(labels("en"), 1.5, "tablet")).toBe("1½ tablets");
    expect(amountText(labels("hi"), 2, "tablet")).toBe("2 गोलियाँ");
  });
});
