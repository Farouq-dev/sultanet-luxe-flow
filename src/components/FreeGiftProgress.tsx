import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { FREE_GIFT } from "@/lib/promo";
import { formatMoney } from "@/lib/currency";
import { useShop } from "@/stores/shop";
import { cn } from "@/lib/utils";

export function FreeGiftProgress({
  subtotal,
  percent,
  remaining,
  unlocked,
  className,
}: {
  subtotal: number;
  percent: number;
  remaining: number;
  unlocked: boolean;
  className?: string;
}) {
  const { currency } = useShop();

  return (
    <div className={cn("rounded-3xl border border-border bg-card p-5 shadow-soft", className)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors",
            unlocked ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
          )}
        >
          <Gift className={cn("h-4.5 w-4.5", unlocked && "float-slow")} />
        </span>
        <div className="min-w-0">
          {unlocked ? (
            <p className="text-sm font-semibold">
              Congratulations! Your FREE {FREE_GIFT.label} has been unlocked.
            </p>
          ) : (
            <p className="text-sm font-semibold">
              You&apos;re only{" "}
              <span className="text-primary">{formatMoney(remaining, currency)}</span> away from a FREE{" "}
              {FREE_GIFT.label}.
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {formatMoney(subtotal, currency)} of {formatMoney(FREE_GIFT.threshold, currency)} qualifying spend
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="h-full rounded-full gradient-brand"
        />
      </div>
    </div>
  );
}
