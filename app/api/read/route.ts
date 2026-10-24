import { readPrescription } from "@/lib/reader";
import type { Medicine } from "@/lib/types";
import saved from "@/public/sample/reading.json";

export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

/**
 * POST multipart form: `image` (one photo), optional `sample=1` for the built-in sample.
 * Returns `{ medicines, source: "live" | "saved" }`. The photo is never stored or logged.
 * Only the sample may fall back to its saved reading, so judges can always try it.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("image");
  const sample = form?.get("sample") === "1";
  const fallback = () => Response.json({ medicines: saved.medicines as Medicine[], source: "saved" });

  if (!(file instanceof File)) return Response.json({ error: "Send one image in the 'image' field." }, { status: 400 });
  if (!TYPES.has(file.type)) return Response.json({ error: "That file isn't a photo." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "That photo is too large." }, { status: 413 });

  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) return sample ? fallback() : Response.json({ error: "The reader isn't set up." }, { status: 503 });
  try {
    const medicines = await readPrescription(new Uint8Array(await file.arrayBuffer()), file.type, key);
    return Response.json({ medicines, source: "live" });
  } catch {
    return sample ? fallback() : Response.json({ error: "The reader is unavailable right now." }, { status: 503 });
  }
}
