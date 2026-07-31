import { BadgeCheck, Headphones, Lock, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export const TRUST_ITEMS = [
  { icon: Truck, label: "Free worldwide shipping", body: "On every order, everywhere." },
  { icon: Lock, label: "Secure checkout", body: "256-bit encrypted payments." },
  { icon: ShieldCheck, label: "Money-back guarantee", body: "30 days, no questions." },
  { icon: BadgeCheck, label: "Verified reviews", body: "12,000+ real customers." },
  { icon: RefreshCw, label: "Easy returns", body: "Free return labels." },
  { icon: Headphones, label: "Premium support", body: "Humans, 7 days a week." },
] as const;

/** Compact trust strip — scrolls horizontally on phones, grid on desktop. */
export function TrustStrip({ className }: { className?: string }) {
  return (
    <section className={cn("border-y border-border bg-secondary/40 py-5 sm:py-8", className)}>
      <ul className="flex snap-x gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-6 lg:overflow-visible">
        {TRUST_ITEMS.map(({ icon: Icon, label, body }) => (
          <li
            key={label}
            className="flex w-[64%] shrink-0 snap-start items-start gap-2.5 rounded-2xl border border-border bg-card p-3 sm:w-[40%] lg:w-auto lg:border-0 lg:bg-transparent lg:p-0"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Inline badge row for cart / checkout / PDP. */
export function TrustBadges({ className }: { className?: string }) {
  const items = TRUST_ITEMS.slice(0, 4);
  return (
    <ul className={cn("grid grid-cols-2 gap-2", className)}>
      {items.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 text-[11px] font-medium leading-tight"
        >
          <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="min-w-0">{label}</span>
        </li>
      ))}
    </ul>
  );
}

export function FreeShippingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-accent-foreground",
        className,
      )}
    >
      <Truck className="h-3.5 w-3.5" /> Free worldwide shipping
    </span>
  );
}
