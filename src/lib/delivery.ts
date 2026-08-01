/** Delivery estimate copy — deterministic so SSR and hydration agree. */
export function estimateRange(fromDays = 4, toDays = 9, now = new Date()) {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const a = new Date(now);
  a.setDate(a.getDate() + fromDays);
  const b = new Date(now);
  b.setDate(b.getDate() + toDays);
  return `${fmt(a)} – ${fmt(b)}`;
}

/** Static label used across product, cart and checkout. */
export const deliveryEstimate = "4–9 business days";
