import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useShop } from "@/stores/shop";
import { findProduct } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Sultanet" },
      { name: "description", content: "Your saved Sultanet favourites." },
      { property: "og:title", content: "Wishlist — Sultanet" },
      { property: "og:description", content: "Your saved Sultanet favourites." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useShop();
  const items = wishlist.map((id) => findProduct(id)!).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Saved</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Your wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-16 grid place-items-center rounded-3xl border border-dashed border-border p-16 text-center">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent"><Heart className="h-6 w-6" /></div>
            <p className="mt-5 font-display text-2xl">Nothing saved yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any product to keep it here.</p>
            <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Explore the shop</Link>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
