import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Sultanet" },
      { name: "description", content: "Sign in to your Sultanet account." },
      { property: "og:title", content: "Sign in — Sultanet" },
      { property: "og:description", content: "Sign in to your Sultanet account." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-28">
      <div className="w-full">
        <h1 className="text-center font-display text-4xl">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to continue your ritual.</p>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Signed in (demo)"); }} className="mt-10 space-y-4">
          <input type="email" required placeholder="Email" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
          <input type="password" required placeholder="Password" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:outline-none focus:border-foreground/40" />
          <button className="w-full rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Sign in</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link to="/register" className="font-semibold text-foreground underline underline-offset-4">Create an account</Link></p>
      </div>
    </div>
  );
}
