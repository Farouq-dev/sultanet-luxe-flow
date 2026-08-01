import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { catalog } from "@/services/catalog";
import { formatMoney } from "@/lib/currency";
import { useShop } from "@/stores/shop";

const POPULAR = ["Massage gun", "Weighted blanket", "Dumbbells", "Sleep mask", "Yoga mat", "Diffuser"];

/** Premium search drawer / modal — instant results with live suggestions. */
export function SearchDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const { currency } = useShop();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(
    () => (q.trim().length > 0 ? catalog.listProducts({ search: q.trim(), limit: 6 }) : []),
    [q],
  );
  const trending = useMemo(() => catalog.listProducts({ tag: "best", limit: 4 }), []);
  const categories = useMemo(() => catalog.listCategories().slice(0, 8), []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Search"
            className="fixed inset-x-0 top-0 z-[91] max-h-[92dvh] overflow-y-auto rounded-b-[2rem] border-b border-border bg-background px-4 pb-6 pt-4 sm:px-6"
          >
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="flex min-h-12 flex-1 items-center gap-2.5 rounded-full border border-border bg-card px-4">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search Sultanet…"
                    aria-label="Search products"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                  {q && (
                    <button onClick={() => setQ("")} aria-label="Clear" className="text-muted-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-accent"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {q.trim() ? (
                results.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link
                          to="/product/$slug"
                          params={{ slug: p.slug }}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 active:scale-[0.99]"
                        >
                          <img src={p.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{p.name}</span>
                            <span className="text-[11px] text-muted-foreground">{p.brand}</span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold">{formatMoney(p.price, currency)}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/search"
                        onClick={onClose}
                        className="block rounded-2xl px-3 py-2.5 text-center text-sm font-semibold text-primary"
                      >
                        See all results
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <div className="mt-5">
                    <p className="text-sm font-semibold">No matches for “{q}”.</p>
                    <p className="mt-1 text-xs text-muted-foreground">You might like these instead:</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {trending.map((p) => (
                        <li key={p.id}>
                          <Link
                            to="/product/$slug"
                            params={{ slug: p.slug }}
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5"
                          >
                            <img src={p.image} alt="" loading="lazy" className="h-11 w-11 rounded-xl object-cover" />
                            <span className="min-w-0 truncate text-sm font-medium">{p.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ) : (
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <Clock className="h-3 w-3" /> Popular searches
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {POPULAR.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQ(t)}
                          className="rounded-full border border-border px-3.5 py-2 text-xs font-medium hover:bg-accent"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <TrendingUp className="h-3 w-3" /> Trending products
                    </p>
                    <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {trending.map((p) => (
                        <li key={p.id}>
                          <Link
                            to="/product/$slug"
                            params={{ slug: p.slug }}
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5"
                          >
                            <img src={p.image} alt="" loading="lazy" className="h-11 w-11 rounded-xl object-cover" />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
                            <span className="shrink-0 text-xs font-semibold">{formatMoney(p.price, currency)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Browse categories
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          to="/shop"
                          search={{ category: c.slug }}
                          onClick={onClose}
                          className="rounded-full bg-secondary px-3.5 py-2 text-xs font-medium hover:bg-accent"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
