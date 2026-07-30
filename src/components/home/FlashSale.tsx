import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { catalog } from "@/services/catalog";
import { formatMoney } from "@/lib/currency";
import { useShop } from "@/stores/shop";
import { Reveal } from "@/components/Reveal";

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export function FlashSale() {
  const { currency, setQuickView } = useShop();
  // Rolling 24h window — deterministic per day so SSR and client agree.
  const target = useMemo(() => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime();
  }, []);
  const { hours, minutes, seconds } = useCountdown(target);
  const items = catalog.listProducts({ tag: "flash", limit: 4 });
  const deals = items.length ? items : catalog.listProducts({ limit: 4 });

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-7 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-destructive text-destructive-foreground pulse-glow">
                <Flame className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">Limited time</p>
                <h2 className="truncate font-display text-2xl">Flash sale</h2>
              </div>
            </div>
            <div className="flex items-center gap-2" aria-label="Time remaining">
              {[
                { v: hours, l: "hrs" },
                { v: minutes, l: "min" },
                { v: seconds, l: "sec" },
              ].map(({ v, l }) => (
                <div key={l} className="w-16 rounded-2xl bg-secondary px-2 py-2 text-center">
                  <motion.span key={v} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="block font-display text-xl tabular-nums">
                    {String(v).padStart(2, "0")}
                  </motion.span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((p) => {
              const discount = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
              const sold = Math.min(95, Math.round((1 - p.stock / 60) * 100));
              return (
                <div key={p.id} className="flex flex-col bg-card p-5">
                  <button
                    onClick={() => setQuickView(p.slug)}
                    className="group aspect-square overflow-hidden rounded-2xl bg-muted"
                    aria-label={`Quick view ${p.name}`}
                  >
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </button>
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="mt-4 line-clamp-1 text-sm font-semibold hover:text-primary">{p.name}</Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-semibold">{formatMoney(p.price, currency)}</span>
                    {discount > 0 && <span className="text-xs text-destructive">−{discount}%</span>}
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${sold}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-full bg-destructive" />
                  </div>
                  <span className="mt-2 text-[11px] text-muted-foreground">{sold}% claimed · {p.stock} left</span>
                </div>
              );
            })}
          </div>

          <div className="px-7 py-5">
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:text-primary">
              Shop all deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
