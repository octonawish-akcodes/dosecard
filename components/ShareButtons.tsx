"use client";

import { useState } from "react";
import { listenUrl, type SharedCard } from "@/lib/share";

/** Send the talking card to family on WhatsApp, or copy its link. The card travels inside the link only. */
export function ShareButtons({ card, disabled }: { card: SharedCard; disabled: boolean }) {
  const [copied, setCopied] = useState(false);
  const link = () => listenUrl(window.location.origin, card);
  const who = card.patient.trim() || "your";
  const message = () =>
    `${who === "your" ? "Your" : `${who}'s`} medicine card. Tap to see and hear when to take each medicine: ${link()}`;

  return (
    <div className="share-row">
      <a
        className={`btn-whatsapp ${disabled ? "is-disabled" : ""}`}
        aria-disabled={disabled}
        href={disabled ? undefined : "#"}
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) window.open(`https://wa.me/?text=${encodeURIComponent(message())}`, "_blank", "noopener");
        }}
      >
        Share on WhatsApp
      </a>
      <button
        type="button"
        className="btn-quiet"
        disabled={disabled}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link());
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
