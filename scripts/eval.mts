// Runs every test prescription through the same reader the app uses and scores it against the truth.
// Raw readings are cached in evals/raw/<id>.json so the published numbers can be re-scored without new AI calls.
// Run: pnpm eval            (uses cached readings when present)
//      pnpm eval -- --fresh (reads every image again)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { scorePrescription, summarise, type Truth } from "@/lib/eval";
import { readWithModel } from "@/lib/reader";
import type { Medicine } from "@/lib/types";

type Rx = { id: string; style: string; clinic: string; lines: string[]; truth: Truth[]; ignore?: string[] };
type Raw = { model: string; readAt: string; medicines: Medicine[] };

const fresh = process.argv.includes("--fresh");
const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const { prescriptions } = JSON.parse(readFileSync("evals/prescriptions.json", "utf8")) as { prescriptions: Rx[] };
mkdirSync("evals/raw", { recursive: true });

async function reading(rx: Rx): Promise<Raw> {
  const file = `evals/raw/${rx.id}.json`;
  if (!fresh && existsSync(file)) return JSON.parse(readFileSync(file, "utf8")) as Raw;
  if (!key) throw new Error("Set GOOGLE_GENERATIVE_AI_API_KEY in .env.local");
  const image = new Uint8Array(readFileSync(`public/evidence/${rx.id}.jpg`));
  for (let attempt = 1; ; attempt++) {
    try {
      const { medicines, model } = await readWithModel(image, "image/jpeg", key, process.env.ANTHROPIC_API_KEY);
      const raw = { model, readAt: new Date().toISOString(), medicines };
      writeFileSync(file, JSON.stringify(raw, null, 1));
      return raw;
    } catch (e) {
      if (attempt >= 3) throw e;
      await new Promise((r) => setTimeout(r, 15_000 * attempt));
    }
  }
}

const results = [];
for (const rx of prescriptions) {
  const raw = await reading(rx);
  const score = scorePrescription(rx.truth, raw.medicines, rx.ignore);
  results.push({ id: rx.id, style: rx.style, clinic: rx.clinic, lines: rx.lines, model: raw.model, readAt: raw.readAt, score, medicines: raw.medicines });
  const right = score.rows.filter((r) => r.found && Object.values(r.fields).every(Boolean)).length;
  console.log(`${rx.id}  ${raw.model.padEnd(24)} ${right}/${rx.truth.length} rows fully right, ${score.extra.length} extra`);
}

const summary = summarise(results.map((r) => r.score));
writeFileSync(
  "public/evidence/results.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), models: [...new Set(results.map((r) => r.model))], summary, results }, null, 1),
);
console.log(JSON.stringify(summary, null, 1));
