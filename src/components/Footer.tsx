import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white font-bold">S</span>
            <span className="font-display text-2xl">Sultanet</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Premium home fitness, recovery, and sleep essentials engineered for the way you live now. Free worldwide shipping over $150.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title="Shop" links={[
          { to: "/shop", label: "All Products" },
          { to: "/categories", label: "Categories" },
          { to: "/shop", label: "Best Sellers", search: { sort: "best" } },
          { to: "/shop", label: "New Arrivals", search: { sort: "new" } },
        ]} />
        <FooterCol title="Support" links={[
          { to: "/contact", label: "Contact" },
          { to: "/order-tracking", label: "Order Tracking" },
          { to: "/about", label: "About" },
          { to: "/contact", label: "FAQ" },
        ]} />
        <FooterCol title="Legal" links={[
          { to: "/about", label: "Privacy" },
          { to: "/about", label: "Terms" },
          { to: "/about", label: "Shipping" },
          { to: "/about", label: "Returns" },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Sultanet. All rights reserved.</span>
          <span>Crafted for premium wellness worldwide.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string; search?: Record<string, string> }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground">{title}</h4>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to as never} className="text-sm text-muted-foreground transition hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
