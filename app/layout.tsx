import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import "./globals.css";
import "./card.css";

const body = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body" });
const display = Fraunces({ subsets: ["latin"], weight: ["600"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Dose Card: a fridge medicine timetable for grandparents",
  description:
    "Turn a prescription into a big, picture-based medicine timetable in English and your grandparent's language. Print it and stick it on the fridge.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
