import { catalog } from "@/services/catalog";
import { giftAccessorySlugs } from "@/lib/data";

/**
 * Promotion rules.
 *
 * Kept declarative so the same thresholds can later drive Shopify automatic
 * discounts / cart-transform Functions instead of client state.
 */
export const FREE_GIFT = {
  threshold: 500, // USD subtotal
  productSlug: "midnight-alignment-mat",
  label: "Premium Yoga Mat",
} as const;

/** Buy N eligible products, receive one free accessory. */
export const BUY_X_GET_1 = {
  quantity: 5,
  label: "FREE accessory",
} as const;

/** Active campaign powering the reusable countdown. */
export const CAMPAIGN = {
  title: "SUMMER SALE",
  emoji: "🔥",
  subtitle: "Save Up To 30% On Selected Products",
  note: "Complete your purchase before this promotion ends.",
  /** Deterministic end date so SSR and client agree. */
  endsAt: new Date("2026-08-31T23:59:59Z").getTime(),
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

/** Accessories that can be awarded by the Buy 5 Get 1 Free promotion. */
export function giftAccessories() {
  return giftAccessorySlugs
    .map((slug) => catalog.getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

/**
 * The accessory awarded for a given basket — deterministic (cheapest eligible
 * accessory that isn't already a paid line) so the reward never flickers.
 */
export function accessoryRewardFor(paidProductIds: string[]) {
  const pool = giftAccessories().filter((p) => !paidProductIds.includes(p.id));
  if (pool.length === 0) return giftAccessories()[0];
  return pool.slice().sort((a, b) => a.price - b.price)[0];
}

export function buyFiveProgress(paidUnits: number) {
  const remaining = Math.max(0, BUY_X_GET_1.quantity - paidUnits);
  return {
    remaining,
    unlocked: remaining === 0 && paidUnits > 0,
    percent: Math.min(100, (paidUnits / BUY_X_GET_1.quantity) * 100),
    units: paidUnits,
  };
}
