import type { Medicine } from "./types";
import { newId } from "./types";

export type ReadOutcome = { medicines: Medicine[]; source: "live" | "saved" };
export class ReadError extends Error {}

/** Shrinks a photo to at most 1600 px on its long side as JPEG. Falls back to the original if the browser can't decode it. */
export async function shrink(file: Blob, max = 1600): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    return out ?? file;
  } catch {
    return file;
  }
}

/** Sends the photo to /api/read. Throws ReadError on any failure so the page can show one plain message. */
export async function readPhoto(photo: Blob, sample = false): Promise<ReadOutcome> {
  const body = new FormData();
  body.append("image", photo, "prescription.jpg");
  if (sample) body.append("sample", "1");
  let res: Response;
  try {
    res = await fetch("/api/read", { method: "POST", body, signal: AbortSignal.timeout(90_000) });
  } catch {
    throw new ReadError("unavailable");
  }
  if (!res.ok) throw new ReadError(res.status === 400 || res.status === 413 ? "bad-photo" : "unavailable");
  const data = (await res.json()) as ReadOutcome;
  // Fresh ids so a reading never collides with rows already on screen.
  return { source: data.source, medicines: data.medicines.map((m) => ({ ...m, id: newId() })) };
}
