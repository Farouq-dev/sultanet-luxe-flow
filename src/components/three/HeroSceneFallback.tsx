/**
 * Lightweight stand-in for the future WebGL hero scene.
 *
 * Replace this module with a Three.js / R3F / Spline canvas — the lazy import
 * boundary in `Scene3DSlot.tsx` already keeps it off the SSR and initial
 * client bundles. Until then this renders a CSS-only ambient orb field so the
 * slot is visually complete at zero performance cost.
 */
export default function HeroSceneFallback() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="float-slow absolute left-[12%] top-[22%] h-56 w-56 rounded-full bg-[var(--brand)]/25 blur-[70px]" />
      <div className="float-slower absolute right-[14%] top-[38%] h-72 w-72 rounded-full bg-[var(--brand-2)]/25 blur-[90px]" />
      <div className="float-slow absolute bottom-[14%] left-[42%] h-48 w-48 rounded-full bg-white/10 blur-[60px]" />
    </div>
  );
}
