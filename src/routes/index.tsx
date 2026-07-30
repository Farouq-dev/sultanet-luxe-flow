import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Leaf, ShieldCheck, Truck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero.jpg";
import { bestSellers, categories, collections, featuredBrands, newArrivals, products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { FlashSale } from "@/components/home/FlashSale";
import { TrustStats } from "@/components/home/TrustStats";
import { FAQ } from "@/components/home/FAQ";
import { Scene3DSlot } from "@/components/three/Scene3DSlot";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sultanet — Premium Home Fitness, Recovery & Sleep" },
      { name: "description", content: "Discover Sultanet's curated collection of premium fitness, recovery, and sleep essentials. Studio-grade craftsmanship, delivered worldwide." },
      { property: "og:title", content: "Sultanet — Premium Wellness Essentials" },
      { property: "og:description", content: "Studio-grade fitness, recovery, and sleep essentials engineered for the way you live now." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCategories />
      <FeaturedProducts title="Featured" items={products.slice(0, 8)} eyebrow="Curated" />
      <FlashSale />
      <CollectionShowcase />
      <FeaturedProducts title="Best Sellers" items={bestSellers()} eyebrow="Loved by thousands" />
      <TrustStats />
      <WhyChoose />
      <FeaturedProducts title="New Arrivals" items={newArrivals()} eyebrow="Just landed" />
      <Reviews />
      <FAQ />
      <Brands />
      <Newsletter />
      <Instagram />
    </>
  );
}


function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroImg} alt="Premium wellness setup" className="h-full w-full object-cover" width={1600} height={1200} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061222] via-[#061222]/60 to-transparent" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-40 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs font-medium uppercase tracking-[0.28em] text-white/70"
        >
          Home Fitness · Recovery · Sleep
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] text-white sm:text-7xl lg:text-8xl"
        >
          Wellness, <span className="italic text-white/80">refined.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          A quiet, considered collection of home fitness, recovery, and sleep essentials — engineered for the way you live now.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#123249] transition hover:bg-white/90">
            Shop the collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/categories" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
            Explore categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Free worldwide shipping over $150", "30-day satisfaction guarantee", "Free returns", "1-year warranty", "Studio-grade quality"];
  return (
    <div className="overflow-hidden border-y border-border bg-secondary/40 py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="mx-8 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">◆ {t}</span>
        ))}
      </div>
    </div>
  );
}

function FeaturedCategories() {
  const featured = categories.slice(0, 6);
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Explore</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Featured categories</h2>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary">View all</Link>
        </div>
      </Reveal>
      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((c) => (
          <StaggerItem key={c.slug}>
            <Link
              to="/shop"
              search={{ category: c.slug }}
              className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-3xl border border-border p-7"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div className="absolute inset-0 opacity-20 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-40" style={{ background: "radial-gradient(circle at 30% 20%, #447794, transparent 60%)" }} />
              <span className="relative text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">{c.collection}</span>
              <h3 className="relative mt-2 font-display text-2xl text-white">{c.name}</h3>
              <p className="relative mt-1 text-sm text-white/70">{c.description}</p>
              <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-white/70 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function FeaturedProducts({ title, items, eyebrow }: { title: string; items: typeof products; eyebrow: string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">{title}</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold underline underline-offset-4 hover:text-primary">Shop all</Link>
        </div>
      </Reveal>
      <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 8).map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function CollectionShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-6 lg:grid-cols-3">
        {collections.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.08}>
            <Link
              to="/shop" search={{ collection: c.key }}
              className="group relative flex h-[440px] flex-col justify-between overflow-hidden rounded-[2rem] p-8 text-white"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-all duration-700 group-hover:scale-125" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/60">Collection {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-display text-4xl">{c.title}</h3>
                <p className="mt-3 max-w-xs text-sm text-white/70">{c.tagline}</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur transition group-hover:bg-white group-hover:text-[#123249]">
                Discover <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    { icon: Award, title: "Studio-grade", body: "Materials and craftsmanship built to last a decade of daily use." },
    { icon: Truck, title: "Free worldwide", body: "Complimentary shipping on orders over $150. Anywhere on earth." },
    { icon: ShieldCheck, title: "1-year warranty", body: "Every Sultanet product is covered with a full year of support." },
    { icon: Leaf, title: "Considered materials", body: "OEKO-TEX cotton, natural rubber, recycled aluminum, always." },
  ];
  return (
    <section className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Why Sultanet</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">A quieter kind of premium.</h2>
          </div>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <StaggerItem key={title}>
              <div className="hover-lift flex h-full flex-col rounded-3xl border border-border bg-card p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Amara O.", role: "Lagos", text: "The Cocoon blanket completely changed how I fall asleep. It feels like a hug that lasts all night." },
    { name: "Julian R.", role: "London", text: "Pulse Pro is the quietest, deepest massage gun I've owned — and I've owned four." },
    { name: "Sofia K.", role: "Berlin", text: "Obsidian dumbbells replaced my entire rack. Beautiful build quality." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Loved worldwide</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">Words from our community</h2>
      </Reveal>
      <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <StaggerItem key={r.name}>
            <blockquote className="hover-lift flex h-full flex-col rounded-3xl border border-border bg-card p-8">
              <span className="font-display text-4xl leading-none text-primary">"</span>
              <p className="mt-4 text-base leading-relaxed text-foreground">{r.text}</p>
              <footer className="mt-6 text-sm text-muted-foreground">
                <strong className="text-foreground">{r.name}</strong> · {r.role}
              </footer>
            </blockquote>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function Brands() {
  return (
    <section className="border-y border-border py-14">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Featured brands</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {featuredBrands.map((b) => (
            <span key={b} className="font-display text-xl text-foreground/50 transition hover:text-foreground">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] p-10 sm:p-16" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#447794]/40 blur-3xl" />
          <div className="relative max-w-xl text-white">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/70">Join Sultanet</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">Rituals, delivered to your inbox.</h2>
            <p className="mt-4 text-white/70">Early access to new collections, guides, and 10% off your first order.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input type="email" required placeholder="your@email.com" className="flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-white/50 backdrop-blur focus:border-white/40 focus:outline-none" />
              <button className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#123249] transition hover:bg-white/90">Subscribe</button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Instagram() {
  const imgs = products.slice(0, 6).map((p) => p.image);
  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">@sultanet</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Life, considered.</h2>
          </div>
        </div>
      </Reveal>
      <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {imgs.map((src, i) => (
          <StaggerItem key={i}>
            <a href="#" className="group block aspect-square overflow-hidden rounded-2xl bg-muted">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
