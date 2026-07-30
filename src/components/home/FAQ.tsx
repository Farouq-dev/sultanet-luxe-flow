import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const FAQS = [
  { q: "How long does shipping take?", a: "Most orders leave our studio within 24 hours. Delivery takes 2–5 business days domestically and 5–12 days worldwide. Shipping is complimentary on orders over $150." },
  { q: "What is your returns policy?", a: "Every purchase includes a 30-day satisfaction guarantee. If a product isn't right for your ritual, return it unused for a full refund — we cover return shipping." },
  { q: "Are products covered by a warranty?", a: "Yes. Every Sultanet product carries a full one-year warranty against manufacturing defects, extendable to three years on motorised recovery devices." },
  { q: "How does the free gift promotion work?", a: "Reach $500 in your cart and a Premium Yoga Mat is added automatically at no cost. The gift is applied and removed live as your cart changes." },
  { q: "Can I track my order?", a: "Absolutely. You'll receive a tracking link by email at dispatch, and you can check status any time from the Order Tracking page." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Good to know</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">Frequently asked</h2>
      </Reveal>
      <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border">
                  <Plus className="h-4 w-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
