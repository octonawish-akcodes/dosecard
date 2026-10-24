import { describe, expect, it } from "vitest";
import { ReadResult, toMedicines, tryInTurn } from "@/lib/reader";

describe("toMedicines", () => {
  it("maps the reader's output into editable rows with Please-check marks", () => {
    const meds = toMedicines(
      ReadResult.parse({
        medicines: [
          { name: "Tab. Metformin 500 mg", amount: 1, unit: "tablet", times: ["morning", "night"], food: "after", note: "for 1 month", unsure: [] },
          { name: "Syp. Cremaffin", amount: 10, unit: "ml", times: ["night"], food: "any", note: "", unsure: ["food", "amount"] },
        ],
      }),
    );
    expect(meds).toHaveLength(2);
    expect(meds[0]).toMatchObject({ name: "Tab. Metformin 500 mg", amount: 1, unit: "tablet", times: ["morning", "night"], food: "after", note: "for 1 month", unsure: {} });
    expect(meds[1].unsure).toEqual({ food: true, amount: true });
    expect(meds[0].id).not.toBe(meds[1].id);
  });

  it("drops nameless rows, removes duplicate times and keeps them in day order", () => {
    const meds = toMedicines(
      ReadResult.parse({
        medicines: [
          { name: "  ", amount: 1, unit: "tablet", times: ["morning"], food: "any", note: "", unsure: [] },
          { name: "Atorvastatin 10", amount: 1, unit: "tablet", times: ["night", "morning", "night"], food: "any", note: "", unsure: [] },
        ],
      }),
    );
    expect(meds.map((m) => m.name)).toEqual(["Atorvastatin 10"]);
    expect(meds[0].times).toEqual(["morning", "night"]);
  });

  it("marks a medicine with no time as unsure about times, and clamps a missing amount to 1", () => {
    const [m] = toMedicines(
      ReadResult.parse({ medicines: [{ name: "Vitamin D3 60K", amount: 0, unit: "capsule", times: [], food: "any", note: "once a week", unsure: [] }] }),
    );
    expect(m.amount).toBe(1);
    expect(m.unsure).toEqual({ times: true, amount: true });
  });

  it("rejects output that isn't the agreed shape", () => {
    expect(ReadResult.safeParse({ medicines: [{ name: "X", unit: "spoonful" }] }).success).toBe(false);
  });
});

describe("tryInTurn", () => {
  it("moves to the next model when one fails, and returns the first answer", async () => {
    const tried: string[] = [];
    const out = await tryInTurn(["a", "b", "c"], async (id) => {
      tried.push(id);
      if (id === "a") throw new Error("429");
      return `answer from ${id}`;
    });
    expect(out).toBe("answer from b");
    expect(tried).toEqual(["a", "b"]);
  });

  it("throws the last error when every model fails", async () => {
    await expect(tryInTurn(["a", "b"], async (id) => { throw new Error(`down ${id}`); })).rejects.toThrow("down b");
  });
});
