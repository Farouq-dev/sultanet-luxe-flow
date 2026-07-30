/**
 * Catalog service layer.
 *
 * All UI reads product data through this module — never from `@/lib/data`
 * directly (outside of the mock provider below). That keeps the Shopify
 * Storefront API swap to a single file change: implement `CatalogProvider`
 * in `src/services/shopify.ts` and point `catalog` at it.
 */
import {
  products as mockProducts,
  categories as mockCategories,
  collections as mockCollections,
  type Product,
  type Category,
  type Collection,
} from "@/lib/data";

export type { Product, Category, Collection };

export interface ProductQuery {
  collection?: Collection;
  category?: string;
  search?: string;
  tag?: "new" | "best" | "flash";
  limit?: number;
}

export interface CatalogProvider {
  readonly name: string;
  listProducts(query?: ProductQuery): Product[];
  getProductBySlug(slug: string): Product | undefined;
  getProductById(id: string): Product | undefined;
  listCategories(): Category[];
  listCollections(): typeof mockCollections;
  relatedProducts(product: Product, limit?: number): Product[];
  frequentlyBoughtTogether(product: Product, limit?: number): Product[];
  recommendations(seedIds: string[], limit?: number): Product[];
}

export const mockCatalog: CatalogProvider = {
  name: "mock",
  listProducts(query = {}) {
    let list = mockProducts.slice();
    if (query.collection) list = list.filter((p) => p.collection === query.collection);
    if (query.category) list = list.filter((p) => p.category === query.category);
    if (query.tag) list = list.filter((p) => p.tags.includes(query.tag!));
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return query.limit ? list.slice(0, query.limit) : list;
  },
  getProductBySlug: (slug) => mockProducts.find((p) => p.slug === slug),
  getProductById: (id) => mockProducts.find((p) => p.id === id),
  listCategories: () => mockCategories,
  listCollections: () => mockCollections,
  relatedProducts: (product, limit = 4) =>
    mockProducts
      .filter((p) => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
      .slice(0, limit),
  frequentlyBoughtTogether: (product, limit = 3) =>
    mockProducts.filter((p) => p.id !== product.id && p.collection !== product.collection).slice(0, limit),
  recommendations: (seedIds, limit = 8) => {
    const seeds = seedIds.map((id) => mockProducts.find((p) => p.id === id)).filter(Boolean) as Product[];
    const cols = new Set(seeds.map((s) => s.collection));
    const scored = mockProducts
      .filter((p) => !seedIds.includes(p.id))
      .sort((a, b) => Number(cols.has(b.collection)) - Number(cols.has(a.collection)) || b.rating - a.rating);
    return scored.slice(0, limit);
  },
};

/** Active provider. Swap to `shopifyCatalog` once credentials are wired. */
export const catalog: CatalogProvider = mockCatalog;
