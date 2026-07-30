import { Link, useRouter } from "@tanstack/react-router";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/stores/shop";
import { CURRENCIES } from "@/lib/currency";

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
  const router = useRouter();
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
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? "glass shadow-soft" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-20 sm:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-full gradient-brand text-sm font-bold text-white">S</span>
            <span className="font-display text-xl font-semibold tracking-tight">Sultanet</span>
          </Link>

          <nav className="ml-8 hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
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
            <Link to="/search" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent hover:text-foreground">
              <Search className="h-4.5 w-4.5" />
            </Link>
            <button onClick={toggleTheme} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent hover:text-foreground">
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent hover:text-foreground">
              <Heart className="h-4.5 w-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/login" aria-label="Account" className="hidden h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent hover:text-foreground sm:grid">
              <User className="h-4.5 w-4.5" />
            </Link>
            <button onClick={openCart} aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent hover:text-foreground">
              <ShoppingBag className="h-4.5 w-4.5" />
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

            <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-accent lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-sm flex-col bg-background p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">Menu</span>
                <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent">
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex items-center gap-2 pt-6">
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
