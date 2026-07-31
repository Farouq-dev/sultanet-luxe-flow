import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Search, Heart, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { useShop } from "@/stores/shop";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/search", label: "Search", icon: Search },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/login", label: "Profile", icon: User },
] as const;

/** Premium mobile bottom navigation with an animated active indicator. */
export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { cart, wishlist } = useShop();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const badgeFor = (to: string) =>
    to === "/cart" ? cartCount : to === "/wishlist" ? wishlist.length : 0;

  return (
    <nav
      aria-label="Primary"
      className="glass fixed inset-x-0 bottom-0 z-[60] border-t border-border pb-[max(env(safe-area-inset-bottom),0.25rem)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-6">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          const badge = badgeFor(to);
          return (
            <li key={to} className="relative">
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-col items-center gap-1 px-1 pb-1.5 pt-2.5 active:scale-95 transition-transform"
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-x-2 top-1 h-9 rounded-full bg-accent"
                  />
                )}
                <span className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                  {badge > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                      {badge}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "relative text-[9.5px] font-medium tracking-tight",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
