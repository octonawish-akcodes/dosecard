"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { decodeCard } from "@/lib/share";
import { spokenTimes, voiceLang } from "@/lib/speech";
import { ENGLISH, LABELS, amountText, labels } from "@/lib/translations";
import { cardName } from "@/lib/card";
import type { LangCode, Time } from "@/lib/types";
import { Card } from "./Card";
import { DoseIcons, TIME_ICON } from "./icons";

const onHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readHash = () => window.location.hash.slice(1);

/** Which time of day it is now, so that button stands out. */
function nowTime(): Time {
  const h = new Date().getHours();
  return h >= 5 && h < 11 ? "morning" : h < 16 && h >= 11 ? "afternoon" : h < 19 && h >= 16 ? "evening" : "night";
}

/** Picks the phone's voice for the card language, or null if it has none. */
function useVoice(lang: LangCode) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);
  const want = voiceLang(lang);
  const base = want.split("-")[0];
  const voice =
    voices.find((v) => v.lang.replace("_", "-") === want) ?? voices.find((v) => v.lang.toLowerCase().startsWith(base)) ?? null;
  const english = voices.find((v) => v.lang.startsWith("en-IN")) ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
  return { voice, english, ready: voices.length > 0, supported: typeof window !== "undefined" && "speechSynthesis" in window };
}

export function Listen() {
  const hash = useSyncExternalStore(onHash, readHash, () => "");
  const card = useMemo(() => (hash ? decodeCard(hash) : null), [hash]);
  const lang = card?.lang ?? "en";
  const l = labels(lang);
  const { voice, english, ready, supported } = useVoice(lang);
  const [speaking, setSpeaking] = useState<Time | "all" | null>(null);
  const now = useSyncExternalStore(onHash, nowTime, () => "morning" as Time);

  const local = useMemo(() => (card ? spokenTimes(card.medicines, lang) : []), [card, lang]);
  const inEnglish = useMemo(() => (card ? spokenTimes(card.medicines, "en") : []), [card]);
  const fallback = lang !== "en" && ready && !voice;

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!hash) return null;
  if (!card)
    return (
      <div className="listen-empty">
        <h1 className="display-2">This link doesn&apos;t have a card in it</h1>
        <p>Scan the QR code on the printed card again, or ask your family to share the card once more.</p>
      </div>
    );

  function say(which: Time | "all") {
    const synth = window.speechSynthesis;
    synth.cancel();
    const pick = fallback ? inEnglish : local;
    const parts = which === "all" ? pick : pick.filter((p) => p.time === which);
    parts.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p.text);
      u.lang = fallback ? "en-IN" : voiceLang(lang);
      const v = fallback ? english : voice;
      if (v) u.voice = v;
      u.rate = 0.85;
      if (i === parts.length - 1) u.onend = () => setSpeaking(null);
      synth.speak(u);
    });
    setSpeaking(which);
  }

  return (
    <div className="listen" lang={lang} dir="ltr">
      <header className="listen-head">
        <p className="listen-title">
          {card.patient && <span className="listen-patient">{card.patient}</span>}
          <span dir={l.dir}>{l.title}</span>
          {lang !== "en" && <span className="listen-en">{ENGLISH.title}</span>}
        </p>
        <p className="listen-hint" dir={l.dir}>
          {l.tapTime}
        </p>
      </header>

      {!supported && <p className="listen-warn">This phone or browser can&apos;t read aloud. The card is below.</p>}
      {fallback && (
        <p className="listen-warn">
          This phone has no {LABELS[lang].name} voice, so it reads in English. The card below is in both languages.
        </p>
      )}

      <ul className="listen-times">
        {local.map(({ time }) => {
          const Icon = TIME_ICON[time];
          const due = card.medicines.filter((m) => m.times.includes(time));
          return (
            <li key={time}>
              <button
                type="button"
                className={`listen-btn band-${time} ${time === now ? "listen-now" : ""} ${speaking === time ? "listen-on" : ""}`}
                onClick={() => (speaking === time ? (window.speechSynthesis.cancel(), setSpeaking(null)) : say(time))}
                disabled={!supported}
              >
                <Icon className="listen-icon" />
                <span className="listen-time">
                  <span dir={l.dir}>{l.times[time]}</span>
                  {lang !== "en" && <span className="listen-en">{ENGLISH.times[time]}</span>}
                </span>
                <span className="listen-play" aria-hidden>
                  {speaking === time ? "■" : "▶"}
                </span>
              </button>
              <ul className="listen-meds">
                {due.map((m) => (
                  <li key={m.id}>
                    <span className="listen-med">{cardName(m.name)}</span>
                    <span className="listen-dose">
                      <DoseIcons amount={m.amount} unit={m.unit} />
                      <span dir={l.dir}>{amountText(l, m.amount, m.unit)}</span>
                      {m.food !== "any" && (
                        <span className={`food-tag food-${m.food}`} dir={l.dir}>
                          {l.food[m.food]}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <button type="button" className="btn listen-all" disabled={!supported} onClick={() => say("all")}>
        ▶ <span dir={l.dir}>{l.playAll}</span>
        {lang !== "en" && <span className="listen-en-inline">{ENGLISH.playAll}</span>}
      </button>

      <details className="listen-card">
        <summary>See the whole card</summary>
        <Card id="listen-card" medicines={card.medicines} lang={lang} patient={card.patient} phone="" made="" />
      </details>

      <p className="listen-privacy">
        This card lives in the link itself. Nothing about it was sent to a server, and the voice comes from this phone.
      </p>
    </div>
  );
}
