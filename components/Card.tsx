import { buildCard } from "@/lib/card";
import { ENGLISH, amountText, labels, type Labels } from "@/lib/translations";
import type { LangCode, Medicine } from "@/lib/types";
import { FoodMark, PillMarks, TIME_ICON } from "./icons";

type Props = {
  medicines: Medicine[];
  lang: LangCode;
  patient: string;
  phone: string;
  /** Date shown in the footer; computed in the browser so a static page never shows its build date. */
  made: string;
  /** Shows a faint example instead of the real list (first visit). */
  example?: boolean;
};

/** English on top; the chosen language underneath, in its own script and direction. */
function Bi({ pick, l, lang, className }: { pick: (l: Labels) => string; l: Labels; lang: LangCode; className?: string }) {
  const local = lang === "en" ? null : pick(l);
  return (
    <span className={`bi ${className ?? ""}`}>
      <span className="bi-en">{pick(ENGLISH)}</span>
      {local && local !== pick(ENGLISH) && (
        <span className="bi-local" lang={lang} dir={l.dir}>
          {local}
        </span>
      )}
    </span>
  );
}

export function Card({ medicines, lang, patient, phone, made, example }: Props) {
  const l = labels(lang);
  const rows = buildCard(medicines);
  return (
    <article id="card" className={`card ${example ? "card-example" : ""}`} aria-label="Medicine card preview">
      <header className="card-head">
        <Bi pick={(x) => x.title} l={l} lang={lang} className="card-title" />
        {patient.trim() && <p className="card-patient">{patient.trim()}</p>}
      </header>

      {rows.map((row) => {
        const Icon = TIME_ICON[row.time];
        return (
          <section key={row.time} className={`band band-${row.time}`}>
            <div className="band-label">
              <Icon className="band-icon" />
              <Bi pick={(x) => x.times[row.time]} l={l} lang={lang} className="band-name" />
            </div>
            <ul className="tiles">
              {row.medicines.map((m) => (
                <li key={m.id} className="tile">
                  <p className="tile-name">{m.name.trim()}</p>
                  <p className="tile-amount">
                    {(m.unit === "tablet" || m.unit === "capsule") && <PillMarks amount={m.amount} className="pill-marks" />}
                    <Bi pick={(x) => amountText(x, m.amount, m.unit)} l={l} lang={lang} />
                  </p>
                  {m.food !== "any" && (
                    <p className="tile-food">
                      <FoodMark food={m.food} className="food-mark" />
                      <Bi pick={(x) => x.food[m.food]} l={l} lang={lang} />
                    </p>
                  )}
                  {m.note.trim() && <p className="tile-note">{m.note.trim()}</p>}
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <footer className="card-foot">
        {phone.trim() && (
          <p className="card-call">
            <Bi pick={(x) => x.call} l={l} lang={lang} /> <strong dir="ltr">{phone.trim()}</strong>
          </p>
        )}
        {made && (
          <p className="card-small">
            <Bi pick={(x) => `${x.made} ${made}`} l={l} lang={lang} />
          </p>
        )}
        <p className="card-small">
          <Bi pick={(x) => x.disclaimer} l={l} lang={lang} />
        </p>
      </footer>
      {example && <p className="card-example-tag">Your card appears here</p>}
    </article>
  );
}
