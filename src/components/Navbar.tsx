import { Link, useRouter } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/stores/shop";
import { CURRENCIES } from "@/lib/currency";
import { MegaMenu } from "@/components/MegaMenu";
import { collections, categories } from "@/lib/data";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>("fitness");
  const { cart, wishlist, currency, setCurrency, theme, toggleTheme, openCart } = useShop();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setMega(false)}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "glass shadow-soft" : "bg-transparent"
        }`}
      >
        <div className="relative mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-20 sm:gap-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full gradient-brand text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">S</span>
            <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">Sultanet</span>
          </Link>

          <nav className="ml-8 hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onMouseEnter={() => setMega(n.to === "/shop")}
                onFocus={() => setMega(n.to === "/shop")}
                className="relative text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as never)}
              aria-label="Currency"
              className="hidden rounded-full border border-border bg-transparent px-2.5 py-1.5 text-xs font-medium text-foreground/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:block"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
            {/* Search lives in the drawer / search page / bottom nav — no desktop nav icon. */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition active:scale-90 hover:bg-accent hover:text-foreground lg:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            <button onClick={toggleTheme} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition active:scale-90 hover:bg-accent hover:text-foreground">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hidden h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent hover:text-foreground lg:grid">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/login" aria-label="Account" className="hidden h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent hover:text-foreground lg:grid">
              <User className="h-5 w-5" />
            </Link>
            <button onClick={openCart} aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition active:scale-90 hover:bg-accent hover:text-foreground">
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition active:scale-90 hover:bg-accent lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <MegaMenu open={mega} />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 right-0 z-[81] flex w-[88vw] max-w-sm flex-col bg-background"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="font-display text-xl">Browse</span>
                <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="flex items-center gap-2 rounded-2xl bg-accent px-3.5 py-2.5 text-[11px] font-semibold text-accent-foreground">
                  <Truck className="h-3.5 w-3.5" /> Free worldwide shipping on all orders
                </div>

                <nav className="mt-4 flex flex-col">
                  {nav.map((n) => (
                    <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-2xl px-3 py-3 text-base font-medium hover:bg-accent">
                      {n.label}
                    </Link>
                  ))}
                </nav>

                <p className="mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Popular categories
                </p>
                <div className="mt-2 divide-y divide-border rounded-2xl border border-border">
                  {collections.map((c) => {
                    const isOpen = openGroup === c.key;
                    return (
                      <div key={c.key}>
                        <button
                          onClick={() => setOpenGroup(isOpen ? null : c.key)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold"
                        >
                          {c.title}
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden px-2 pb-2"
                            >
                              {categories.filter((cat) => cat.collection === c.key).map((cat) => (
                                <li key={cat.slug}>
                                  <Link
                                    to="/shop"
                                    search={{ category: cat.slug }}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                  >
                                    {cat.name}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link
                                  to="/shop"
                                  search={{ collection: c.key }}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary"
                                >
                                  Shop all {c.title}
                                </Link>
                              </li>
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-border px-5 py-4">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-border py-3 text-center text-sm font-medium">Sign in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground">Join</Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
