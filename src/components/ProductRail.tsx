import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

/**
 * Horizontal, snap-scrolling product rail — the mobile-first pattern for every
 * merchandising module (deals, trending, recommended, recently viewed).
 * Becomes a grid from `lg` up.
 */
export function ProductRail({
  title,
  eyebrow,
  items,
  action,
  grid = false,
  className,
}: {
  title: string;
  eyebrow?: string;
  items: Product[];
  action?: ReactNode;
  /** Render as a grid on desktop instead of a rail. */
  grid?: boolean;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className={cn("py-8 sm:py-12", className)}>
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-3 px-4 sm:px-6">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-4xl">{title}</h2>
        </div>
        {action ?? (
          <Link
            to="/shop"
            className="shrink-0 text-xs font-semibold underline underline-offset-4 hover:text-primary sm:text-sm"
          >
            View all
          </Link>
        )}
      </div>

      <div
        className={cn(
          "mt-4 sm:mt-6",
          grid
            ? "mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-5 sm:px-6 lg:grid-cols-4"
            : "flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-5 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-4 lg:overflow-visible",
        )}
      >
        {items.map((p) => (
          <div
            key={p.id}
            className={cn(
              grid ? "" : "w-[46%] shrink-0 snap-start sm:w-[38%] md:w-[30%] lg:w-auto",
            )}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
