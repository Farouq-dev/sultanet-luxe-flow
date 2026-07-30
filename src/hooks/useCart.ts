import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { catalog } from "@/services/catalog";
import { useShop } from "@/stores/shop";
import { FREE_GIFT, freeGiftProduct, giftProgress } from "@/lib/promo";

/**
 * Single source of truth for cart maths + the free-gift promotion.
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

  const paidSubtotal = items.reduce((s, i) => s + (i.gift ? 0 : i.product.price * i.qty), 0);
  const subtotal = paidSubtotal;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;
  const count = items.reduce((s, i) => s + i.qty, 0);
  const savings = items.reduce(
    (s, i) => s + (i.product.compareAt ? (i.product.compareAt - i.product.price) * i.qty : 0),
    0,
  );

  const progress = giftProgress(subtotal);

  // Auto-manage the free gift line.
  const gift = freeGiftProduct();
  const announced = useRef(false);
  useEffect(() => {
    if (!gift) return;
    const giftLine = cart.find((l) => l.productId === gift.id && l.gift);
    if (progress.unlocked && !giftLine) {
      addGift(gift.id);
      if (!announced.current) {
        announced.current = true;
        toast.success(`Unlocked: a free ${FREE_GIFT.label} was added to your cart.`);
      }
    } else if (!progress.unlocked && giftLine) {
      removeGift(gift.id);
      announced.current = false;
    }
  }, [progress.unlocked, cart, gift, addGift, removeGift]);

  return { items, subtotal, shipping, total, count, savings, currency, progress, updateQty, removeFromCart };
}
