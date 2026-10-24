import { describe, expect, it } from "vitest";
import { load, save } from "@/lib/storage";
import type { AppState } from "@/lib/types";

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

const state: AppState = {
  medicines: [{ id: "a", name: "Metformin", amount: 1, unit: "tablet", times: ["morning"], food: "after", note: "", unsure: {} }],
  lang: "ta",
  patient: "Kamla Devi",
  phone: "98765 43210",
};

describe("storage", () => {
  it("round-trips the list, language, name and phone", () => {
    const s = memory();
    save(state, s);
    expect(load(s)).toEqual(state);
  });

  it("returns null for nothing saved or broken data, and falls back to English for an unknown language", () => {
    const s = memory();
    expect(load(s)).toBeNull();
    s.setItem("dosecard:v1", "{not json");
    expect(load(s)).toBeNull();
    s.setItem("dosecard:v1", JSON.stringify({ ...state, lang: "xx" }));
    expect(load(s)?.lang).toBe("en");
  });

  it("never throws when storage is blocked", () => {
    const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("full"); } };
    expect(load(blocked)).toBeNull();
    expect(() => save(state, blocked)).not.toThrow();
  });
});
