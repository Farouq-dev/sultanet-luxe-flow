import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Flame, ShoppingBag } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { catalog } from "@/services/catalog";
import { cn } from "@/lib/utils";

const CITIES = ["Lagos", "London", "Dubai", "Toronto", "Berlin", "Sydney", "Nairobi", "Austin", "Paris", "Singapore"];

function seeded(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return h;
}

/** "X people are viewing this" — client-only so SSR markup stays stable. */
export function LiveViewers({ productId, className }: { productId: string; className?: string }) {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const base = 11 + (seeded(productId) % 24);
    setN(base);
    const id = setInterval(() => {
      setN((v) => Math.max(6, (v ?? base) + (Math.random() > 0.5 ? 1 : -1)));
    }, 5200);
    return () => clearInterval(id);
  }, [productId]);

  if (n === null) return null;

  return (
    <p className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground", className)}>
      <Eye className="h-3.5 w-3.5 text-primary" />
      <span className="text-foreground">{n} people</span> are viewing this right now
    </p>
  );
}

export function LimitedStock({ stock, className }: { stock: number; className?: string }) {
  if (stock > 12) return null;
  const pct = Math.max(8, Math.min(100, (stock / 20) * 100));
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-3", className)}>
      <p className="flex items-center gap-1.5 text-xs font-semibold">
        <Flame className="h-3.5 w-3.5 text-destructive" />
        {stock > 0 ? `Only ${stock} left in stock` : "Currently sold out"}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-destructive" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Rotating "recently purchased" social proof, bottom-left, mobile-safe. */
export function RecentPurchaseFeed() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [i, setI] = useState(0);
  const products = catalog.listProducts({ limit: 8 });

  useEffect(() => {
    if (reduced || products.length === 0) return;
    let timeout: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setVisible(true);
      timeout = setTimeout(() => {
        setVisible(false);
        setI((v) => v + 1);
        timeout = setTimeout(cycle, 14000);
      }, 5200);
    };
    timeout = setTimeout(cycle, 6000);
    return () => clearTimeout(timeout);
  }, [reduced, products.length]);

  if (products.length === 0) return null;
  const p = products[i % products.length];
  const city = CITIES[(i + seeded(p.id)) % CITIES.length];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="glass pointer-events-none fixed bottom-[5.5rem] left-3 z-[55] flex max-w-[16rem] items-center gap-2.5 rounded-2xl p-2.5 shadow-soft sm:max-w-xs lg:bottom-5 lg:left-5"
        >
          <img src={p.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <ShoppingBag className="h-3 w-3" /> Just purchased
            </p>
            <p className="truncate text-xs font-medium">{p.name}</p>
            <p className="text-[10px] text-muted-foreground">Someone in {city} · a few minutes ago</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
