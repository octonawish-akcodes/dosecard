import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Site";
import data from "@/public/evidence/results.json";
import spec from "@/evals/prescriptions.json";

export const metadata: Metadata = {
  title: "Evidence: how well Dose Card reads a prescription",
  description: "Dose Card's prescription reader, scored field by field on 17 fictional test prescriptions.",
};

const FIELD_NAMES = { amount: "How much", unit: "Unit", times: "When", food: "Before or after food" } as const;
const STYLE_NAMES: Record<string, string> = {
  "hand-bradley": "Neat handwriting",
  "hand-noteworthy": "Rounded handwriting",
  "hand-chalk": "Loose handwriting",
  "hand-marker": "Felt-pen handwriting",
  "hand-script": "Elaborate script",
  typed: "Typed hospital printout",
};

type SpecRx = { id: string; hard?: string; truthNote?: string; missNote?: string; ignore?: string[] };

export default function Evidence() {
  const s = data.summary;
  const extra = (spec.prescriptions as SpecRx[]).reduce<Record<string, SpecRx>>((m, r) => ({ ...m, [r.id]: r }), {});
  const misses = data.results.flatMap((r) =>
    r.score.rows
      .filter((row) => row.found && !Object.values(row.fields).every(Boolean))
      .map((row) => ({ id: r.id, row, read: r.medicines.find((m) => m.name === row.read) })),
  );
  const date = new Date(data.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <SiteHeader />
      <main className="evidence">
        <section className="ev-head">
          <h1 className="display-1">How well does Dose Card read a prescription?</h1>
          <p className="ev-lede">
            On {s.prescriptions} test prescriptions listing {s.medicines} medicines, Dose Card found all {s.found} and read{" "}
            {s.fieldsRight} of {s.fields} details right. It added no medicines that weren&apos;t on the paper.
          </p>
        </section>

        <section className="ev-numbers" aria-label="Results by detail">
          <table className="ev-table">
            <thead>
              <tr>
                <th scope="col">Detail on each medicine</th>
                <th scope="col">Read right</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Found on the paper</th>
                <td>
                  {s.found} of {s.medicines}
                </td>
              </tr>
              {(Object.keys(FIELD_NAMES) as (keyof typeof FIELD_NAMES)[]).map((f) => (
                <tr key={f}>
                  <th scope="row">{FIELD_NAMES[f]}</th>
                  <td>
                    {s.perField[f]} of {s.found}
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row">Every detail right</th>
                <td>
                  {s.rowsRight} of {s.medicines}
                </td>
              </tr>
              <tr>
                <th scope="row">Medicines made up</th>
                <td>{s.extra}</td>
              </tr>
            </tbody>
          </table>
          <div className="ev-notes">
            <h2 className="display-2">What it got wrong</h2>
            {misses.map(({ id, row, read }) => (
              <p key={id + row.key}>
                <strong>{row.read}</strong> ({id}): {extra[id]?.missNote ?? "one detail differs from our answer."}{" "}
                {read && Object.keys(read.unsure).length
                  ? "It was marked Please check."
                  : "It wasn't marked Please check, which is why every row has to be checked against the paper."}
              </p>
            ))}
            {(spec.prescriptions as SpecRx[])
              .filter((r) => r.truthNote)
              .map((r) => (
                <p key={r.id}>
                  <strong>Our own mistake ({r.id}):</strong> {r.truthNote}
                </p>
              ))}
          </div>
        </section>

        <section className="ev-limits">
          <h2 className="display-2">What this does and doesn&apos;t show</h2>
          <ul className="safety-list">
            <li>
              The prescriptions are fictional and were drawn on a computer with handwriting typefaces, tilted and blurred to look
              like phone photos. Real doctors&apos; handwriting is messier, so treat these numbers as a best case.
            </li>
            <li>
              They cover the shorthand Indian prescriptions use (1-0-1, ½-0-½, OD, BD, TDS, QID, HS, SOS, AC, PC), syrups in ml, eye
              drops, inhaler puffs, sachets, half tablets, weekly doses, a typed discharge summary, instructions in Hindi, an
              elaborate script and a very blurry photo.
            </li>
            <li>It measures reading only. Dose Card never checks doses or interactions, and every card says to confirm with a doctor or pharmacist.</li>
          </ul>
        </section>

        <section className="ev-list" aria-labelledby="ev-list-title">
          <h2 id="ev-list-title" className="display-2">Every test prescription</h2>
          <ul className="ev-grid">
            {data.results.map((r) => {
              const right = r.score.rows.filter((row) => row.found && Object.values(row.fields).every(Boolean)).length;
              return (
                <li key={r.id} className="ev-item">
                  <a href={`/evidence/${r.id}.jpg`} target="_blank" rel="noreferrer">
                    <Image src={`/evidence/${r.id}.jpg`} alt={`Test prescription ${r.id}: ${r.lines.join("; ")}`} width={300} height={400} />
                  </a>
                  <p className="ev-item-title">
                    {r.id}: {extra[r.id]?.hard ?? STYLE_NAMES[r.style] ?? r.style}
                  </p>
                  <p className={right === r.score.rows.length ? "ev-ok" : "ev-miss"}>
                    {right} of {r.score.rows.length} medicines fully right
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="ev-method">
          <h2 className="display-2">How it was run</h2>
          <p>
            Each image went once through the same reader the app uses ({data.models.join(" and ")}, on {date}), and every
            medicine was compared with what a careful pharmacist would read. The prescriptions, answers and raw readings are in
            the repository: <code>evals/prescriptions.json</code>, <code>evals/raw/</code>. Re-run with <code>pnpm render-evals</code>{" "}
            and <code>pnpm eval</code>.
          </p>
          <p>
            <Link href="/#make" className="btn">
              Make a card
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
