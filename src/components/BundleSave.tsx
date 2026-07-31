import { useMemo, useState } from "react";
import { Plus, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { catalog } from "@/services/catalog";
import { useShop } from "@/stores/shop";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** Frequently bought together / Bundle & Save module for the product page. */
export function BundleSave({ product }: { product: Product }) {
  const { currency, addToCart, openCart } = useShop();
  const suggestions = useMemo(() => catalog.frequentlyBoughtTogether(product, 2), [product]);
  const [picked, setPicked] = useState<string[]>(suggestions.map((s) => s.id));

  if (suggestions.length === 0) return null;

  const chosen = suggestions.filter((s) => picked.includes(s.id));
  const raw = product.price + chosen.reduce((s, p) => s + p.price, 0);
  const bundleDiscount = chosen.length > 0 ? Math.round(raw * 0.1) : 0;
  const total = raw - bundleDiscount;

  const toggle = (id: string) =>
    setPicked((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-6">
      <h2 className="flex items-center gap-2 font-display text-xl sm:text-2xl">
        <Sparkles className="h-4.5 w-4.5 text-primary" /> Frequently bought together
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">Bundle & save 10% when you add the set.</p>

      <ul className="mt-4 space-y-2.5">
        {[product, ...suggestions].map((p, idx) => {
          const isBase = idx === 0;
          const on = isBase || picked.includes(p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                disabled={isBase}
                onClick={() => toggle(p.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition active:scale-[0.99]",
                  on ? "border-primary/50 bg-accent/50" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {on && <Check className="h-3 w-3" />}
                </span>
                <img src={p.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {isBase ? "This item" : "Add to bundle"}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold">{formatMoney(p.price, currency)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Bundle total</p>
          <p className="font-display text-2xl">
            {formatMoney(total, currency)}{" "}
            {bundleDiscount > 0 && (
              <span className="align-middle text-xs font-semibold text-primary">
                save {formatMoney(bundleDiscount, currency)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            addToCart(product.id);
            chosen.forEach((p) => addToCart(p.id));
            openCart();
            toast.success("Bundle added to your cart");
          }}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition active:scale-[0.98] hover:bg-primary/90 sm:flex-none"
        >
          <Plus className="h-4 w-4" /> Add bundle
        </button>
      </div>
    </section>
  );
}
