import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categories, collections, productsByCategory } from "@/lib/data";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Sultanet" },
      { name: "description", content: "Browse Sultanet by category — fitness, recovery, and sleep." },
      { property: "og:title", content: "Categories — Sultanet" },
      { property: "og:description", content: "Explore fitness, recovery, and sleep collections at Sultanet." },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-28">
      <header className="mb-8 sm:mb-16">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Categories</p>
        <h1 className="mt-3 font-display text-3xl sm:text-6xl">Everything, organized.</h1>
      </header>
      {collections.map((c) => (
        <section key={c.key} className="mb-10 sm:mb-20">
          <Reveal>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">{c.tagline}</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl">{c.title}</h2>
              </div>
              <Link to="/shop" search={{ collection: c.key }} className="text-sm font-semibold underline underline-offset-4 hover:text-primary">Shop collection</Link>
            </div>
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.filter((cat) => cat.collection === c.key).map((cat) => {
              const items = productsByCategory(cat.slug);
              const cover = items[0]?.image;
              return (
                <StaggerItem key={cat.slug}>
                  <Link to="/shop" search={{ category: cat.slug }} className="hover-lift group flex overflow-hidden rounded-3xl border border-border bg-card">
                    <div className="aspect-square w-32 shrink-0 overflow-hidden bg-muted">
                      {cover && <img src={cover} alt={cat.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5">
                      <h3 className="font-display text-lg">{cat.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{cat.description}</p>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        {items.length} products <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      ))}
    </div>
  );
}
