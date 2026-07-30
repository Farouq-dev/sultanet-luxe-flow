import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  { icon: "🚚", text: "Free Worldwide Shipping" },
  { icon: "🎁", text: "Free Premium Yoga Mat on Orders Above $500" },
  { icon: "⭐", text: "Premium Quality Guaranteed" },
  { icon: "🔒", text: "Secure Checkout" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 3800);
    return () => clearInterval(id);
  }, []);

  const msg = MESSAGES[i];

  return (
    <div className="relative z-50 overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] sm:text-xs"
          >
            <span aria-hidden>{msg.icon}</span>
            <span className="truncate">{msg.text}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
