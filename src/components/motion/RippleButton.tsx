import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Ripple { id: number; x: number; y: number }

/** Button with a material-style ripple micro-interaction. */
export function RippleButton({
  className,
  children,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <button
      {...props}
      onClick={(e) => {
        if (!reduced.current) {
          const r = e.currentTarget.getBoundingClientRect();
          const id = ++idRef.current;
          setRipples((prev) => [...prev, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
          setTimeout(() => setRipples((prev) => prev.filter((p) => p.id !== id)), 620);
        }
        onClick?.(e);
      }}
      className={cn("relative overflow-hidden", className)}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple pointer-events-none absolute rounded-full"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
