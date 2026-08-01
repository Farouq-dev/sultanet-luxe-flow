import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CAMPAIGN } from "@/lib/promo";

function parts(diff: number) {
  return [
    { v: Math.floor(diff / 86_400_000), l: "D" },
    { v: Math.floor((diff % 86_400_000) / 3_600_000), l: "H" },
    { v: Math.floor((diff % 3_600_000) / 60_000), l: "M" },
    { v: Math.floor((diff % 60_000) / 1000), l: "S" },
  ];
}

/**
 * Reusable premium campaign countdown.
 *
 * Swap the campaign copy/date in `src/lib/promo.ts` (or pass props) to run a
 * new promotion anywhere — homepage, product page, cart.
 */
export function Countdown({
  title = CAMPAIGN.title,
  emoji = CAMPAIGN.emoji,
  subtitle = CAMPAIGN.subtitle,
  note = CAMPAIGN.note,
  endsAt = CAMPAIGN.endsAt,
  compact = false,
  className,
}: {
  title?: string;
  emoji?: string;
  subtitle?: string;
  note?: string;
  endsAt?: number;
  compact?: boolean;
  className?: string;
}) {
  // Start from the target so the first server render matches hydration.
  const [now, setNow] = useState(endsAt);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, endsAt - now);
  const segments = parts(diff);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card",
        compact ? "p-3.5" : "p-5 sm:p-7",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-3",
          compact ? "" : "sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6",
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "font-semibold uppercase tracking-[0.24em] text-primary",
              compact ? "text-[10px]" : "text-[11px] sm:text-xs",
            )}
          >
            <span aria-hidden>{emoji}</span> {title}
          </p>
          <h3
            className={cn(
              "mt-1.5 font-display leading-tight",
              compact ? "text-lg" : "text-2xl sm:text-4xl",
            )}
          >
            {subtitle}
          </h3>
          {!compact && note && (
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              <span aria-hidden>⏰</span> {note}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2" aria-label="Time remaining">
          {segments.map(({ v, l }) => (
            <div
              key={l}
              className={cn(
                "flex-1 rounded-2xl bg-secondary text-center sm:flex-none",
                compact ? "px-2 py-1.5" : "px-2.5 py-2.5 sm:w-[4.25rem]",
              )}
            >
              <motion.span
                key={v}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "block font-display tabular-nums leading-none",
                  compact ? "text-base" : "text-xl sm:text-2xl",
                )}
              >
                {String(v).padStart(2, "0")}
              </motion.span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
