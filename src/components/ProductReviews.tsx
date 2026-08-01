import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Star, ThumbsUp } from "lucide-react";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  name: string;
  country: string;
  flag: string;
  rating: number;
  title: string;
  body: string;
  photos: string[];
  helpful: number;
  date: string;
};

const NAMES = [
  ["Amara O.", "Nigeria", "🇳🇬"],
  ["James W.", "United Kingdom", "🇬🇧"],
  ["Sofia M.", "Spain", "🇪🇸"],
  ["Daniel K.", "United States", "🇺🇸"],
  ["Yuki T.", "Japan", "🇯🇵"],
  ["Lena B.", "Germany", "🇩🇪"],
] as const;

const TITLES = [
  "Worth every penny",
  "Premium build quality",
  "Better than expected",
  "My recovery routine changed",
  "Beautiful and quiet",
  "Exactly as described",
];

const BODIES = [
  "The finish feels genuinely high-end and it arrived faster than the estimate. I use it every single day.",
  "I compared three brands before this one. The materials and packaging are on another level.",
  "Quiet, well balanced and easy to store. Perfect for a small apartment setup.",
  "Great value in the sale. Free shipping arrived within a week and the box was immaculate.",
  "Second purchase from Sultanet — the consistency in quality is why I keep coming back.",
];

/** Deterministic review set derived from the product so SSR matches hydration. */
function buildReviews(product: Product): Review[] {
  const gallery = product.gallery ?? [product.image];
  return Array.from({ length: 6 }).map((_, i) => {
    const [name, country, flag] = NAMES[i % NAMES.length];
    const rating = i % 7 === 0 ? 4 : 5;
    return {
      id: `${product.id}-r${i}`,
      name,
      country,
      flag,
      rating,
      title: TITLES[(i + product.name.length) % TITLES.length],
      body: BODIES[(i + product.brand.length) % BODIES.length],
      photos: i % 2 === 0 ? [gallery[(i + 1) % gallery.length]] : [],
      helpful: 4 + ((i * 7 + product.name.length) % 40),
      date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} 2026`,
    };
  });
}

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn("h-3.5 w-3.5", n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted")}
        />
      ))}
    </span>
  );
}

/** Premium reviews module: breakdown, photo reviews, filters, helpful votes. */
export function ProductReviews({ product }: { product: Product }) {
  const reviews = useMemo(() => buildReviews(product), [product]);
  const [filter, setFilter] = useState<"all" | "photos" | 5 | 4>("all");
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});

  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const share =
      stars === 5 ? 0.78 : stars === 4 ? 0.15 : stars === 3 ? 0.05 : stars === 2 ? 0.01 : 0.01;
    return { stars, share, count: Math.max(0, Math.round(product.reviews * share)) };
  });

  const shown = reviews.filter((r) =>
    filter === "all" ? true : filter === "photos" ? r.photos.length > 0 : r.rating === filter,
  );

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: "All reviews" },
    { key: "photos", label: "With photos" },
    { key: 5, label: "5 stars" },
    { key: 4, label: "4 stars" },
  ];

  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-6" id="reviews">
      <h2 className="font-display text-2xl sm:text-3xl">Customer reviews</h2>

      <div className="mt-4 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
        <div className="text-center sm:text-left">
          <p className="font-display text-5xl leading-none">{product.rating}</p>
          <Stars value={product.rating} className="mt-2 justify-center sm:justify-start" />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {product.reviews.toLocaleString()} verified reviews
          </p>
        </div>

        <ul className="space-y-1.5">
          {breakdown.map(({ stars, share, count }) => (
            <li key={stars} className="flex items-center gap-2.5 text-[11px]">
              <span className="w-8 shrink-0 tabular-nums text-muted-foreground">{stars}★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: `${share * 100}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block h-full rounded-full gradient-brand"
                />
              </span>
              <span className="w-10 shrink-0 text-right tabular-nums text-muted-foreground">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={String(f.key)}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition",
              filter === f.key ? "border-primary bg-primary text-primary-foreground" : "border-border",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {shown.map((r) => (
          <li key={r.id} className="rounded-2xl border border-border p-3.5 sm:p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="truncate">{r.name}</span>
                  <span aria-hidden>{r.flag}</span>
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                </p>
              </div>
              <div className="shrink-0 text-right">
                <Stars value={r.rating} className="justify-end" />
                <p className="mt-1 text-[10px] text-muted-foreground">{r.date}</p>
              </div>
            </div>

            <p className="mt-2.5 text-sm font-semibold">{r.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.body}</p>

            {r.photos.length > 0 && (
              <div className="mt-3 flex gap-2">
                {r.photos.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20"
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setHelpful((h) => ({ ...h, [r.id]: !h[r.id] }))}
              className={cn(
                "mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[11px] font-medium transition active:scale-95",
                helpful[r.id] ? "border-primary text-primary" : "border-border text-muted-foreground",
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({r.helpful + (helpful[r.id] ? 1 : 0)})
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
