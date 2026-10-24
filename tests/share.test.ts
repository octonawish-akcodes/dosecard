import { describe, expect, it } from "vitest";
import { decodeCard, encodeCard, listenUrl } from "@/lib/share";
import type { Medicine } from "@/lib/types";

const meds: Medicine[] = [
  { id: "a", name: "Tab. Metformin 500 mg", amount: 1, unit: "tablet", times: ["morning", "night"], food: "after", note: "for 1 month", unsure: { food: true } },
  { id: "b", name: "Syp. Cremaffin", amount: 10, unit: "ml", times: ["night"], food: "any", note: "", unsure: {} },
  { id: "c", name: "Telma 40", amount: 0.5, unit: "tablet", times: ["needed"], food: "before", note: "", unsure: {} },
];

describe("card links", () => {
  it("round-trips the medicines, language and name (without ids or Please-check marks)", () => {
    const back = decodeCard(encodeCard({ medicines: meds, lang: "hi", patient: "कमला देवी" }));
    expect(back?.lang).toBe("hi");
    expect(back?.patient).toBe("कमला देवी");
    expect(back?.medicines.map(({ name, amount, unit, times, food, note }) => ({ name, amount, unit, times, food, note }))).toEqual(
      meds.map(({ name, amount, unit, times, food, note }) => ({ name, amount, unit, times, food, note })),
    );
    expect(back?.medicines.every((m) => Object.keys(m.unsure).length === 0)).toBe(true);
  });

  it("keeps only medicines that would be on the card", () => {
    const back = decodeCard(encodeCard({ medicines: [...meds, { ...meds[0], id: "x", name: "No time", times: [] }], lang: "en", patient: "" }));
    expect(back?.medicines).toHaveLength(3);
  });

  it("puts the card after # so it never reaches a server", () => {
    const url = listenUrl("https://dosecard.vercel.app", { medicines: meds, lang: "ta", patient: "" });
    expect(url.startsWith("https://dosecard.vercel.app/listen#")).toBe(true);
    expect(url).not.toContain("?");
  });

  it("stays short enough for a QR code (8 medicines under 900 characters)", () => {
    const eight = Array.from({ length: 8 }, (_, i) => ({ ...meds[0], id: String(i), name: `Tab. Medicine number ${i} 500 mg`, note: "for 1 month" }));
    expect(listenUrl("https://dosecard.vercel.app", { medicines: eight, lang: "ml", patient: "Nani" }).length).toBeLessThan(900);
  });

  it("rejects broken or tampered links instead of throwing", () => {
    expect(decodeCard("")).toBeNull();
    expect(decodeCard("not-base64!!")).toBeNull();
    expect(decodeCard(btoa(JSON.stringify({ v: 9 })))).toBeNull();
  });
});
