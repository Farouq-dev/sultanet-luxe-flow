import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Star, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useShop } from "@/stores/shop";
import { catalog } from "@/services/catalog";
import { formatMoney } from "@/lib/currency";

export function QuickViewModal() {
  const { quickViewSlug, setQuickView, addToCart, openCart, currency } = useShop();
  const product = quickViewSlug ? catalog.getProductBySlug(quickViewSlug) : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setQuickView]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setQuickView(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={`${product.name} quick view`}
            className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-background md:grid-cols-2"
          >
            <button
              onClick={() => setQuickView(null)}
              aria-label="Close quick view"
              className="glass absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-square bg-muted">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col p-7">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</span>
              <h2 className="mt-1 font-display text-3xl leading-tight">{product.name}</h2>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{product.rating}</span>
                <span>({product.reviews.toLocaleString()} reviews)</span>
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-3xl">{formatMoney(product.price, currency)}</span>
                {product.compareAt && (
                  <span className="text-sm text-muted-foreground line-through">{formatMoney(product.compareAt, currency)}</span>
                )}
              </div>
              <div className="mt-auto space-y-2.5 pt-6">
                <button
                  onClick={() => {
                    addToCart(product.id);
                    setQuickView(null);
                    openCart();
                    toast.success(`${product.name} added to cart`);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:bg-primary/90"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to cart
                </button>
                <Link
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  onClick={() => setQuickView(null)}
                  className="flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent"
                >
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
