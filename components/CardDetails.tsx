"use client";

import { LABELS, LANGS } from "@/lib/translations";
import type { AppState, LangCode } from "@/lib/types";

type Props = { state: AppState; onChange: (patch: Partial<AppState>) => void };

export function CardDetails({ state, onChange }: Props) {
  return (
    <div className="med-row space-y-3">
      <label className="block">
        <span className="field-label">Your grandparent&apos;s language (printed under the English)</span>
        <select className="field" value={state.lang} onChange={(e) => onChange({ lang: e.target.value as LangCode })}>
          {LANGS.map(({ group, codes }) =>
            group ? (
              <optgroup key={group} label={group}>
                {codes.map((c) => (
                  <option key={c} value={c}>
                    {LABELS[c].name}
                  </option>
                ))}
              </optgroup>
            ) : (
              codes.map((c) => (
                <option key={c} value={c}>
                  {LABELS[c].name}
                </option>
              ))
            ),
          )}
        </select>
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <label>
          <span className="field-label">Name on the card (optional)</span>
          <input className="field" value={state.patient} placeholder="e.g. Nani" onChange={(e) => onChange({ patient: e.target.value })} />
        </label>
        <label>
          <span className="field-label">&ldquo;If unsure, call&rdquo; number (optional)</span>
          <input
            className="field"
            type="tel"
            inputMode="tel"
            value={state.phone}
            placeholder="e.g. 98765 43210"
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}
