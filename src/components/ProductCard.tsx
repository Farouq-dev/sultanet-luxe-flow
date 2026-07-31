import { Link } from "@tanstack/react-router";
import { Heart, Plus, Eye, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import { useShop } from "@/stores/shop";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * Mobile-first product card.
 * Phones: compact, always-visible quick actions, touch press animation.
 * Desktop: lift + reveal actions on hover.
 */
export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist, addToCart, currency, openCart, setQuickView } = useShop();
  const inWishlist = wishlist.includes(product.id);

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0;

  const soldOut = product.stock <= 0;

  return (
    <motion.article
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl"
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          width={900}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
        />

        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1.5 sm:inset-x-3 sm:top-3">
          <div className="flex flex-col gap-1">
            {discount > 0 && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-destructive-foreground sm:text-[10px]">
                −{discount}%
              </span>
            )}
            {product.tags.includes("new") && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground sm:text-[10px]">
                New
              </span>
            )}
            {product.tags.includes("best") && (
              <span className="glass rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:text-[10px]">
                Best seller
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
              toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
            }}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="glass grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground transition active:scale-90 sm:hover:scale-110"
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-destructive text-destructive")} />
          </button>
        </div>

        {/* Quick actions: always visible on touch, hover-revealed on desktop */}
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 transition-all duration-400 sm:inset-x-3 sm:bottom-3 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <button
            type="button"
            disabled={soldOut}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id);
              openCart();
              toast.success(`${product.name} added to cart`);
            }}
            className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-[11px] font-semibold text-primary-foreground shadow-elegant transition active:scale-95 disabled:opacity-50 sm:min-h-10 sm:text-xs hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> {soldOut ? "Sold out" : "Add"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setQuickView(product.slug);
            }}
            className="glass grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground transition active:scale-90 sm:h-10 sm:w-10"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-1.5 sm:p-4">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-[11px]">
          <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">{product.rating}</span>
          <span className="truncate">({product.reviews.toLocaleString()})</span>
        </div>
        <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px]">
          {product.brand}
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground hover:text-primary sm:text-[15px]"
        >
          {product.name}
        </Link>
        <div className="mt-auto pt-1.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[15px] font-bold sm:text-lg">{formatMoney(product.price, currency)}</span>
            {product.compareAt && (
              <span className="text-[11px] text-muted-foreground line-through sm:text-sm">
                {formatMoney(product.compareAt, currency)}
              </span>
            )}
          </div>
          <p
            className={cn(
              "mt-1 text-[10px] font-semibold sm:text-[11px]",
              soldOut ? "text-muted-foreground" : product.stock <= 10 ? "text-destructive" : "text-primary",
            )}
          >
            {soldOut ? "Sold out" : product.stock <= 10 ? `Only ${product.stock} left` : "In stock"}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
