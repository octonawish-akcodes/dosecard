import { describe, expect, it } from "vitest";
import { spokenTimes, voiceLang } from "@/lib/speech";
import type { Medicine } from "@/lib/types";

const meds: Medicine[] = [
  { id: "a", name: "Tab. Metformin 500 mg", amount: 1, unit: "tablet", times: ["morning", "night"], food: "after", note: "", unsure: {} },
  { id: "b", name: "Amlodipine 5", amount: 1, unit: "tablet", times: ["morning"], food: "any", note: "", unsure: {} },
];

describe("spoken card", () => {
  it("reads each time of day in order, with every medicine due then", () => {
    const s = spokenTimes(meds, "en");
    expect(s.map((t) => t.time)).toEqual(["morning", "night"]);
    expect(s[0].text).toBe("Morning. Metformin 500 mg, 1 tablet, after food. Amlodipine 5, 1 tablet.");
    expect(s[1].text).toBe("Night. Metformin 500 mg, 1 tablet, after food.");
  });

  it("speaks in the chosen language, keeping the medicine names as printed", () => {
    const [morning] = spokenTimes(meds, "hi");
    expect(morning.text).toBe("सुबह। Metformin 500 mg, 1 गोली, खाने के बाद। Amlodipine 5, 1 गोली।");
  });

  it("maps each card language to a voice language", () => {
    expect(voiceLang("hi")).toBe("hi-IN");
    expect(voiceLang("ta")).toBe("ta-IN");
    expect(voiceLang("zh")).toBe("zh-CN");
    expect(voiceLang("en")).toBe("en-IN");
  });
});
