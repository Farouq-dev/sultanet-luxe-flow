import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/Reveal";

const STATS = [
  { to: 128_000, suffix: "+", label: "Happy customers" },
  { to: 96, suffix: "%", label: "Would recommend" },
  { to: 42, suffix: "", label: "Countries shipped" },
  { to: 15, suffix: "k+", label: "5-star reviews" },
];

export function TrustStats() {
  return (
    <section className="border-y border-border bg-secondary/40 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="text-center">
              <Counter to={s.to} suffix={s.suffix} className="font-display text-4xl sm:text-5xl text-gradient" />
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
