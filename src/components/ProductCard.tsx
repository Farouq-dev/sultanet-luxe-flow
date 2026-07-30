import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import { useShop } from "@/stores/shop";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist, addToCart, currency, openCart, setQuickView } = useShop();
  const inWishlist = wishlist.includes(product.id);

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          width={900}
          height={900}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {product.tags.includes("new") && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">New</span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive-foreground">-{discount}%</span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); toast(inWishlist ? "Removed from wishlist" : "Added to wishlist"); }}
            aria-label="Toggle wishlist"
            className="glass grid h-9 w-9 place-items-center rounded-full text-foreground transition hover:scale-110"
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-destructive text-destructive")} />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-2 opacity-0 transition-all duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product.id); openCart(); toast.success(`${product.name} added to cart`); }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-elegant transition hover:bg-primary/90"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to cart
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setQuickView(product.slug); }}
            className="glass grid h-10 w-10 place-items-center rounded-full text-foreground"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>

        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{product.brand}</div>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-1 text-base font-semibold text-foreground hover:text-primary">
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
          <span className="ml-auto text-[11px] font-medium">
            {product.stock > 10 ? "In stock" : product.stock > 0 ? `Only ${product.stock} left` : "Sold out"}
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">{formatMoney(product.price, currency)}</span>
          {product.compareAt && (
            <span className="text-sm text-muted-foreground line-through">{formatMoney(product.compareAt, currency)}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
