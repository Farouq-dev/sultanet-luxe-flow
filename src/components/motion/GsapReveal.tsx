import { useEffect, useRef, type ReactNode } from "react";

/**
 * GSAP ScrollTrigger helper.
 *
 * GSAP is loaded lazily on the client only (keeps it out of the SSR bundle and
 * off the critical path) and every trigger is skipped when the user prefers
 * reduced motion.
 */
export function GsapReveal({
  children,
  className,
  from = { y: 60, opacity: 0 },
  stagger = 0.08,
  selector,
}: {
  children: ReactNode;
  className?: string;
  from?: gsap.TweenVars;
  stagger?: number;
  /** Children selector to animate individually; defaults to the container. */
  selector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const targets = selector ? el.querySelectorAll(selector) : [el];
        gsap.from(targets, {
          ...from,
          duration: 0.9,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }, el);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [from, stagger, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
