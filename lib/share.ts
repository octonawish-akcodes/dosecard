import { buildChart } from "./card";
import { LABELS } from "./translations";
import { FOODS, TIMES, UNITS, newId, type LangCode, type Medicine } from "./types";

export type SharedCard = { medicines: Medicine[]; lang: LangCode; patient: string };

// Compact form for the QR code: [name, amount, unit index, times as bits, food index, note].
type Row = [string, number, number, number, number, string];
type Packed = { v: 1; l: LangCode; p: string; m: Row[] };

const toB64Url = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64Url = (s: string) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

/** Packs only what the card shows; ids and Please-check marks stay behind. */
export function encodeCard(card: SharedCard): string {
  const rows = buildChart(card.medicines).rows.map((m): Row => [
    m.name.trim(),
    m.amount,
    UNITS.indexOf(m.unit),
    TIMES.reduce((bits, t, i) => (m.times.includes(t) ? bits | (1 << i) : bits), 0),
    FOODS.indexOf(m.food),
    m.note.trim(),
  ]);
  return toB64Url(JSON.stringify({ v: 1, l: card.lang, p: card.patient.trim(), m: rows } satisfies Packed));
}

/** Unpacks a card link; anything broken or unexpected gives null. */
export function decodeCard(code: string): SharedCard | null {
  try {
    const d = JSON.parse(fromB64Url(code)) as Packed;
    if (d.v !== 1 || !Array.isArray(d.m) || !(d.l in LABELS)) return null;
    const medicines = d.m.map(([name, amount, unit, bits, food, note]): Medicine => {
      if (typeof name !== "string" || !UNITS[unit] || !FOODS[food] || !(amount > 0)) throw new Error("bad row");
      return {
        id: newId(),
        name: name.slice(0, 120),
        amount,
        unit: UNITS[unit],
        times: TIMES.filter((_, i) => bits & (1 << i)),
        food: FOODS[food],
        note: typeof note === "string" ? note.slice(0, 120) : "",
        unsure: {},
      };
    });
    return { medicines, lang: d.l, patient: typeof d.p === "string" ? d.p.slice(0, 60) : "" };
  } catch {
    return null;
  }
}

/** The link printed as a QR code. The card sits after "#", which browsers never send to a server. */
export function listenUrl(origin: string, card: SharedCard): string {
  return `${origin}/listen#${encodeCard(card)}`;
}
