import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Magnetic hover wrapper — the cursor gently pulls the element. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-flex" }}
      onPointerMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
      }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <span className="magnetic inline-flex w-full">{children}</span>
    </motion.div>
  );
}
