import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { Search as SearchIcon, TrendingUp, X } from "lucide-react";
import { motion } from "framer-motion";
import { categories, products } from "@/lib/data";
import { catalog } from "@/services/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductRail";
import { useShop } from "@/stores/shop";

const schema = z.object({ q: z.string().optional() });

const POPULAR = ["Massage gun", "Weighted blanket", "Dumbbells", "Yoga mat", "Sleep mask", "Foam roller"];

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Sultanet" },
      { name: "description", content: "Instantly search Sultanet's premium fitness, recovery, and sleep collection." },
      { property: "og:title", content: "Search — Sultanet" },
      { property: "og:description", content: "Search across fitness, recovery, and sleep essentials." },
    ],
  }),
  validateSearch: (s) => schema.parse(s),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { recentlyViewed } = useShop();
  const query = (q ?? "").trim().toLowerCase();

  const results = useMemo(
    () => (query ? catalog.listProducts({ search: query }) : []),
    [query],
  );

  const suggestions = useMemo(() => {
    if (!query) return [];
    const names = results.slice(0, 5).map((p) => p.name);
    const cats = categories.filter((c) => c.name.toLowerCase().includes(query)).map((c) => c.name);
    return [...new Set([...cats, ...names])].slice(0, 6);
  }, [query, results]);

  const trending = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const recommended = catalog.recommendations(recentlyViewed, 8);

  const setQ = (value?: string) =>
    navigate({ to: ".", search: { q: value && value.length ? value : undefined } });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
      <h1 className="font-display text-3xl sm:text-5xl">Search</h1>

      <div className="sticky top-14 z-30 -mx-4 mt-4 bg-background/90 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:mt-8 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-3 shadow-soft sm:px-5 sm:py-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q ?? ""}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search massage guns, mats, blankets…"
            className="w-full min-w-0 bg-transparent text-base focus:outline-none"
            aria-label="Search products"
          />
          {q && (
            <button onClick={() => setQ(undefined)} aria-label="Clear search" className="shrink-0 text-muted-foreground">
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-soft"
          >
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  onClick={() => setQ(s)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-accent"
                >
                  <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" /> {s}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      {!query ? (
        <div className="mt-6 space-y-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULAR.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="rounded-full border border-border px-3.5 py-2 text-xs font-medium transition active:scale-95 hover:bg-accent"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Browse categories</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c.slug}
                  to="/shop"
                  search={{ category: c.slug }}
                  className="rounded-2xl border border-border bg-card px-3.5 py-3 text-xs font-semibold leading-tight transition active:scale-[0.98] hover:bg-accent"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <ProductRail
            eyebrow="Popular right now"
            title="Trending products"
            items={trending}
            action={<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><TrendingUp className="h-3.5 w-3.5" /> Hot</span>}
           
          />
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8">
          <div className="rounded-3xl border border-dashed border-border p-8 text-center">
            <p className="font-display text-xl sm:text-2xl">No results for “{q}”.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a broader term — or explore these instead.</p>
          </div>
          <ProductRail eyebrow="You might like" title="Recommended for you" items={recommended} />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">{results.length} results</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
