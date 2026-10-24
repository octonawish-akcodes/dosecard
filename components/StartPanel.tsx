"use client";

import { useRef, useState } from "react";
import { ReadError, readPhoto, shrink } from "@/lib/read";
import { blankMedicine, type Medicine } from "@/lib/types";

type Props = {
  onRead: (medicines: Medicine[]) => void;
  onAddBlank: () => void;
};

type Status =
  | { kind: "idle" }
  | { kind: "reading" }
  | { kind: "done"; count: number; saved: boolean }
  | { kind: "problem"; text: string };

const NOTHING = "We couldn't find medicines in this photo. Try a clearer photo, or type them in.";
const UNAVAILABLE = "We couldn't read the photo just now. You can still type the medicines below.";

export function StartPanel({ onRead, onAddBlank }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const busy = status.kind === "reading";

  async function read(photo: Blob, sample: boolean) {
    setStatus({ kind: "reading" });
    try {
      const out = await readPhoto(sample ? photo : await shrink(photo), sample);
      if (!out.medicines.length) {
        onRead([blankMedicine()]);
        setStatus({ kind: "problem", text: NOTHING });
        return;
      }
      onRead(out.medicines);
      setStatus({ kind: "done", count: out.medicines.length, saved: out.source === "saved" });
    } catch (e) {
      onRead([blankMedicine()]);
      setStatus({ kind: "problem", text: e instanceof ReadError && e.message === "bad-photo" ? NOTHING : UNAVAILABLE });
    }
  }

  async function trySample() {
    const res = await fetch("/sample/prescription.jpg").catch(() => null);
    if (!res?.ok) return setStatus({ kind: "problem", text: UNAVAILABLE });
    await read(await res.blob(), true);
  }

  return (
    <div className="mt-6">
      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" className="btn" disabled={busy} onClick={() => input.current?.click()}>
          Upload prescription photo
        </button>
        <button type="button" className="btn-quiet" disabled={busy} onClick={trySample}>
          Try a sample prescription
        </button>
      </div>
      <button type="button" className="mt-2 text-sm font-bold text-muted underline underline-offset-4" onClick={onAddBlank}>
        or type the medicines myself
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-label="Prescription photo"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void read(f, false);
        }}
      />

      <div aria-live="polite" className="mt-3 min-h-6 text-[0.95rem]">
        {status.kind === "reading" && (
          <p className="status status-reading">
            <span className="spinner" aria-hidden /> Reading the prescription… this takes 10 to 20 seconds.
          </p>
        )}
        {status.kind === "done" && (
          <p className="status">
            Found {status.count} medicine{status.count === 1 ? "" : "s"}. Check each one against the paper before printing.
            {status.saved && <span className="saved-tag">Sample reading (saved)</span>}
          </p>
        )}
        {status.kind === "problem" && <p className="status status-problem">{status.text}</p>}
      </div>
    </div>
  );
}
