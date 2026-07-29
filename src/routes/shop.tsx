import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { categories, products, type Collection } from "@/lib/data";

const searchSchema = z.object({
  collection: z.enum(["fitness", "recovery", "sleep"]).optional(),
  category: z.string().optional(),
  sort: z.enum(["featured", "new", "best", "price-asc", "price-desc"]).optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Sultanet" },
      { name: "description", content: "Browse Sultanet's full collection of premium home fitness, recovery, and sleep essentials." },
      { property: "og:title", content: "Shop — Sultanet" },
      { property: "og:description", content: "Studio-grade wellness essentials, engineered for the way you live now." },
    ],
  }),
  validateSearch: (search) => searchSchema.parse(search),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [priceMax, setPriceMax] = useState<number>(600);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.collection) list = list.filter((p) => p.collection === search.collection);
    if (search.category) list = list.filter((p) => p.category === search.category);
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    list = list.filter((p) => p.price <= priceMax);
    switch (search.sort) {
      case "new": list = list.filter((p) => p.tags.includes("new")).concat(list.filter((p) => !p.tags.includes("new"))); break;
      case "best": list = list.filter((p) => p.tags.includes("best")).concat(list.filter((p) => !p.tags.includes("best"))); break;
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
    }
    return list;
  }, [search, priceMax]);

  const setCollection = (c?: Collection) => navigate({ to: ".", search: { ...search, collection: c, category: undefined } });
  const setCategory = (slug?: string) => navigate({ to: ".", search: { ...search, category: slug } });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Shop</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">The full collection</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Filter by collection, category, and price to find your ritual.</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-8">
          <FilterGroup title="Collection">
            <FilterPill label="All" active={!search.collection} onClick={() => setCollection(undefined)} />
            <FilterPill label="Fitness" active={search.collection === "fitness"} onClick={() => setCollection("fitness")} />
            <FilterPill label="Recovery" active={search.collection === "recovery"} onClick={() => setCollection("recovery")} />
            <FilterPill label="Sleep" active={search.collection === "sleep"} onClick={() => setCollection("sleep")} />
          </FilterGroup>
          <FilterGroup title="Category">
            <FilterPill label="All" active={!search.category} onClick={() => setCategory(undefined)} />
            {categories
              .filter((c) => !search.collection || c.collection === search.collection)
              .map((c) => (
                <FilterPill key={c.slug} label={c.name} active={search.category === c.slug} onClick={() => setCategory(c.slug)} />
              ))}
          </FilterGroup>
          <FilterGroup title={`Max price · $${priceMax}`}>
            <input type="range" min={30} max={700} step={10} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[color:var(--brand)]" />
          </FilterGroup>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{filtered.length} products</span>
            <select
              value={search.sort ?? "featured"}
              onChange={(e) => navigate({ to: ".", search: { ...search, sort: e.target.value as never } })}
              className="rounded-full border border-border bg-transparent px-4 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="new">New arrivals</option>
              <option value="best">Best sellers</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center">
              <p className="font-display text-2xl">Nothing matches yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Adjust your filters to see more.</p>
            </div>
          ) : (
            <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>
              ))}
            </Stagger>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/70 hover:border-foreground/40 hover:text-foreground"}`}>
      {label}
    </button>
  );
}
