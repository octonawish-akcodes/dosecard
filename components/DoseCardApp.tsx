"use client";

import { useState, useSyncExternalStore } from "react";
import type { AppState, Medicine } from "@/lib/types";
import { blankMedicine } from "@/lib/types";
import { Card } from "./Card";
import { MedicineList } from "./MedicineList";

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

  return (
    <main className="mx-auto grid max-w-[1400px] gap-8 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:py-10">
      <section aria-labelledby="app-title" className="app-panel">
        <h1 id="app-title" className="font-display text-4xl text-ink">
          Dose Card
        </h1>
        <p className="mt-2 text-lg leading-snug text-muted">
          Turn a prescription into a big, picture timetable your grandparent can read on the fridge, in English and
          their own language.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" className="btn-quiet" onClick={() => setMedicines([...state.medicines, blankMedicine()])}>
            Type medicines myself
          </button>
        </div>

        {state.medicines.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Check each medicine against the paper</h2>
            <MedicineList medicines={state.medicines} onChange={setMedicines} />
          </div>
        )}

        {!empty && (
          <a href="#card" className="btn mt-6 w-full lg:hidden">
            See card
          </a>
        )}
      </section>

      <section aria-label="Card preview" className="lg:sticky lg:top-6 lg:self-start">
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
