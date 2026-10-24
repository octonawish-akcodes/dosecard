import { buildChart, cardName } from "@/lib/card";
import { ENGLISH, amountText, labels, type Labels } from "@/lib/translations";
import type { LangCode, Medicine } from "@/lib/types";
import { legendKeys, type LegendKey } from "@/lib/dose";
import { DoseIcons, DoseShapeIcon, ForkSpoon, HalfTablet, TIME_ICON } from "./icons";

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

type Body = { medicines: Medicine[]; l: Labels; lang: LangCode };

const Amount = ({ m, l, lang }: { m: Medicine; l: Labels; lang: LangCode }) => (
  <Bi pick={(x) => amountText(x, m.amount, m.unit)} l={l} lang={lang} />
);
const FoodWords = ({ m, l, lang }: { m: Medicine; l: Labels; lang: LangCode }) =>
  m.food === "any" ? null : <Bi pick={(x) => x.food[m.food]} l={l} lang={lang} />;

/** One row per medicine, a column per time of day; the dose sits in the column when it's due. */
function Chart({ medicines, l, lang }: Body) {
  const { cols, rows } = buildChart(medicines);
  return (
    <table className="chart">
      <thead>
        <tr>
          <th className="chart-name-h">
            <span className="sr-only">Medicine</span>
          </th>
          {cols.map((t) => {
            const Icon = TIME_ICON[t];
            return (
              <th key={t} className={`chart-h chart-h-${t}`}>
                <Icon className="chart-icon" />
                <Bi pick={(x) => x.times[t]} l={l} lang={lang} />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((m) => (
          <tr key={m.id}>
            <th scope="row" className="chart-name">
              {cardName(m.name)}
              {m.food !== "any" && (
                <span className={`food-tag food-${m.food}`}>
                  <ForkSpoon className="food-icon" />
                  <FoodWords m={m} l={l} lang={lang} />
                </span>
              )}
              {m.note.trim() && <span className="chart-note">{m.note.trim()}</span>}
            </th>
            {cols.map((t) => (
              <td key={t} className={`chart-cell chart-c-${t}`}>
                {m.times.includes(t) ? (
                  <span className="chart-dose">
                    <DoseIcons amount={m.amount} unit={m.unit} />
                    <Amount m={m} l={l} lang={lang} />
                  </span>
                ) : (
                  <span className="chart-dash" aria-label="none">
                    —
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The picture and its words for one entry of the key. */
function keyEntry(k: LegendKey): { icon: React.JSX.Element; pick: (l: Labels) => string } {
  switch (k) {
    case "half":
      return { icon: <HalfTablet />, pick: (l) => `½ ${l.units.tablet[0]}` };
    case "cup":
      return { icon: <DoseShapeIcon shape="cup" />, pick: (l) => l.units.ml[0] };
    case "drop":
      return { icon: <DoseShapeIcon shape="drop" />, pick: (l) => l.units.drops[0] };
    default:
      return { icon: <DoseShapeIcon shape={k} />, pick: (l) => l.units[k][0] };
  }
}

/** Explains only the pictures this card uses. */
function PictureKey({ medicines, l, lang }: Body) {
  const keys = legendKeys(medicines);
  if (!keys.length) return null;
  return (
    <section className="picture-key" aria-label="What the pictures mean">
      <Bi pick={(x) => x.key} l={l} lang={lang} className="key-title" />
      <ul className="key-items">
        {keys.map((k) => {
          const { icon, pick } = keyEntry(k);
          return (
            <li key={k} className="key-item">
              <span className="key-icon">{icon}</span>
              <Bi pick={pick} l={l} lang={lang} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Card({ medicines, lang, patient, phone, made, example }: Props) {
  const l = labels(lang);
  return (
    <article id="card" className={`card ${example ? "card-example" : ""}`} aria-label="Medicine card preview">
      <header className="card-head">
        <Bi pick={(x) => x.title} l={l} lang={lang} className="card-title" />
        {patient.trim() && <p className="card-patient">{patient.trim()}</p>}
      </header>

      <Chart medicines={medicines} l={l} lang={lang} />
      <PictureKey medicines={medicines} l={l} lang={lang} />

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
