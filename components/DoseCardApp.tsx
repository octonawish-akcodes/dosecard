"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { load, save } from "@/lib/storage";
import type { AppState, Medicine } from "@/lib/types";
import { blankMedicine } from "@/lib/types";
import { Card } from "./Card";
import { CardDetails } from "./CardDetails";
import { MedicineList } from "./MedicineList";
import { StartPanel } from "./StartPanel";

/** Shown faintly on first visit so the family member can see what they're making. */
const EXAMPLE: Medicine[] = [
  { id: "e1", name: "Metformin 500", amount: 1, unit: "tablet", times: ["morning", "night"], food: "after", note: "", unsure: {} },
  { id: "e2", name: "Amlodipine 5", amount: 1, unit: "tablet", times: ["morning"], food: "any", note: "", unsure: {} },
  { id: "e3", name: "Pantoprazole 40", amount: 1, unit: "tablet", times: ["morning"], food: "before", note: "", unsure: {} },
];

const noSubscribe = () => () => {};
const todayText = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const START: AppState = { medicines: [], lang: "en", patient: "", phone: "" };

export function DoseCardApp() {
  const [state, setState] = useState<AppState>(START);
  const setMedicines = (medicines: Medicine[]) => setState((s) => ({ ...s, medicines }));
  const empty = state.medicines.every((m) => !m.name.trim());
  const made = useSyncExternalStore(noSubscribe, todayText, () => "");

  // Bring back the list saved in this browser, then save every change. Nothing leaves the browser.
  // Saving starts only after the restore has rendered, so the empty first render never overwrites the saved list.
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    const saved = load();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time restore from browser storage after hydration */
    if (saved) setState(saved);
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => {
    if (restored) save(state);
  }, [restored, state]);

  const printButton = (
    <button type="button" className="btn w-full" disabled={empty} onClick={() => window.print()}>
      Print card
    </button>
  );

  return (
    <main className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)] gap-8 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:py-10">
      <section aria-labelledby="app-title" className="app-panel">
        <h1 id="app-title" className="font-display text-4xl text-ink">
          Dose Card
        </h1>
        <p className="mt-2 text-lg leading-snug text-muted">
          Turn a prescription into a big, picture timetable your grandparent can read on the fridge, in English and
          their own language.
        </p>

        <StartPanel onRead={setMedicines} onAddBlank={() => setMedicines([...state.medicines, blankMedicine()])} />

        {state.medicines.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">1. Check each medicine against the paper</h2>
            <MedicineList medicines={state.medicines} onChange={setMedicines} />
          </div>
        )}

        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
            {state.medicines.length > 0 ? "2. " : ""}Card details
          </h2>
          <CardDetails state={state} onChange={(patch) => setState((s) => ({ ...s, ...patch }))} />
        </div>

        <div className="mt-6 grid gap-2">
          {printButton}
          {!empty && (
            <a href="#card" className="btn-quiet text-center lg:hidden">
              See card
            </a>
          )}
          <p className="text-sm text-muted">Saved in this browser only. Nothing is stored on our server.</p>
        </div>
      </section>

      <section aria-label="Card preview" className="preview lg:sticky lg:top-6 lg:self-start">
        <Card
          medicines={empty ? EXAMPLE : state.medicines}
          lang={state.lang}
          patient={state.patient}
          phone={state.phone}
          made={made}
          example={empty}
        />
      </section>
    </main>
  );
}
