/**
 * Shopify Storefront API adapter — architecture placeholder.
 *
 * Phase 2: implement the `CatalogProvider` contract against the Storefront
 * GraphQL API and export it as the active `catalog` in `./catalog.ts`.
 * Nothing else in the app needs to change.
 *
 *   const res = await fetch(`https://${DOMAIN}/api/2024-10/graphql.json`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       "X-Shopify-Storefront-Access-Token": TOKEN,
 *     },
 *     body: JSON.stringify({ query: PRODUCTS_QUERY, variables }),
 *   });
 *
 * Notes for the migration:
 * - Money: Shopify returns minor-unit strings + a currency code. Feed those
 *   through `formatMoney` instead of the local USD rate table.
 * - Cart: replace the local zustand cart with Storefront `cartCreate` /
 *   `cartLinesAdd`; `src/lib/promo.ts` documents the free-gift rule so it can
 *   move to a Shopify automatic discount / Function.
 * - Tokens are public-read only, but the domain/token still belong in env.
 */
export const SHOPIFY_CONFIG = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? "",
  storefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ?? "",
  apiVersion: "2024-10",
} as const;

export const isShopifyConfigured = () =>
  Boolean(SHOPIFY_CONFIG.storeDomain && SHOPIFY_CONFIG.storefrontToken);
