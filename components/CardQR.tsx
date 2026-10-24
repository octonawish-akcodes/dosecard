"use client";

import QRCode from "qrcode";
import { useMemo, useSyncExternalStore } from "react";
import { listenUrl, type SharedCard } from "@/lib/share";

const noSubscribe = () => () => {};
const origin = () => window.location.origin;

/** The QR code printed on the card: it opens the talking version of this exact card. */
export function CardQR({ card, className }: { card: SharedCard; className?: string }) {
  const here = useSyncExternalStore(noSubscribe, origin, () => "");
  const { url, path, size } = useMemo(() => {
    if (!here) return { url: "", path: "", size: 0 };
    const url = listenUrl(here, card);
    const { modules } = QRCode.create(url, { errorCorrectionLevel: "M" });
    let path = "";
    for (let y = 0; y < modules.size; y++)
      for (let x = 0; x < modules.size; x++) if (modules.data[y * modules.size + x]) path += `M${x} ${y}h1v1h-1z`;
    return { url, path, size: modules.size };
  }, [here, card]);
  if (!path) return <div className={className} aria-hidden />;
  return (
    <a href={url} className={className} aria-label="Open the talking version of this card">
      <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} shapeRendering="crispEdges" role="img" aria-label="QR code">
        <rect x="-2" y="-2" width={size + 4} height={size + 4} fill="#fff" />
        <path d={path} fill="#13261f" />
      </svg>
    </a>
  );
}
