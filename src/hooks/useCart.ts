import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { catalog } from "@/services/catalog";
import { useShop } from "@/stores/shop";
import {
  BUY_X_GET_1,
  FREE_GIFT,
  accessoryRewardFor,
  buyFiveProgress,
  freeGiftProduct,
  giftProgress,
} from "@/lib/promo";

/**
 * Single source of truth for cart maths + the promotions
 * (spend $500 → free yoga mat, buy 5 → free accessory).
 * Swap the `catalog` calls for Shopify cart lines later; the shape stays.
 */
export function useCart() {
  const { cart, currency, updateQty, removeFromCart, addGift, removeGift } = useShop();

  const items = useMemo(
    () =>
      cart
        .map((line) => ({ ...line, product: catalog.getProductById(line.productId) }))
        .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => Boolean(l.product)),
    [cart],
  );

  const paidLines = items.filter((i) => !i.gift);
  const paidSubtotal = paidLines.reduce((s, i) => s + i.product.price * i.qty, 0);
  const subtotal = paidSubtotal;
  const shipping = 0; // free worldwide shipping on every order
  const total = subtotal;
  const count = items.reduce((s, i) => s + i.qty, 0);
  const paidUnits = paidLines.reduce((s, i) => s + i.qty, 0);
  const savings = items.reduce(
    (s, i) => s + (i.product.compareAt ? (i.product.compareAt - i.product.price) * i.qty : 0),
    0,
  );

  const progress = giftProgress(subtotal);
  const bulkProgress = buyFiveProgress(paidUnits);

  const gift = freeGiftProduct();
  const reward = accessoryRewardFor(paidLines.map((l) => l.product.id));
  const rewardName = reward?.name;

  // Auto-manage promotional gift lines.
  const announcedGift = useRef(false);
  const announcedBulk = useRef(false);
  useEffect(() => {
    const expected = new Set<string>();
    if (progress.unlocked && gift) expected.add(gift.id);
    if (bulkProgress.unlocked && reward && !expected.has(reward.id)) expected.add(reward.id);

    for (const line of cart) {
      if (line.gift && !expected.has(line.productId)) removeGift(line.productId);
    }
    for (const id of expected) {
      if (!cart.some((l) => l.productId === id && l.gift)) addGift(id);
    }

    if (progress.unlocked && !announcedGift.current) {
      announcedGift.current = true;
      toast.success(`🎁 FREE ${FREE_GIFT.label} unlocked and added to your cart.`);
    }
    if (!progress.unlocked) announcedGift.current = false;

    if (bulkProgress.unlocked && !announcedBulk.current) {
      announcedBulk.current = true;
      toast.success(`🎉 ${BUY_X_GET_1.quantity} items — your FREE ${rewardName ?? "accessory"} is on us.`);
    }
    if (!bulkProgress.unlocked) announcedBulk.current = false;
  }, [progress.unlocked, bulkProgress.unlocked, cart, gift, reward, rewardName, addGift, removeGift]);

  return {
    items,
    subtotal,
    shipping,
    total,
    count,
    paidUnits,
    savings,
    currency,
    progress,
    bulkProgress,
    rewardName,
    updateQty,
    removeFromCart,
  };
}
