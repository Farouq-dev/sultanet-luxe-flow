import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, Minus, Plus, ShieldCheck, Star, Truck, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { findProduct, products } from "@/lib/data";
import { useShop } from "@/stores/shop";
import { formatMoney } from "@/lib/currency";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product — Sultanet" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Sultanet` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — Sultanet` },
        { property: "og:description", content: p.description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { currency, addToCart, toggleWishlist, wishlist, addRecent } = useShop();
  const [qty, setQty] = useState(1);
  const inWishlist = wishlist.includes(product.id);
  const related = products.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 4);

  useEffect(() => {
    addRecent(product.id);
  }, [product.id, addRecent]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <nav className="mb-8 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="overflow-hidden rounded-[2rem] border border-border bg-muted">
          <img src={product.image} alt={product.name} width={900} height={900} className="h-full w-full object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">{product.brand}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviews.toLocaleString()} reviews)</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl">{formatMoney(product.price, currency)}</span>
            {product.compareAt && (
              <span className="text-lg text-muted-foreground line-through">{formatMoney(product.compareAt, currency)}</span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <ul className="mt-6 grid gap-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center hover:bg-accent"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center hover:bg-accent"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => { addToCart(product.id, qty); toast.success(`${product.name} added to cart`); }}
              className="flex-1 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:bg-primary/90"
            >
              Add to cart · {formatMoney(product.price * qty, currency)}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist"
              className="grid h-12 w-12 place-items-center rounded-full border border-border transition hover:bg-accent"
            >
              <Heart className={cn("h-5 w-5", inWishlist && "fill-destructive text-destructive")} />
            </button>
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6 text-sm sm:grid-cols-3">
            <Perk icon={Truck} label="Free shipping" body="On orders over $150" />
            <Perk icon={Undo2} label="30-day returns" body="Free & simple" />
            <Perk icon={ShieldCheck} label="1-year warranty" body="Full coverage" />
          </div>
        </motion.div>
      </div>

      <section className="mt-24">
        <Reveal>
          <h2 className="font-display text-3xl">You may also love</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

function Perk({ icon: Icon, label, body }: { icon: React.ComponentType<{ className?: string }>; label: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent"><Icon className="h-4 w-4" /></div>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
