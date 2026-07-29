import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

const schema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Sultanet" },
      { name: "description", content: "Search Sultanet's premium wellness collection." },
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
  const query = (q ?? "").toLowerCase();
  const results = query
    ? products.filter((p) => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.category.includes(query))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <h1 className="font-display text-5xl">Search</h1>
      <div className="mt-8 flex items-center gap-3 rounded-full border border-border bg-card px-5 py-4 shadow-soft">
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
        <input
          autoFocus
          value={q ?? ""}
          onChange={(e) => navigate({ to: ".", search: { q: e.target.value || undefined } })}
          placeholder="Search massage guns, mats, blankets…"
          className="w-full bg-transparent text-base focus:outline-none"
        />
      </div>

      {!q ? (
        <p className="mt-16 text-center text-muted-foreground">Start typing to explore the collection.</p>
      ) : results.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No results for "{q}".</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
