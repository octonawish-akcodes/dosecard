import { doseIcons, type DoseShape } from "@/lib/dose";
import type { Time, Unit } from "@/lib/types";

type P = { className?: string };
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function Sunrise({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M8 46h48" {...stroke} />
      <path d="M18 46a14 14 0 0 1 28 0" fill="#F4A261" stroke="currentColor" strokeWidth={2.4} />
      <path d="M32 14v8M14.5 24.5l5 5M49.5 24.5l-5 5M6 36h6M52 36h6" {...stroke} />
      <path d="M22 54h20" {...stroke} />
    </svg>
  );
}

export function Sun({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="12" fill="#F6C343" stroke="currentColor" strokeWidth={2.4} />
      <path d="M32 6v7M32 51v7M6 32h7M51 32h7M13.6 13.6l5 5M45.4 45.4l5 5M50.4 13.6l-5 5M18.6 45.4l-5 5" {...stroke} />
    </svg>
  );
}

export function Sunset({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M8 42h48" {...stroke} />
      <path d="M20 42a12 12 0 0 1 24 0" fill="#E76F51" stroke="currentColor" strokeWidth={2.4} />
      <path d="M14 50h36M22 57h20" {...stroke} />
      <path d="M32 12v10M27 17l5 5 5-5" {...stroke} />
    </svg>
  );
}

export function Moon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M40 10a22 22 0 1 0 14 34A18 18 0 0 1 40 10z" fill="#F1E3A6" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M14 14l1.5 3 3 1.5-3 1.5L14 23l-1.5-3-3-1.5 3-1.5zM50 50l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" />
    </svg>
  );
}

/** A small medicine bottle, for "only when needed". */
export function Bottle({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="22" y="8" width="20" height="8" rx="2" fill="#9FB8C4" stroke="currentColor" strokeWidth={2.4} />
      <path d="M20 16h24v38a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z" fill="#fff" stroke="currentColor" strokeWidth={2.4} />
      <path d="M32 28v14M25 35h14" {...stroke} />
    </svg>
  );
}

export const TIME_ICON: Record<Time, (p: P) => React.JSX.Element> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
  needed: Bottle,
};

/** A fork and spoon, shown on the food tag. */
export function ForkSpoon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M7 3v6a2 2 0 0 0 2 2v10M11 3v6a2 2 0 0 1-2 2M9 3v5" {...stroke} strokeWidth={1.8} />
      <path d="M16 3c-2 0-3 2.5-3 5s1.2 3.5 3 3.5V21M16 11.5c1.8 0 3-1 3-3.5S18 3 16 3" {...stroke} strokeWidth={1.8} />
    </svg>
  );
}

const INK = "#1F2328";

/** One picture per tablet, capsule, drop, puff or sachet (up to 4, then "+N"); a half tablet is half a circle. */
export function DoseIcons({ amount, unit }: { amount: number; unit: Unit }) {
  const { shape, whole, half, more } = doseIcons(amount, unit);
  if (!whole && !half) return null;
  return (
    <span className="dose-icons" aria-hidden>
      {Array.from({ length: whole }, (_, i) => (
        <DoseShapeIcon key={i} shape={shape} />
      ))}
      {half && <HalfTablet />}
      {more > 0 && <span className="dose-more">+{more}</span>}
    </span>
  );
}

export function DoseShapeIcon({ shape }: { shape: DoseShape }) {
  const s = { stroke: INK, strokeWidth: 1.8, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className="dose-icon">
      {shape === "tablet" && (
        <>
          <circle cx="12" cy="12" r="9" fill="#fff" {...s} />
          <path d="M12 4.5v15" {...s} strokeWidth={1.4} />
        </>
      )}
      {shape === "capsule" && (
        <g transform="rotate(-35 12 12)">
          <path d="M12 6.5H8a5.5 5.5 0 0 0 0 11h4z" fill="#E9C46A" {...s} />
          <path d="M12 6.5h4a5.5 5.5 0 0 1 0 11h-4z" fill="#fff" {...s} />
        </g>
      )}
      {shape === "drop" && <path d="M12 3.5C9 8 6.5 11 6.5 14.5a5.5 5.5 0 0 0 11 0C17.5 11 15 8 12 3.5z" fill="#BFE0F0" {...s} />}
      {shape === "cup" && (
        <>
          <path d="M6 5h12l-1.5 14.5a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5z" fill="#fff" {...s} />
          <path d="M7.2 12h9.6l-.8 8H8z" fill="#E8A87C" stroke="none" />
          <path d="M6 5h12l-1.5 14.5a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5z" fill="none" {...s} />
          <path d="M9 9h3M9 12h3M9 15h3" {...s} strokeWidth={1.2} />
        </>
      )}
      {shape === "puff" && (
        <>
          <path d="M9 3h6v9H9z" fill="#9FB8C4" {...s} />
          <path d="M7 11h10v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="#fff" {...s} />
        </>
      )}
      {shape === "sachet" && (
        <path d="M5 6l2-2 2 2 2-2 2 2 2-2 2 2 2-2v16H5z" fill="#fff" {...s} />
      )}
      {shape === "dose" && <circle cx="12" cy="12" r="8" fill="#fff" {...s} />}
    </svg>
  );
}

/** Half a tablet, with the missing half dotted so "half" reads at a glance. */
export function HalfTablet() {
  return (
    <svg viewBox="0 0 24 24" className="dose-icon">
      <path d="M12 3a9 9 0 0 1 0 18" fill="none" stroke={INK} strokeWidth={1.2} strokeDasharray="2 2" />
      <path d="M12 3a9 9 0 0 0 0 18z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </svg>
  );
}
