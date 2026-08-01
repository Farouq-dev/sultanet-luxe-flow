import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, Minus, Plus, ShieldCheck, Star, Truck, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { findProduct, products } from "@/lib/data";
import { useShop } from "@/stores/shop";
import { formatMoney } from "@/lib/currency";
import { ProductRail } from "@/components/ProductRail";
import { BundleSave } from "@/components/BundleSave";
import { Countdown } from "@/components/promo/Countdown";
import { ProductReviews } from "@/components/ProductReviews";
import { deliveryEstimate } from "@/lib/delivery";

import { LiveViewers, LimitedStock } from "@/components/SocialProof";
import { TrustBadges, FreeShippingBadge } from "@/components/trust/TrustBadges";
import { catalog } from "@/services/catalog";
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
  const { currency, addToCart, toggleWishlist, wishlist, addRecent, openCart } = useShop();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const gallery: string[] = product.gallery?.length ? product.gallery : [product.image];

  const inWishlist = wishlist.includes(product.id);
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  const alsoBought = catalog.recommendations([product.id], 8);
  const related = products.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 8);

  useEffect(() => {
    addRecent(product.id);
  }, [product.id, addRecent]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <nav className="mb-5 truncate text-xs text-muted-foreground sm:mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div
            className="group relative aspect-square overflow-hidden rounded-3xl border border-border bg-muted sm:rounded-[2rem]"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <img
              src={gallery[active]}
              alt={product.name}
              width={1200}
              height={1200}
              className="h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform"
              style={
                zoom
                  ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : undefined
              }
            />
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
                −{discount}%
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "h-16 w-16 shrink-0 overflow-hidden rounded-2xl border transition sm:h-20 sm:w-20",
                    i === active ? "border-primary" : "border-border opacity-70",
                  )}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>


        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">{product.brand}</p>
          <h1 className="mt-2 font-display text-[1.75rem] leading-tight sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <a href="#reviews" className="underline-offset-4 hover:underline">
              ({product.reviews.toLocaleString()} reviews)
            </a>
            {product.sold ? (
              <span className="tabular-nums">· {product.sold.toLocaleString()} sold</span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3 sm:mt-6">
            <span className="font-display text-3xl sm:text-4xl">{formatMoney(product.price, currency)}</span>
            {product.compareAt && (
              <span className="text-lg text-muted-foreground line-through">{formatMoney(product.compareAt, currency)}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <FreeShippingBadge />
            {discount > 0 && (
              <span className="inline-flex items-center rounded-full bg-destructive px-3 py-1.5 text-[11px] font-bold text-destructive-foreground">
                Save {discount}%
              </span>
            )}
          </div>
          <LiveViewers productId={product.id} className="mt-3" />
          <LimitedStock stock={product.stock} className="mt-3" />
          <Countdown compact className="mt-4" />
          <p className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-secondary px-3.5 py-2.5 text-xs font-medium">
            <Truck className="h-4 w-4 shrink-0 text-primary" />
            Free worldwide delivery · estimated {deliveryEstimate}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{product.description}</p>


          <ul className="mt-6 grid gap-2">
            {product.features.map((f: string) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center hover:bg-accent"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center hover:bg-accent"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => { addToCart(product.id, qty); toast.success(`${product.name} added to cart`); }}
              className="min-h-12 flex-1 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-elegant transition active:scale-[0.98] hover:bg-primary/90"
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

          <TrustBadges className="mt-5" />

          <div className="mt-4 grid gap-4 rounded-3xl border border-border bg-card p-4 text-sm sm:grid-cols-3 sm:p-6">
            <Perk icon={Truck} label="Free shipping" body="Worldwide, every order" />
            <Perk icon={Undo2} label="30-day returns" body="Free & simple" />
            <Perk icon={ShieldCheck} label="1-year warranty" body="Full coverage" />
          </div>
        </motion.div>
      </div>

      <div className="mt-10 space-y-6 sm:mt-16 sm:space-y-8">
        <BundleSave product={product} />
        <section className="rounded-3xl border border-border bg-card p-4 sm:p-6">
          <h2 className="font-display text-2xl sm:text-3xl">Specifications</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            <Spec k="Brand" v={product.brand} />
            <Spec k="Collection" v={product.collection} />
            <Spec k="Category" v={product.category} />
            <Spec k="Rating" v={`${product.rating} / 5`} />
            <Spec k="Shipping" v="Free worldwide" />
            <Spec k="Delivery" v={deliveryEstimate} />
          </dl>
        </section>
        <ProductReviews product={product} />
      </div>

      <ProductRail eyebrow="Customers also bought" title="Frequently paired" items={alsoBought} />
      <ProductRail eyebrow="More like this" title="You may also love" items={related} />


      {/* Sticky mobile add-to-cart */}
      <div className="glass fixed inset-x-0 bottom-[4.5rem] z-[58] flex items-center gap-3 border-t border-border px-3 py-2.5 lg:hidden">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="truncate font-display text-lg leading-none">{formatMoney(product.price * qty, currency)}</p>
        </div>
        <button
          onClick={() => { addToCart(product.id, qty); openCart(); toast.success(`${product.name} added to cart`); }}
          className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-elegant active:scale-[0.98]"
        >
          Add to cart
        </button>
      </div>
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

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-1.5 text-sm">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="truncate font-medium capitalize">{v}</dd>
    </div>
  );
}
