import { createFileRoute } from "@tanstack/react-router";
import { Check, PackageCheck, Truck, Warehouse } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/order-tracking")({
  head: () => ({
    meta: [
      { title: "Order Tracking — Sultanet" },
      { name: "description", content: "Track your Sultanet order in real time." },
      { property: "og:title", content: "Order Tracking — Sultanet" },
      { property: "og:description", content: "Track your Sultanet order in real time." },
    ],
  }),
  component: OrderTracking,
});

function OrderTracking() {
  const [step] = useState(2);
  const steps = [
    { icon: Check, label: "Order placed", body: "Confirmed & preparing" },
    { icon: Warehouse, label: "At the studio", body: "Quality checked and packed" },
    { icon: Truck, label: "In transit", body: "Estimated delivery Nov 3" },
    { icon: PackageCheck, label: "Delivered", body: "Enjoy your ritual" },
  ];
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Order #SN-284019</p>
        <h1 className="mt-3 font-display text-5xl">Your order is on the way.</h1>
      </Reveal>

      <ol className="mt-12 space-y-4">
        {steps.map((s, i) => {
          const done = i <= step;
          const Icon = s.icon;
          return (
            <li key={s.label} className={`flex items-center gap-4 rounded-3xl border p-5 transition ${done ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{s.label}</div>
                <div className="text-sm text-muted-foreground">{s.body}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
