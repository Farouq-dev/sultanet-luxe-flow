import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X, Gift } from "lucide-react";
import { useEffect } from "react";
import { useShop } from "@/stores/shop";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/currency";
import { FreeGiftProgress } from "@/components/FreeGiftProgress";

export function CartDrawer() {
  const { cartOpen, closeCart } = useShop();
  const { items, subtotal, shipping, total, currency, progress, updateQty, removeFromCart } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            role="dialog"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col border-l border-border bg-background"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-2xl">Your cart</h2>
              <button onClick={closeCart} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent">
                <X className="h-4.5 w-4.5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="grid flex-1 place-items-center px-8 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent"><ShoppingBag className="h-6 w-6" /></div>
                  <p className="mt-5 font-display text-2xl">Nothing here yet</p>
                  <p className="mt-2 text-sm text-muted-foreground">Add something to begin your ritual.</p>
                  <Link to="/shop" onClick={closeCart} className="mt-6 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                    Explore the shop
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <FreeGiftProgress {...progress} subtotal={subtotal} className="mb-5" />
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map(({ product, qty, gift }) => (
                        <motion.li
                          key={product.id + (gift ? "-gift" : "")}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 24 }}
                          className="flex gap-4 rounded-3xl border border-border bg-card p-3"
                        >
                          <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                            <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link to="/product/$slug" params={{ slug: product.slug }} onClick={closeCart} className="line-clamp-2 text-sm font-semibold hover:text-primary">
                              {product.name}
                            </Link>
                            {gift ? (
                              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                                <Gift className="h-3 w-3" /> Free gift
                              </span>
                            ) : (
                              <span className="mt-0.5 text-xs text-muted-foreground">{formatMoney(product.price, currency)}</span>
                            )}
                            <div className="mt-auto flex items-center justify-between pt-2">
                              {gift ? (
                                <span className="text-sm font-semibold text-primary">Free</span>
                              ) : (
                                <div className="flex items-center rounded-full border border-border">
                                  <button onClick={() => updateQty(product.id, qty - 1)} aria-label="Decrease" className="grid h-8 w-8 place-items-center rounded-l-full hover:bg-accent"><Minus className="h-3 w-3" /></button>
                                  <span className="w-7 text-center text-xs font-medium">{qty}</span>
                                  <button onClick={() => updateQty(product.id, qty + 1)} aria-label="Increase" className="grid h-8 w-8 place-items-center rounded-r-full hover:bg-accent"><Plus className="h-3 w-3" /></button>
                                </div>
                              )}
                              {!gift && (
                                <button onClick={() => removeFromCart(product.id)} aria-label="Remove" className="text-muted-foreground transition hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <span className="whitespace-nowrap text-sm font-semibold">
                            {gift ? "—" : formatMoney(product.price * qty, currency)}
                          </span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <footer className="border-t border-border px-6 py-5">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><dt>Subtotal</dt><dd className="text-foreground">{formatMoney(subtotal, currency)}</dd></div>
                    <div className="flex justify-between text-muted-foreground"><dt>Shipping</dt><dd className="text-foreground">{shipping === 0 ? "Free" : formatMoney(shipping, currency)}</dd></div>
                    <div className="flex items-baseline justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd className="font-display text-xl">{formatMoney(total, currency)}</dd></div>
                  </dl>
                  <Link to="/checkout" onClick={closeCart} className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:bg-primary/90">
                    Checkout
                  </Link>
                  <Link to="/cart" onClick={closeCart} className="mt-2.5 flex w-full items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:bg-accent">
                    View full cart
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
