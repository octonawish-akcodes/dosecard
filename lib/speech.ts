import { buildChart, cardName } from "./card";
import { amountText, labels } from "./translations";
import type { LangCode, Medicine, Time } from "./types";

/** The phone voice to ask for, per card language. */
const VOICE: Record<LangCode, string> = {
  en: "en-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN", ta: "ta-IN", gu: "gu-IN", kn: "kn-IN",
  ml: "ml-IN", pa: "pa-IN", ur: "ur-IN", es: "es-ES", fr: "fr-FR", ar: "ar-SA", zh: "zh-CN", pt: "pt-BR",
};
export const voiceLang = (lang: LangCode) => VOICE[lang];

/** Sentence and list punctuation, so the voice pauses in the right places. */
const STOP: Partial<Record<LangCode, string>> = { hi: "।", bn: "।", pa: "।", ur: "۔", zh: "。" };
const COMMA: Partial<Record<LangCode, string>> = { ur: "،", ar: "،", zh: "，" };

/** One spoken paragraph per time of day: "Morning. Metformin 500 mg, 1 tablet, after food." */
export function spokenTimes(medicines: Medicine[], lang: LangCode): { time: Time; text: string }[] {
  const l = labels(lang);
  const stop = STOP[lang] ?? ".";
  const comma = (COMMA[lang] ?? ",") + (lang === "zh" ? "" : " ");
  const { cols, rows } = buildChart(medicines);
  return cols
    .map((time) => ({ time, due: rows.filter((m) => m.times.includes(time)) }))
    .filter(({ due }) => due.length)
    .map(({ time, due }) => {
      const items = due.map((m) => {
        const food = m.food === "any" ? [] : [lowerFirst(l.food[m.food], lang)];
        return [cardName(m.name), amountText(l, m.amount, m.unit), ...food].join(comma) + stop;
      });
      return { time, text: [l.times[time] + stop, ...items].join(" ") };
    });
}

/** "After food" reads mid-sentence as "after food" in languages with capitals. */
function lowerFirst(s: string, lang: LangCode) {
  return ["en", "es", "fr", "pt"].includes(lang) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}
