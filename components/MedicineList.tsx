"use client";

import { needsTime } from "@/lib/card";
import { ENGLISH } from "@/lib/translations";
import { FOODS, TIMES, UNITS, blankMedicine, type CheckField, type Medicine, type Time } from "@/lib/types";

type Props = { medicines: Medicine[]; onChange: (next: Medicine[]) => void };

const TIME_SHORT: Record<Time, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
  needed: "When needed",
};

function Check({ show }: { show?: true }) {
  return show ? <span className="check-tag">Please check</span> : null;
}

export function MedicineList({ medicines, onChange }: Props) {
  const update = (id: string, patch: Partial<Medicine>, field?: CheckField) =>
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
        <fieldset key={m.id} className="med-row">
          <legend className="sr-only">Medicine {i + 1}</legend>
          <div className="flex items-start gap-2">
            <label className="flex-1">
              <span className="field-label">
                Name, as on the box <Check show={m.unsure.name} />
              </span>
              <input
                className={`field ${m.unsure.name ? "field-unsure" : ""}`}
                value={m.name}
                placeholder="e.g. Metformin 500"
                onChange={(e) => update(m.id, { name: e.target.value }, "name")}
              />
            </label>
            <button
              type="button"
              className="icon-btn mt-6"
              aria-label={`Remove ${m.name || "this medicine"}`}
              onClick={() => onChange(medicines.filter((x) => x.id !== m.id))}
            >
              ×
            </button>
          </div>

          <div className="mt-3 grid grid-cols-[5.5rem_1fr_1fr] gap-2">
            <label>
              <span className="field-label">
                Amount <Check show={m.unsure.amount} />
              </span>
              <input
                className={`field ${m.unsure.amount ? "field-unsure" : ""}`}
                type="number"
                min={0.5}
                step={0.5}
                value={m.amount}
                onChange={(e) => update(m.id, { amount: Math.max(0.5, Number(e.target.value) || 1) }, "amount")}
              />
            </label>
            <label>
              <span className="field-label">Unit</span>
              <select
                className="field"
                value={m.unit}
                onChange={(e) => update(m.id, { unit: e.target.value as Medicine["unit"] }, "amount")}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {ENGLISH.units[u][1]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">
                Food <Check show={m.unsure.food} />
              </span>
              <select
                className={`field ${m.unsure.food ? "field-unsure" : ""}`}
                value={m.food}
                onChange={(e) => update(m.id, { food: e.target.value as Medicine["food"] }, "food")}
              >
                {FOODS.map((f) => (
                  <option key={f} value={f}>
                    {ENGLISH.food[f]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3">
            <span className="field-label">
              When to take it <Check show={m.unsure.times} />
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
                    onClick={() =>
                      update(m.id, { times: on ? m.times.filter((x) => x !== t) : [...m.times, t] }, "times")
                    }
                  >
                    {TIME_SHORT[t]}
                  </button>
                );
              })}
            </div>
            {needsTime(m) && <p className="warn">Pick when to take this. It won&apos;t show on the card until you do.</p>}
          </div>

          <label className="mt-3 block">
            <span className="field-label">Short note (optional)</span>
            <input
              className="field"
              value={m.note}
              placeholder="e.g. for 5 days"
              onChange={(e) => update(m.id, { note: e.target.value })}
            />
          </label>
        </fieldset>
      ))}

      <button type="button" className="btn-ghost w-full" onClick={() => onChange([...medicines, blankMedicine()])}>
        + Add medicine
      </button>
    </div>
  );
}
