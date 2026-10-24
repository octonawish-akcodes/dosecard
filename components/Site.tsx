import Image from "next/image";
import Link from "next/link";
import type { Medicine } from "@/lib/types";
import sample from "@/public/sample/reading.json";
import evidence from "@/public/evidence/results.json";
import { Card } from "./Card";

const REPO = "https://github.com/octonawish-akcodes/dosecard";
const LANG_NAMES = ["हिन्दी", "বাংলা", "मराठी", "తెలుగు", "தமிழ்", "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ", "اردو", "Español", "Français", "العربية", "中文", "Português"];

export const SOURCES = {
  polypharmacy: {
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8173298/",
    label: "Bhagavathula et al., Frontiers in Pharmacology, 2021: pooled review of 27 Indian studies",
  },
  adherence: {
    href: "https://www.who.int/news/item/01-07-2003-failure-to-take-prescribed-medicine-for-chronic-diseases-is-a-massive-world-wide-problem",
    label: "World Health Organization, Adherence to long-term therapies, 2003",
  },
};

/** The chemist's green cross, with a tick in it. */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="mark" aria-hidden>
      <path d="M11 3h10v8h8v10h-8v8H11v-8H3V11h8z" fill="var(--green)" />
      <path d="M10.5 16.5l3.8 3.8 7.4-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header no-print">
      <Link href="/" className="brand">
        <Mark />
        Dose Card
      </Link>
      <nav aria-label="Main" className="site-nav">
        <Link href="/#how">How it works</Link>
        <Link href="/evidence">Evidence</Link>
        <Link href="/#make" className="nav-cta">
          Make a card
        </Link>
      </nav>
    </header>
  );
}

