import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

/**
 * Tier 3 architecture placeholder — interactive 3D hero.
 *
 * The boundary is in place so a Three.js / React Three Fiber / Spline scene
 * can be dropped in later without touching page layout:
 *
 *   const Scene = lazy(() => import("./HeroScene"));  // r3f canvas
 *
 * Rules for whoever ships it:
 * - Client-only: never import the scene module at the top level of a route.
 * - Gate on `capable` below (skips low-memory / reduced-motion / mobile).
 * - Keep the static fallback as the SSR + no-WebGL experience.
 */
const Scene = lazy(() => import("./HeroSceneFallback"));

export function useWebGLCapable() {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    try {
      const canvas = document.createElement("canvas");
      setCapable(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setCapable(false);
    }
  }, []);
  return capable;
}

export function Scene3DSlot({ fallback }: { fallback: ReactNode }) {
  const capable = useWebGLCapable();
  if (!capable) return <>{fallback}</>;
  return (
    <Suspense fallback={fallback}>
      <Scene />
    </Suspense>
  );
}
