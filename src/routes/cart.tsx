import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Gift } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/currency";
import { FreeGiftProgress } from "@/components/FreeGiftProgress";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Sultanet" },
      { name: "description", content: "Review your Sultanet cart and proceed to a smooth checkout." },
      { property: "og:title", content: "Cart — Sultanet" },
      { property: "og:description", content: "Review items in your Sultanet cart." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, subtotal, shipping, total, savings, currency, progress, updateQty, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-lg place-items-center px-6 py-32 text-center">
        <div>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent"><ShoppingBag className="h-8 w-8" /></div>
          <h1 className="mt-6 font-display text-4xl">Your cart is quiet.</h1>
          <p className="mt-3 text-muted-foreground">Discover something to add to your ritual.</p>
          <Link to="/shop" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Explore the shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <h1 className="font-display text-5xl">Your cart</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <FreeGiftProgress {...progress} subtotal={subtotal} className="mb-6" />
          <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
            <AnimatePresence initial={false}>
              {items.map(({ product, qty, gift }) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-5 p-5"
                >
                  <Link to="/product/$slug" params={{ slug: product.slug }} className="aspect-square w-28 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</p>
                        <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 font-semibold hover:text-primary">{product.name}</Link>
                        {gift && (
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                            <Gift className="h-3 w-3" /> Free gift
                          </span>
                        )}
                      </div>
                      <span className="whitespace-nowrap font-semibold">
                        {gift ? "Free" : formatMoney(product.price * qty, currency)}
                      </span>
                    </div>
                    {!gift && (
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-border">
                          <button onClick={() => updateQty(product.id, qty - 1)} aria-label="Decrease" className="grid h-9 w-9 place-items-center hover:bg-accent"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-8 text-center text-sm">{qty}</span>
                          <button onClick={() => updateQty(product.id, qty + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center hover:bg-accent"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <button onClick={() => removeFromCart(product.id)} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl">Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Subtotal" value={formatMoney(subtotal, currency)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatMoney(shipping, currency)} />
            {savings > 0 && <Row label="You save" value={`−${formatMoney(savings, currency)}`} />}
            <div className="mt-4 border-t border-border pt-4">
              <Row label="Total" value={formatMoney(total, currency)} strong />
            </div>
          </dl>
          <Link to="/checkout" className="mt-8 flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Checkout</Link>
          <Link to="/shop" className="mt-3 flex w-full items-center justify-center rounded-full border border-border px-6 py-4 text-sm font-medium hover:bg-accent">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between ${strong ? "text-base font-semibold" : "text-muted-foreground"}`}>
      <dt>{label}</dt>
      <dd className={strong ? "font-display text-xl text-foreground" : "text-foreground"}>{value}</dd>
    </div>
  );
}