/** The ballpoint arrow from the prescription to the card. */
function PenArrow() {
  return (
    <svg viewBox="0 0 120 60" className="pen-arrow" aria-hidden>
      <path d="M6 40c20-26 58-34 98-14" fill="none" stroke="var(--pen)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M92 14l14 12-17 6" fill="none" stroke="var(--pen)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="hero no-print" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title" className="display-1">
          Turn the prescription into a chart Nani can read on the fridge.
        </h1>
        <p className="hero-sub">
          Photograph the doctor&apos;s note, check what Dose Card read, and print a big picture timetable in English and her
          own language. If she can&apos;t read it, she scans the code on the card and her phone reads it to her. It&apos;s free,
          with no sign-up, and nothing is stored on a server.
        </p>
        <div className="hero-ctas">
          <a href="#make" className="btn">
            Make a card
          </a>
          <a href="#how" className="btn-quiet">
            See how it works
          </a>
        </div>
        <div className="hero-langs">
          <p>Printed in English with</p>
          <ul>
            {LANG_NAMES.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>

      <figure className="hero-art">
        <div className="rx-photo">
          <Image
            src="/sample/prescription.jpg"
            alt="A handwritten-style sample prescription listing seven medicines in shorthand such as 1-0-1, OD, HS and SOS"
            width={600}
            height={800}
            priority
          />
        </div>
        <PenArrow />
        <div className="hero-card" aria-hidden>
          <Card id="hero-card" medicines={sample.medicines as Medicine[]} lang="hi" patient="Kamla Devi" phone="98765 43210" made="" />
        </div>
        <figcaption className="hero-caption">
          The sample prescription and the card Dose Card made from it, in English and Hindi.
        </figcaption>
      </figure>
    </section>
  );
}

export function Why() {
  return (
    <section className="why no-print" aria-labelledby="why-title">
      <h2 id="why-title" className="display-2">
        Why a card on the fridge
      </h2>
      <div className="why-grid">
        <blockquote className="fact">
          <p>About half of older adults in India take five or more medicines at the same time.</p>
          <footer>
            49% across 27 studies.{" "}
            <a href={SOURCES.polypharmacy.href} target="_blank" rel="noreferrer">
              {SOURCES.polypharmacy.label}
            </a>
          </footer>
        </blockquote>
        <blockquote className="fact">
          <p>People with long-term illnesses take their medicines as prescribed only about half the time.</p>
          <footer>
            The WHO&apos;s figure for developed countries; lower elsewhere.{" "}
            <a href={SOURCES.adherence.href} target="_blank" rel="noreferrer">
              {SOURCES.adherence.label}
            </a>
          </footer>
        </blockquote>
      </div>
      <p className="why-note">
        A prescription is written in shorthand for the pharmacist: <span className="hand">1-0-1, BD, HS, SOS, AC, PC</span>.
        The person taking seven tablets a day needs something else: what to take, how much, and when, in their own
        language, big enough to read without glasses.
      </p>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="how no-print" aria-labelledby="how-title">
      <h2 id="how-title" className="display-2">
        How it works
      </h2>
      <ol className="steps">
        <li>
          <h3>Photograph the prescription</h3>
          <p>
            Dose Card reads each medicine: the name, how much, morning or night, before or after food. It understands
            Indian shorthand like 1-0-1, OD, BD, TDS, HS and SOS. You can also type the medicines in.
          </p>
        </li>
        <li>
          <h3>Check every row against the paper</h3>
          <p>
            Anything hard to read is marked <span className="check-tag">Please check</span>. Fix the amount with + and −, tap
            the times, pick before or after food.
          </p>
        </li>
        <li>
          <h3>Print it and stick it up</h3>
          <p>
            Pick your grandparent&apos;s language and print one A4 page: medicines down the side, times across, with a picture
            for every dose. Its QR code opens a talking version: tap Morning or Night and the phone says what to take. Share
            it with family on WhatsApp.
          </p>
        </li>
      </ol>
    </section>
  );
}

export function Proof() {
  const s = evidence.summary;
  return (
    <section className="proof no-print" aria-labelledby="proof-title">
      <div>
        <h2 id="proof-title" className="display-2">
          Tested on {s.prescriptions} prescriptions
        </h2>
        <p className="proof-text">
          Found {s.found} of {s.medicines} medicines and read {s.fieldsRight} of {s.fields} details right: how much, which
          unit, when, and before or after food. It made up none. The test prescriptions are fictional and cleaner than real
          handwriting, so every card still has to be checked against the paper.
        </p>
        <Link href="/evidence" className="link-btn">
          See every test prescription and the one it got wrong
        </Link>
      </div>
      <ul className="proof-thumbs" aria-hidden>
        {["rx-04", "rx-10", "rx-15", "rx-17"].map((id) => (
          <li key={id}>
            <Image src={`/evidence/${id}.jpg`} alt="" width={240} height={320} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Safety() {
  return (
    <section className="safety no-print" aria-labelledby="safety-title">
      <h2 id="safety-title" className="display-2">
        It copies. It never advises.
      </h2>
      <ul className="safety-list">
        <li>Only medicines written on the paper go on the card. Dose Card never adds, removes or suggests a medicine or dose.</li>
        <li>Anything unclear is marked for you to check, and every card says to confirm with your doctor or pharmacist.</li>
        <li>
          The photo is sent once to Google&apos;s Gemini to be read, and isn&apos;t kept. Your list stays in this browser, and the QR
          code and shared links carry the card inside the link itself. There are no accounts.
        </li>
      </ul>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer no-print">
      <p>
        Dose Card was built for Devpost&apos;s Build With AI: Basics hackathon using the Devpost Learn skill pack.{" "}
        <a href={REPO}>Code and planning documents (MIT)</a>.
      </p>
      <p>
        Card translations were machine-drafted; corrections from native speakers are welcome. The sample prescription is
        fictional.
      </p>
      <p>
        Sources:{" "}
        <a href={SOURCES.polypharmacy.href} target="_blank" rel="noreferrer">
          {SOURCES.polypharmacy.label}
        </a>
        ;{" "}
        <a href={SOURCES.adherence.href} target="_blank" rel="noreferrer">
          {SOURCES.adherence.label}
        </a>
        .
      </p>
    </footer>
  );
}
