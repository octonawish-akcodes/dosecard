import type { Metadata } from "next";
import {
  Atkinson_Hyperlegible,
  Fraunces,
  Noto_Naskh_Arabic,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
  Noto_Sans_Gurmukhi,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_SC,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
} from "next/font/google";
import "./globals.css";
import "./card.css";

const body = Atkinson_Hyperlegible({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--font-body" });
const display = Fraunces({ subsets: ["latin"], weight: ["600"], variable: "--font-display" });

// One Noto font per script on the card. Not preloaded: only the chosen language's glyphs are fetched.
// next/font needs each call assigned to its own module-level const, with literal options.
const deva = Noto_Sans_Devanagari({ weight: "variable", preload: false, display: "swap", variable: "--font-deva" });
const beng = Noto_Sans_Bengali({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-beng" });
const telu = Noto_Sans_Telugu({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-telu" });
const taml = Noto_Sans_Tamil({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-taml" });
const gujr = Noto_Sans_Gujarati({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-gujr" });
const knda = Noto_Sans_Kannada({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-knda" });
const mlym = Noto_Sans_Malayalam({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-mlym" });
const guru = Noto_Sans_Gurmukhi({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-guru" });
const arab = Noto_Naskh_Arabic({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-arab" });
const hans = Noto_Sans_SC({ weight: ["400", "700"], preload: false, display: "swap", variable: "--font-hans" });
const scripts = [deva, beng, telu, taml, gujr, knda, mlym, guru, arab, hans];

export const metadata: Metadata = {
  title: "Dose Card: a fridge medicine timetable for grandparents",
  description:
    "Turn a prescription into a big, picture-based medicine timetable in English and your grandparent's language. Print it and stick it on the fridge.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={[body.variable, display.variable, ...scripts.map((f) => f.variable)].join(" ")}>
      <body>{children}</body>
    </html>
  );
}
