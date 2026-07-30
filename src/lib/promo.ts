import { catalog } from "@/services/catalog";

/**
 * Free-gift promotion rules.
 *
 * Kept declarative so the same thresholds can later drive a Shopify
 * automatic discount / cart transform Function instead of client state.
 */
export const FREE_GIFT = {
  threshold: 500, // USD subtotal
  productSlug: "midnight-alignment-mat",
  label: "Premium Yoga Mat",
} as const;

export function freeGiftProduct() {
  return catalog.getProductBySlug(FREE_GIFT.productSlug);
}

export function giftProgress(subtotalUsd: number) {
  const remaining = Math.max(0, FREE_GIFT.threshold - subtotalUsd);
  return {
    remaining,
    unlocked: remaining === 0 && subtotalUsd > 0,
    percent: Math.min(100, (subtotalUsd / FREE_GIFT.threshold) * 100),
  };
}
