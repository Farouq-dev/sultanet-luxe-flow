import { motion } from "framer-motion";
import { PartyPopper, Sparkles } from "lucide-react";
import { BUY_X_GET_1 } from "@/lib/promo";
import { cn } from "@/lib/utils";

/** Animated "Buy 5, get 1 free accessory" progress meter. */
export function BuyFiveProgress({
  units,
  percent,
  remaining,
  unlocked,
  rewardName,
  className,
}: {
  units: number;
  percent: number;
  remaining: number;
  unlocked: boolean;
  rewardName?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-border bg-card p-5 shadow-soft", className)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors",
            unlocked ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
          )}
        >
          {unlocked ? <PartyPopper className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />}
        </span>
        <div className="min-w-0">
          {unlocked ? (
            <p className="text-sm font-semibold">
              🎉 Unlocked — your FREE {rewardName ?? BUY_X_GET_1.label} is in the cart.
            </p>
          ) : (
            <p className="text-sm font-semibold">
              Add <span className="text-primary">{remaining} more</span>{" "}
              {remaining === 1 ? "item" : "items"} to unlock a{" "}
              {BUY_X_GET_1.label}.
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {units} of {BUY_X_GET_1.quantity} eligible products
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: BUY_X_GET_1.quantity }).map((_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: i < units ? 1 : 0.9, opacity: i < units ? 1 : 0.45 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < units ? "gradient-brand" : "bg-muted",
            )}
          />
        ))}
      </div>

      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-2xl bg-accent px-3.5 py-2.5 text-[11px] font-semibold text-accent-foreground"
        >
          Celebration unlocked · {percent === 100 ? "reward applied at checkout" : ""}
        </motion.div>
      )}
    </div>
  );
}
