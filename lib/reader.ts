import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { FOODS, TIMES, UNITS, newId, type CheckField, type Medicine } from "./types";

/** The fixed shape the vision model must return. */
export const ReadResult = z.object({
  medicines: z
    .array(
      z.object({
        name: z.string().describe("Medicine name and strength exactly as written, e.g. 'Tab. Metformin 500 mg'"),
        amount: z.number().describe("How many units per dose, e.g. 1, 0.5 or 10. Use 0 if not written."),
        unit: z.enum(UNITS),
        times: z.array(z.enum(TIMES)),
        food: z.enum(FOODS),
        note: z.string().describe("Short note copied from the paper, e.g. 'for 1 month', 'once a week (Sunday)'. Empty if none."),
        unsure: z.array(z.enum(["name", "amount", "times", "food"])).describe("Fields that are unclear or not written"),
      }),
    )
    .max(20),
});
export type ReadResult = z.infer<typeof ReadResult>;

export const MODELS = ["gemini-3.5-flash", "gemini-3-flash-preview", "gemini-3.1-flash-lite"];

export const PROMPT = `You copy medicines from a photo of a prescription so a family member can make a timetable for an elderly patient.
Rules:
- Copy ONLY medicines written on the paper. Never add, guess or suggest a medicine, dose or time.
- Skip everything else: doctor, clinic, patient details, complaints, diagnosis, BP, tests, advice.
- name: as written, including form and strength (e.g. "Tab. Metformin 500 mg", "Syp. Cremaffin").
- Indian prescription shorthand:
  - "1-0-1" style = morning-afternoon-night counts (1-0-1 → morning + night; 0-0-1 → night; 1-1-1 → morning + afternoon + night; 1-0-0 → morning). A fourth number, if present, is evening/bedtime.
  - OD = once a day (morning unless written otherwise); BD/BID = morning + night; TDS/TID = morning + afternoon + night; QID = morning + afternoon + evening + night; HS = night (bedtime); SOS/PRN = "needed".
  - AC / before food / empty stomach = "before"; PC / after food = "after"; with food/meals = "with". If food timing is not written, use "any" and do NOT mark food unsure.
- amount: the number of tablets/capsules/ml/drops/puffs/sachets per dose (1 if the paper implies one, e.g. "Tab. X 1-0-1"). Syrups: ml per dose. Use 0 if no amount can be worked out.
- unit: tablet for Tab., capsule for Cap., ml for syrups/suspensions, drops, puff for inhalers, sachet, else other.
- Weekly or unusual schedules: pick the time of day if written (else "morning") and copy the schedule into note.
- note: duration or special instruction copied briefly from the paper, else "".
- unsure: list every field that is unclear or hard to read, or that you had to guess. When in doubt, mark it unsure.
If the photo has no medicines, return an empty list.`;

/** Rows the family member can edit; nameless rows are dropped and anything doubtful gets a Please-check mark. */
export function toMedicines(r: ReadResult): Medicine[] {
  return r.medicines
    .filter((m) => m.name.trim())
    .map((m) => {
      const unsure: Partial<Record<CheckField, true>> = {};
      for (const f of m.unsure) unsure[f] = true;
      const times = TIMES.filter((t) => m.times.includes(t));
      if (!times.length) unsure.times = true;
      const amount = m.amount > 0 ? Math.round(m.amount * 2) / 2 || 0.5 : 1;
      if (m.amount <= 0) unsure.amount = true;
      return { id: newId(), name: m.name.trim(), amount, unit: m.unit, times, food: m.food, note: m.note.trim(), unsure };
    });
}

/** Tries each model in turn (quota, overload or timeout on one moves to the next); throws the last error. */
export async function tryInTurn<T>(ids: string[], call: (id: string) => Promise<T>): Promise<T> {
  let last: unknown = new Error("no models");
  for (const id of ids) {
    try {
      return await call(id);
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

/** Sends one image to Gemini and returns validated rows. Never logs the image or the result. */
export async function readPrescription(image: Uint8Array, mediaType: string, apiKey: string): Promise<Medicine[]> {
  const google = createGoogleGenerativeAI({ apiKey });
  const r = await tryInTurn(MODELS, (id) =>
    generateText({
      model: google(id),
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(30_000),
      output: Output.object({ schema: ReadResult }),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image", image, mediaType },
          ],
        },
      ],
    }),
  );
  return toMedicines(ReadResult.parse(r.output));
}
