import type { Metadata } from "next";
import Link from "next/link";
import { Listen } from "@/components/Listen";

export const metadata: Metadata = {
  title: "Dose Card: hear your medicine timetable",
  description: "The talking version of a printed Dose Card. Tap a time of day to hear what to take.",
  robots: { index: false },
};

export default function ListenPage() {
  return (
    <main className="listen-page">
      <Link href="/" className="brand listen-brand">
        Dose Card
      </Link>
      <Listen />
    </main>
  );
}
