import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Sultanet" },
      { name: "description", content: "Sultanet is a premium wellness house designing quiet, considered tools for a stronger, calmer, more rested life." },
      { property: "og:title", content: "About Sultanet" },
      { property: "og:description", content: "A premium wellness house designing quiet, considered tools for a stronger, calmer, more rested life." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Our story</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] sm:text-7xl">Wellness, without noise.</h1>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mt-10 text-lg leading-relaxed text-muted-foreground">
          Sultanet was founded on a simple belief: the tools you use every day to move, recover, and rest should feel as considered as the moments they create. We design for a quieter kind of premium — sculpted materials, honest construction, and details that reveal themselves over years, not seasons.
        </p>
      </Reveal>
      <Reveal delay={0.25}>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Every Sultanet product is engineered with a small team of designers, therapists, and athletes across three continents. Our goal is never the loudest object in the room — it's the one you'll still reach for a decade from now.
        </p>
      </Reveal>
      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {[
          { n: "128k", l: "Customers worldwide" },
          { n: "4.9", l: "Average rating" },
          { n: "42", l: "Countries shipped" },
        ].map((s) => (
          <Reveal key={s.l}>
            <div className="rounded-3xl border border-border bg-card p-8">
              <div className="font-display text-5xl text-gradient">{s.n}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
