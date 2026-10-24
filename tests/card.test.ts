import { describe, expect, it } from "vitest";
import { buildChart, cardName, needsTime } from "@/lib/card";
import type { Medicine } from "@/lib/types";

const med = (over: Partial<Medicine>): Medicine => ({
  id: over.name ?? "x", name: "Med", amount: 1, unit: "tablet", times: [], food: "any", note: "", unsure: {}, ...over,
});

describe("buildChart", () => {
  it("lists named medicines that have a time, in the family member's order", () => {
    const { rows } = buildChart([
      med({ name: "B", times: ["morning"] }),
      med({ name: "No time", times: [] }),
      med({ name: "  ", times: ["night"] }),
      med({ name: "A", times: ["night", "morning"] }),
    ]);
    expect(rows.map((m) => m.name)).toEqual(["B", "A"]);
  });

  it("always has the four times of day, and adds 'when needed' only if a medicine needs it", () => {
    expect(buildChart([med({ name: "A", times: ["morning"] })]).cols).toEqual(["morning", "afternoon", "evening", "night"]);
    expect(buildChart([med({ name: "P", times: ["needed"] })]).cols).toEqual(["morning", "afternoon", "evening", "night", "needed"]);
  });

  it("flags a named medicine with no time so it can be fixed before printing", () => {
    expect(needsTime(med({ name: "No time", times: [] }))).toBe(true);
    expect(needsTime(med({ name: "", times: [] }))).toBe(false);
  });
});

describe("cardName", () => {
  it("drops the form prefix the amount line already says", () => {
    expect(cardName("Tab. Metformin 500 mg")).toBe("Metformin 500 mg");
    expect(cardName("Cap. Vitamin D3 60K")).toBe("Vitamin D3 60K");
    expect(cardName("Syp. Cremaffin")).toBe("Cremaffin");
    expect(cardName("tab metformin")).toBe("metformin");
    expect(cardName("Tablets Ltd vitamin")).toBe("Tablets Ltd vitamin");
    expect(cardName("Tab.")).toBe("Tab.");
  });
});
