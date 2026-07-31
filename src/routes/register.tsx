import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Sultanet" },
      { name: "description", content: "Join Sultanet for early access and member-only pricing." },
      { property: "og:title", content: "Create account — Sultanet" },
      { property: "og:description", content: "Join Sultanet for early access and member-only pricing." },
    ],
  }),
  component: Register,
});

function Register() {
  return (
    <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-28">
      <div className="w-full">
        <h1 className="text-center font-display text-4xl">Join Sultanet</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Early access, member pricing, and 10% off your first order.</p>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Account created (demo)"); }} className="mt-10 space-y-4">
          <input required placeholder="Full name" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
          <input type="email" required placeholder="Email" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
          <input type="password" required placeholder="Password" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
          <button className="w-full rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Create account</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">Already have one? <Link to="/login" className="font-semibold text-foreground underline underline-offset-4">Sign in</Link></p>
      </div>
    </div>
  );
}
