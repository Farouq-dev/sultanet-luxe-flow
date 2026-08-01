import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Package,
  Heart,
  Ticket,
  Gift,
  History,
  MapPin,
  CreditCard,
  Settings,
  LifeBuoy,
  ChevronRight,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { TrustStrip } from "@/components/trust/TrustBadges";
import { useShop } from "@/stores/shop";
import { catalog } from "@/services/catalog";
import { formatMoney } from "@/lib/currency";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Sultanet" },
      {
        name: "description",
        content: "Manage your Sultanet orders, wishlist, coupons, rewards, addresses and payment methods in one premium dashboard.",
      },
      { property: "og:title", content: "My Account — Sultanet" },
      { property: "og:description", content: "Orders, rewards, coupons and settings — all in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});

const TILES = [
  { icon: Package, label: "Orders", note: "Track & re-order", to: "/order-tracking" as const },
  { icon: Heart, label: "Wishlist", note: "Saved for later", to: "/wishlist" as const },
  { icon: Ticket, label: "Coupons", note: "3 available" },
  { icon: Gift, label: "Rewards", note: "1,240 points" },
  { icon: History, label: "Browsing history", note: "Recently viewed" },
  { icon: MapPin, label: "Addresses", note: "2 saved" },
  { icon: CreditCard, label: "Payment methods", note: "Visa •••• 4421" },
  { icon: Settings, label: "Settings", note: "Preferences" },
  { icon: LifeBuoy, label: "Customer support", note: "24/7 premium care", to: "/contact" as const },
];

function Account() {
  const { wishlist, recentlyViewed, currency } = useShop();
  const recent = (recentlyViewed ?? [])
    .map((slug) => catalog.getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <Reveal>
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border border-border bg-card p-5 sm:flex sm:justify-between sm:p-7">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-primary-foreground sm:h-14 sm:w-14">
              <User className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl sm:text-3xl">Welcome back</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                Sultanet member · {wishlist.length} saved {wishlist.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="shrink-0 rounded-full bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground sm:text-sm"
          >
            Continue shopping
          </Link>
        </header>
      </Reveal>

      <Stagger className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-4">
        {TILES.map(({ icon: Icon, label, note, to }) => {
          const body = (
            <div className="flex h-full items-start gap-3 rounded-3xl border border-border bg-card p-4 transition active:scale-[0.99] hover:border-primary/40 sm:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{note}</span>
              </span>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          );
          return (
            <StaggerItem key={label}>
              {to ? <Link to={to}>{body}</Link> : body}
            </StaggerItem>
          );
        })}
      </Stagger>

      {recent.length > 0 && (
        <Reveal className="mt-8">
          <h2 className="font-display text-xl sm:text-2xl">Browsing history</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
            {recent.map((p) => (
              <li key={p.id}>
                <Link
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  className="block overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <img src={p.image} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                  <span className="block p-2.5">
                    <span className="block truncate text-xs font-semibold">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground">{formatMoney(p.price, currency)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <TrustStrip className="mt-10" />
    </div>
  );
}
