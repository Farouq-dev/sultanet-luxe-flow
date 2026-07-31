import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { collections, categories, bestSellers } from "@/lib/data";

/** Desktop mega menu panel — shown on hover/focus of the "Shop" nav item. */
export function MegaMenu({ open }: { open: boolean }) {
  const picks = bestSellers().slice(0, 2);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full hidden lg:block"
        >
          <div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-border bg-popover p-7 shadow-elegant">
            <div className="grid grid-cols-[1fr_1fr_1fr_260px] gap-8">
              {collections.map((c) => (
                <div key={c.key}>
                  <Link
                    to="/shop"
                    search={{ collection: c.key }}
                    className="font-display text-lg hover:text-primary"
                  >
                    {c.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{c.tagline}</p>
                  <ul className="mt-3 space-y-1.5">
                    {categories
                      .filter((cat) => cat.collection === c.key)
                      .slice(0, 5)
                      .map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            to="/shop"
                            search={{ category: cat.slug }}
                            className="text-sm text-muted-foreground transition hover:text-foreground"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Featured
                </p>
                <ul className="mt-3 space-y-3">
                  {picks.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        className="flex items-center gap-3 group"
                      >
                        <img src={p.image} alt="" loading="lazy" className="h-12 w-12 rounded-xl object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium group-hover:text-primary">{p.name}</span>
                          <span className="text-xs text-muted-foreground">Best seller</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/shop"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4 hover:text-primary"
                >
                  Shop everything <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
