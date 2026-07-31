import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Gift, Truck, CalendarClock, Tag, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useShop } from "@/stores/shop";
import { formatMoney } from "@/lib/currency";
import { FreeGiftProgress } from "@/components/FreeGiftProgress";
import { TrustBadges, FreeShippingBadge } from "@/components/trust/TrustBadges";
import { ProductRail } from "@/components/ProductRail";
import { catalog } from "@/services/catalog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Sultanet" },
      { name: "description", content: "Review your Sultanet cart, unlock your free gift, and check out securely." },
      { property: "og:title", content: "Cart — Sultanet" },
      { property: "og:description", content: "Review items in your Sultanet cart." },
    ],
  }),
  component: Cart,
});

function deliveryWindow() {
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const a = new Date();
  a.setDate(a.getDate() + 3);
  const b = new Date();
  b.setDate(b.getDate() + 7);
  return `${fmt(a)} – ${fmt(b)}`;
}

function Cart() {
  const { items, subtotal, shipping, total, savings, currency, progress, updateQty, removeFromCart } = useCart();
  const { cart } = useShop();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [giftNote, setGiftNote] = useState(false);
  const recommended = catalog.recommendations(cart.map((c) => c.productId), 8);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent"><ShoppingBag className="h-7 w-7" /></div>
        <h1 className="mt-5 font-display text-3xl sm:text-4xl">Your cart is quiet.</h1>
        <p className="mt-2.5 text-sm text-muted-foreground">Discover something to add to your ritual.</p>
        <Link to="/shop" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground active:scale-95 hover:bg-primary/90">Explore the shop</Link>
        <div className="mt-8"><TrustBadges /></div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pb-32 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:pb-24">
        <h1 className="font-display text-3xl sm:text-5xl">Your cart</h1>
        <div className="mt-5 grid gap-6 sm:mt-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          <div>
            <FreeGiftProgress {...progress} subtotal={subtotal} className="mb-4 sm:mb-6" />
            <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              <AnimatePresence initial={false}>
                {items.map(({ product, qty, gift }) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 p-3 sm:gap-5 sm:p-5"
                  >
                    <Link to="/product/$slug" params={{ slug: product.slug }} className="aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-muted sm:w-28">
                      <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</p>
                          <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary sm:text-base">{product.name}</Link>
                          {gift && (
                            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                              <Gift className="h-3 w-3" /> Free gift
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 whitespace-nowrap text-sm font-semibold sm:text-base">
                          {gift ? "Free" : formatMoney(product.price * qty, currency)}
                        </span>
                      </div>
                      {!gift && (
                        <div className="mt-auto flex items-center justify-between pt-2.5">
                          <div className="flex items-center rounded-full border border-border">
                            <button onClick={() => updateQty(product.id, qty - 1)} aria-label="Decrease" className="grid h-10 w-10 place-items-center rounded-l-full active:scale-90 hover:bg-accent"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-8 text-center text-sm font-medium">{qty}</span>
                            <button onClick={() => updateQty(product.id, qty + 1)} aria-label="Increase" className="grid h-10 w-10 place-items-center rounded-r-full active:scale-90 hover:bg-accent"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <button onClick={() => removeFromCart(product.id)} className="inline-flex min-h-10 items-center gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="flex items-center gap-2 text-xs font-semibold"><Tag className="h-3.5 w-3.5 text-primary" /> Promo code</p>
                <div className="mt-2.5 flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="SULTAN10"
                    aria-label="Promo code"
                    className="min-h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    onClick={() => {
                      if (!promo.trim()) return;
                      setPromoApplied(true);
                      toast.success("Promo code saved — applied at checkout.");
                    }}
                    className="min-h-11 shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground active:scale-95"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary"><Check className="h-3 w-3" /> Code saved for checkout</p>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-card p-4">
                <label className="flex items-center gap-2.5 text-xs font-semibold">
                  <input type="checkbox" checked={giftNote} onChange={(e) => setGiftNote(e.target.checked)} className="h-4 w-4 accent-[color:var(--brand)]" />
                  <Gift className="h-3.5 w-3.5 text-primary" /> Add a gift message
                </label>
                <AnimatePresence>
                  {giftNote && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      rows={3}
                      placeholder="Write a short note — we'll print it on a card."
                      aria-label="Gift message"
                      className="mt-2.5 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  )}
                </AnimatePresence>
                {!giftNote && (
                  <p className="mt-2 text-[11px] text-muted-foreground">Complimentary, handwritten-style card included.</p>
                )}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card p-4 sm:p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-xl sm:text-2xl">Summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm sm:mt-6 sm:space-y-3">
              <Row label="Subtotal" value={formatMoney(subtotal, currency)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatMoney(shipping, currency)} />
              {savings > 0 && <Row label="You save" value={`−${formatMoney(savings, currency)}`} />}
              <div className="mt-3 border-t border-border pt-3 sm:mt-4 sm:pt-4">
                <Row label="Total" value={formatMoney(total, currency)} strong />
              </div>
            </dl>

            <div className="mt-4 space-y-2 rounded-2xl bg-accent/60 p-3.5 text-[11px] font-medium text-accent-foreground">
              <p className="flex items-center gap-2"><Truck className="h-3.5 w-3.5" /> Free worldwide shipping included</p>
              <p className="flex items-center gap-2"><CalendarClock className="h-3.5 w-3.5" /> Estimated delivery {deliveryWindow()}</p>
            </div>

            <Link to="/checkout" className="mt-5 hidden min-h-14 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 lg:flex">Checkout</Link>
            <Link to="/shop" className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-border text-sm font-medium hover:bg-accent">Continue shopping</Link>
            <TrustBadges className="mt-5" />
          </aside>
        </div>

        <ProductRail eyebrow="Customers also bought" title="You might also need" items={recommended} />
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="glass fixed inset-x-0 bottom-[4.5rem] z-[58] border-t border-border px-3 py-2.5 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
            <p className="truncate font-display text-lg leading-none">{formatMoney(total, currency)}</p>
          </div>
          <Link
            to="/checkout"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-elegant active:scale-[0.98]"
          >
            Secure checkout
          </Link>
        </div>
        <div className="mt-1.5 flex justify-center"><FreeShippingBadge className="!bg-transparent !px-0 !text-[10px]" /></div>
      </div>
    </>
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
