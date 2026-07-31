import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sultanet" },
      { name: "description", content: "Reach the Sultanet team — we respond within one business day." },
      { property: "og:title", content: "Contact Sultanet" },
      { property: "og:description", content: "Reach the Sultanet team — we respond within one business day." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-28">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">Contact</p>
        <h1 className="mt-3 font-display text-3xl sm:text-6xl">Talk to us.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Product questions, orders, wholesale — we respond within one business day.</p>
      </Reveal>
      <div className="mt-8 grid sm:mt-16 gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll be in touch shortly."); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Full name" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
            <input type="email" required placeholder="Email" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
          </div>
          <input placeholder="Subject" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
          <textarea required rows={6} placeholder="Your message" className="w-full rounded-3xl border border-border bg-background px-5 py-4 text-sm focus:outline-none focus:border-foreground/40" />
          <button className="rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Send message</button>
        </form>
        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card p-8">
          <Info icon={Mail} label="Email" body="care@sultanet.com" />
          <Info icon={Phone} label="Phone" body="+1 (415) 555 0110" />
          <Info icon={MapPin} label="Studio" body="112 Wellness Lane\nLisbon, Portugal" />
        </aside>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, body }: { icon: React.ComponentType<{ className?: string }>; label: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent"><Icon className="h-4 w-4" /></div>
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
        <div className="mt-1 whitespace-pre-line text-sm">{body}</div>
      </div>
    </div>
  );
}
