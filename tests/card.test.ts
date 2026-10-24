import { describe, expect, it } from "vitest";
import { buildCard, needsTime } from "@/lib/card";
import type { Medicine } from "@/lib/types";

const med = (over: Partial<Medicine>): Medicine => ({
  id: over.name ?? "x", name: "Med", amount: 1, unit: "tablet", times: [], food: "any", note: "", unsure: {}, ...over,
});

describe("buildCard", () => {
  it("puts a twice-a-day medicine in both of its rows, in time order", () => {
    const rows = buildCard([med({ name: "Metformin 500", times: ["night", "morning"], food: "after" })]);
    expect(rows.map((r) => r.time)).toEqual(["morning", "night"]);
    expect(rows[0].medicines[0].name).toBe("Metformin 500");
    expect(rows[1].medicines[0].name).toBe("Metformin 500");
  });

  it("leaves out empty time rows", () => {
    const rows = buildCard([med({ name: "A", times: ["afternoon"] })]);
    expect(rows.map((r) => r.time)).toEqual(["afternoon"]);
  });

  it("adds the 'when needed' row only when a medicine needs it, and puts it last", () => {
    expect(buildCard([med({ name: "A", times: ["morning"] })]).some((r) => r.time === "needed")).toBe(false);
    const rows = buildCard([med({ name: "P", times: ["needed"] }), med({ name: "A", times: ["morning"] })]);
    expect(rows.map((r) => r.time)).toEqual(["morning", "needed"]);
  });

  it("holds back medicines with no time and medicines with no name", () => {
    const rows = buildCard([med({ name: "No time", times: [] }), med({ name: "  ", times: ["morning"] })]);
    expect(rows).toEqual([]);
    expect(needsTime(med({ name: "No time", times: [] }))).toBe(true);
    expect(needsTime(med({ name: "", times: [] }))).toBe(false);
  });

  it("keeps the family member's order within a row", () => {
    const rows = buildCard([med({ name: "B", times: ["morning"] }), med({ name: "A", times: ["morning"] })]);
    expect(rows[0].medicines.map((m) => m.name)).toEqual(["B", "A"]);
  });
});
