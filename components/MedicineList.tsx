"use client";

import { useState } from "react";
import { needsTime } from "@/lib/card";
import { ENGLISH, amountText } from "@/lib/translations";
import { FOODS, TIMES, UNITS, blankMedicine, type CheckField, type Medicine, type Time } from "@/lib/types";

type Props = { medicines: Medicine[]; onChange: (next: Medicine[]) => void };

const TIME_SHORT: Record<Time, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
  needed: "When needed",
};

/** Tablets can be halved; syrup goes in 2.5 ml steps; everything else is counted whole. */
const stepFor = (unit: Medicine["unit"]) => (unit === "tablet" ? 0.5 : unit === "ml" ? 2.5 : 1);

function Check({ show }: { show?: true }) {
  return show ? <span className="check-tag">Please check</span> : null;
}

/** One medicine: name, dose stepper, times and food up front; unit and note behind "More". */
function Row({ m, i, update, remove }: {
  m: Medicine;
  i: number;
  update: (patch: Partial<Medicine>, field?: CheckField) => void;
  remove: () => void;
}) {
  const [more, setMore] = useState(m.note.trim().length > 0 || !["tablet", "capsule", "ml"].includes(m.unit));
  const step = stepFor(m.unit);
  const unsureAny = Object.keys(m.unsure).length > 0;
  return (
    <fieldset className={`med-row ${unsureAny ? "med-row-unsure" : ""}`}>
      <legend className="sr-only">Medicine {i + 1}</legend>
      <div className="flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">Name, as on the box</span>
          <input
            className={`field field-name ${m.unsure.name ? "field-unsure" : ""}`}
            value={m.name}
            placeholder="Medicine name, as on the box"
            onChange={(e) => update({ name: e.target.value }, "name")}
          />
        </label>
        <button type="button" className="icon-btn" aria-label={`Remove ${m.name || "this medicine"}`} onClick={remove}>
          ×
        </button>
      </div>
      {m.unsure.name && <Check show />}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className={`stepper ${m.unsure.amount ? "field-unsure" : ""}`} role="group" aria-label="How much each time">
          <button
            type="button"
            aria-label="Less"
            disabled={m.amount <= step}
            onClick={() => update({ amount: Math.max(step, m.amount - step) }, "amount")}
          >
            −
          </button>
          <output aria-live="polite">{amountText(ENGLISH, m.amount, m.unit)}</output>
          <button type="button" aria-label="More" onClick={() => update({ amount: m.amount + step }, "amount")}>
            +
          </button>
        </div>
        <Check show={m.unsure.amount} />
      </div>

      <div className="mt-3">
        <span className="field-label">
          When <Check show={m.unsure.times} />
        </span>
        <div className={`flex flex-wrap gap-1.5 ${m.unsure.times ? "chips-unsure" : ""}`}>
          {TIMES.map((t) => {
            const on = m.times.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                className={`chip chip-${t} ${on ? "chip-on" : ""}`}
                onClick={() => update({ times: on ? m.times.filter((x) => x !== t) : [...m.times, t] }, "times")}
              >
                {TIME_SHORT[t]}
              </button>
            );
          })}
        </div>
        {needsTime(m) && <p className="warn">Pick when to take this. It won&apos;t show on the card until you do.</p>}
      </div>

      <div className="mt-3">
        <span className="field-label">
          Food <Check show={m.unsure.food} />
        </span>
        <div className={`segmented ${m.unsure.food ? "chips-unsure" : ""}`} role="group" aria-label="Food">
          {FOODS.map((f) => (
            <button key={f} type="button" aria-pressed={m.food === f} onClick={() => update({ food: f }, "food")}>
              {ENGLISH.food[f]}
            </button>
          ))}
        </div>
      </div>

      {more ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-[9rem_1fr]">
          <label>
            <span className="field-label">Unit</span>
            <select className="field" value={m.unit} onChange={(e) => update({ unit: e.target.value as Medicine["unit"] }, "amount")}>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {ENGLISH.units[u][1]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="field-label">Short note</span>
            <input className="field" value={m.note} placeholder="e.g. for 5 days" onChange={(e) => update({ note: e.target.value })} />
          </label>
        </div>
      ) : (
        <button type="button" className="link-btn mt-2" onClick={() => setMore(true)}>
          Change unit or add a note
        </button>
      )}
    </fieldset>
  );
}

export function MedicineList({ medicines, onChange }: Props) {
  const update = (id: string) => (patch: Partial<Medicine>, field?: CheckField) =>
    onChange(
      medicines.map((m) => {
        if (m.id !== id) return m;
        const unsure = { ...m.unsure };
        if (field) delete unsure[field];
        return { ...m, ...patch, unsure };
      }),
    );

  return (
    <div className="space-y-3">
      {medicines.map((m, i) => (
        <Row key={m.id} m={m} i={i} update={update(m.id)} remove={() => onChange(medicines.filter((x) => x.id !== m.id))} />
      ))}
      <button type="button" className="btn-ghost w-full" onClick={() => onChange([...medicines, blankMedicine()])}>
        + Add a medicine
      </button>
    </div>
  );
}
