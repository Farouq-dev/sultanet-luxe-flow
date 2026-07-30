import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock, Gift } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/stores/shop";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/currency";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Sultanet" },
      { name: "description", content: "Secure Sultanet checkout." },
      { property: "og:title", content: "Checkout — Sultanet" },
      { property: "og:description", content: "Complete your Sultanet order." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { clearCart } = useShop();
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, currency } = useCart();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      toast.success("Order placed! Confirmation sent to your inbox.");
      navigate({ to: "/order-tracking" });
    }, 900);
  };


  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="font-display text-5xl">Checkout</h1>
      <form onSubmit={submit} className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <Section title="Contact">
            <Field label="Email" type="email" required placeholder="you@example.com" />
          </Section>
          <Section title="Shipping">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required />
              <Field label="Last name" required />
              <Field label="Address" required className="sm:col-span-2" />
              <Field label="City" required />
              <Field label="Postal code" required />
              <Field label="Country" required defaultValue="United States" />
              <Field label="Phone" type="tel" />
            </div>
          </Section>
          <Section title="Payment">
            <div className="rounded-3xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Lock className="h-4 w-4" /> Encrypted & secure</div>
              <div className="grid gap-4">
                <Field label="Card number" icon={<CreditCard className="h-4 w-4" />} placeholder="0000 0000 0000 0000" required />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" placeholder="MM / YY" required />
                  <Field label="CVC" placeholder="123" required />
                </div>
              </div>
            </div>
          </Section>
        </div>
        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.product.id} className="flex items-center gap-3">
                <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img src={i.product.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{i.qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="line-clamp-1 text-sm font-medium">{i.product.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {i.gift ? (<><Gift className="h-3 w-3" /> Free gift</>) : formatMoney(i.product.price, currency)}
                  </div>
                </div>

              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="text-foreground">{formatMoney(subtotal, currency)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-foreground">{shipping === 0 ? "Free" : formatMoney(shipping, currency)}</span></div>
            <div className="flex items-baseline justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span className="font-display text-xl">{formatMoney(total, currency)}</span></div>
          </div>
          <button disabled={loading || items.length === 0} className="mt-6 w-full rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:bg-primary/90">
            {loading ? "Placing order…" : `Pay ${formatMoney(total, currency)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, className = "", icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <span className="mt-2 flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3">
        {icon}
        <input {...props} className="w-full bg-transparent text-sm focus:outline-none" />
      </span>
    </label>
  );
}
