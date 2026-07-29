import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/stores/shop";
import { findProduct } from "@/lib/data";
import { formatMoney } from "@/lib/currency";

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
  const { cart, updateQty, removeFromCart, currency } = useShop();
  const items = cart.map((c) => ({ ...c, product: findProduct(cart.find(x => x.productId === c.productId)!.productId)! })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

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
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="font-display text-5xl">Your cart</h1>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {items.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-5 p-5">
              <Link to="/product/$slug" params={{ slug: product.slug }} className="aspect-square w-28 shrink-0 overflow-hidden rounded-2xl bg-muted">
                <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</p>
                    <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 font-semibold hover:text-primary">{product.name}</Link>
                  </div>
                  <span className="whitespace-nowrap font-semibold">{formatMoney(product.price * qty, currency)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => updateQty(product.id, qty - 1)} aria-label="Decrease" className="grid h-9 w-9 place-items-center hover:bg-accent"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center hover:bg-accent"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Subtotal" value={formatMoney(subtotal, currency)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatMoney(shipping, currency)} />
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
