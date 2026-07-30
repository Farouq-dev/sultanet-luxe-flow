import { useEffect, useState } from "react";

/** Ambient cursor glow — desktop + pointer-fine only, GPU-cheap. */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[60] hidden h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[80px] lg:block"
      style={{
        left: pos.x,
        top: pos.y,
        background: "var(--gradient-brand)",
        transition: "left 220ms cubic-bezier(0.22,1,0.36,1), top 220ms cubic-bezier(0.22,1,0.36,1)",
      }}
    />
  );
}
