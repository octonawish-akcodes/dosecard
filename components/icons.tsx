import type { Food, Time } from "@/lib/types";

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

function Plate({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="14" cy="16" r="11" fill="#fff" stroke="currentColor" strokeWidth={2.2} />
      <circle cx="14" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth={1.6} />
    </g>
  );
}

function PillShape({ x, y = 10 }: { x: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="16" height="9" rx="4.5" fill="#fff" stroke="currentColor" strokeWidth={2} />
      <path d="M8 0v9" stroke="currentColor" strokeWidth={2} />
    </g>
  );
}

/** Pill → plate (before), plate → pill (after), pill on plate (with). Nothing for "any time". */
export function FoodMark({ food, className }: { food: Food; className?: string }) {
  if (food === "any") return null;
  if (food === "with")
    return (
      <svg viewBox="0 0 28 32" className={className} aria-hidden>
        <Plate x={0} />
        <PillShape x={6} y={11.5} />
      </svg>
    );
  const arrow = <path d="M22 15.5h10M28 11.5l4 4-4 4" {...stroke} strokeWidth={2} />;
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden>
      {food === "before" ? (
        <>
          <PillShape x={2} y={11} />
          <g transform="translate(-2 0)">{arrow}</g>
          <Plate x={36} />
        </>
      ) : (
        <>
          <Plate x={0} />
          <g transform="translate(6 0)">{arrow}</g>
          <PillShape x={44} y={11} />
        </>
      )}
    </svg>
  );
}

/** One mark per tablet or capsule (up to 4), a half mark for ½. */
export function PillMarks({ amount, className }: { amount: number; className?: string }) {
  const whole = Math.min(Math.floor(amount), 4);
  const half = amount % 1 >= 0.5 && whole < 4;
  if (whole === 0 && !half) return null;
  return (
    <span className={className} aria-hidden>
      {Array.from({ length: whole }, (_, i) => (
        <svg key={i} viewBox="0 0 20 12" className="pill-mark">
          <rect x="1" y="1" width="18" height="10" rx="5" fill="#fff" stroke="currentColor" strokeWidth={1.8} />
          <path d="M10 1v10" stroke="currentColor" strokeWidth={1.8} />
        </svg>
      ))}
      {half && (
        <svg viewBox="0 0 20 12" className="pill-mark">
          <path d="M10 1H6a5 5 0 0 0 0 10h4z" fill="#fff" stroke="currentColor" strokeWidth={1.8} />
        </svg>
      )}
    </span>
  );
}
