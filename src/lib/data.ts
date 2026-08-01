import massageGun from "@/assets/products/massage-gun.jpg";
import dumbbells from "@/assets/products/dumbbells.jpg";
import yogaMat from "@/assets/products/yoga-mat.jpg";
import blanket from "@/assets/products/blanket.jpg";
import diffuser from "@/assets/products/diffuser.jpg";
import bands from "@/assets/products/bands.jpg";
import kettlebell from "@/assets/products/kettlebell.jpg";
import sleepMask from "@/assets/products/sleep-mask.jpg";
import foamRoller from "@/assets/products/foam-roller.jpg";
import pillow from "@/assets/products/pillow.jpg";
import whiteNoise from "@/assets/products/white-noise.jpg";

export type Collection = "fitness" | "recovery" | "sleep";

export interface Category {
  slug: string;
  name: string;
  collection: Collection;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number; // USD base
  compareAt?: number;
  rating: number;
  reviews: number;
  /** Units sold — merchandising / social proof. */
  sold?: number;
  stock: number;

  image: string;
  gallery?: string[];
  collection: Collection;
  category: string;
  tags: ("new" | "best" | "flash")[];
  description: string;
  features: string[];
}

export const collections: { key: Collection; title: string; tagline: string }[] = [
  { key: "fitness", title: "Home Fitness", tagline: "Studio-grade training, at home." },
  { key: "recovery", title: "Recovery", tagline: "Repair, restore, return stronger." },
  { key: "sleep", title: "Sleep & Relaxation", tagline: "Engineered for deeper rest." },
];

export const categories: Category[] = [
  { slug: "resistance-bands", name: "Resistance Bands", collection: "fitness", description: "Progressive tension for every level." },
  { slug: "adjustable-dumbbells", name: "Adjustable Dumbbells", collection: "fitness", description: "One set. Every workout." },
  { slug: "kettlebells", name: "Kettlebells", collection: "fitness", description: "Cast iron classics, precision balanced." },
  { slug: "yoga-mats", name: "Yoga Mats", collection: "fitness", description: "Grip, cushion, longevity." },
  { slug: "foam-rollers", name: "Foam Rollers", collection: "fitness", description: "Release tension, prime muscles." },
  { slug: "massage-guns", name: "Massage Guns", collection: "recovery", description: "Percussive therapy on demand." },
  { slug: "neck-massagers", name: "Neck Massagers", collection: "recovery", description: "Melt away everyday tension." },
  { slug: "heating-pads", name: "Heating Pads", collection: "recovery", description: "Targeted heat therapy." },
  { slug: "compression-sleeves", name: "Compression Sleeves", collection: "recovery", description: "Support and circulation." },
  { slug: "memory-pillows", name: "Memory Foam Pillows", collection: "sleep", description: "Contour support for deep sleep." },
  { slug: "weighted-blankets", name: "Weighted Blankets", collection: "sleep", description: "Grounded, cocooning calm." },
  { slug: "sleep-masks", name: "Sleep Masks", collection: "sleep", description: "Silk-soft light blockage." },
  { slug: "white-noise", name: "White Noise Machines", collection: "sleep", description: "Soundscapes for rest." },
  { slug: "diffusers", name: "Essential Oil Diffusers", collection: "sleep", description: "Aromatherapy, quietly." },
];

export const products: Product[] = [
  {
    id: "p1", slug: "pulse-pro-massage-gun", name: "Pulse Pro Massage Gun", brand: "Sultanet",
    price: 249, compareAt: 329, rating: 4.9, reviews: 2148, stock: 32,
    image: massageGun, collection: "recovery", category: "massage-guns", tags: ["best", "flash"],
    description: "Quiet, deep-tissue percussion with 5 speeds and 6 heads. Aircraft-grade aluminum body.",
    features: ["5 speed settings", "Whisper 45dB motor", "6 interchangeable heads", "6 hour battery"],
  },
  {
    id: "p2", slug: "obsidian-adjustable-dumbbells", name: "Obsidian Adjustable Dumbbells", brand: "Sultanet Iron",
    price: 549, compareAt: 649, rating: 4.8, reviews: 872, stock: 14,
    image: dumbbells, collection: "fitness", category: "adjustable-dumbbells", tags: ["new", "best"],
    description: "5–52.5 lb per handle. Dial-select in one second. Space of two dumbbells, power of fifteen.",
    features: ["5–52.5 lb range", "Twist dial adjust", "Steel plates", "Cradle included"],
  },
  {
    id: "p3", slug: "midnight-alignment-mat", name: "Midnight Alignment Mat", brand: "Sultanet",
    price: 89, rating: 4.9, reviews: 1420, stock: 120,
    image: yogaMat, collection: "fitness", category: "yoga-mats", tags: ["best"],
    description: "6mm natural rubber with laser-etched alignment guides. Grip that holds through sweat.",
    features: ["6mm cushion", "Alignment guides", "Natural rubber", "Carry strap"],
  },
  {
    id: "p4", slug: "cocoon-weighted-blanket", name: "Cocoon Weighted Blanket", brand: "Sultanet Rest",
    price: 179, compareAt: 219, rating: 4.9, reviews: 3305, stock: 46,
    image: blanket, collection: "sleep", category: "weighted-blankets", tags: ["best", "new"],
    description: "Hand-knit chunky weave with breathable cotton. 15 lb signature weight.",
    features: ["15 lb weight", "Breathable knit", "OEKO-TEX cotton", "Machine washable"],
  },
  {
    id: "p5", slug: "aroma-halo-diffuser", name: "Aroma Halo Diffuser", brand: "Sultanet Rest",
    price: 79, rating: 4.7, reviews: 640, stock: 88,
    image: diffuser, collection: "sleep", category: "diffusers", tags: ["new"],
    description: "Ultrasonic ceramic diffuser with 8-hour timer and ambient glow.",
    features: ["8h runtime", "Ceramic body", "Ambient glow", "Silent operation"],
  },
  {
    id: "p6", slug: "flex-band-set", name: "Flex Band Set", brand: "Sultanet",
    price: 39, compareAt: 55, rating: 4.6, reviews: 512, stock: 240,
    image: bands, collection: "fitness", category: "resistance-bands", tags: ["flash"],
    description: "Five bands, 10–150 lb resistance. Latex-free, snap-tested.",
    features: ["5 tension levels", "Latex-free", "Door anchor", "Carry pouch"],
  },
  {
    id: "p7", slug: "iron-core-kettlebell", name: "Iron Core Kettlebell", brand: "Sultanet Iron",
    price: 79, rating: 4.8, reviews: 388, stock: 60,
    image: kettlebell, collection: "fitness", category: "kettlebells", tags: ["best"],
    description: "Powder-coated cast iron with a wide, comfortable handle. 8–40 kg.",
    features: ["Cast iron", "Powder coat", "Flat base", "8–40 kg"],
  },
  {
    id: "p8", slug: "silk-eclipse-sleep-mask", name: "Silk Eclipse Sleep Mask", brand: "Sultanet Rest",
    price: 45, rating: 4.9, reviews: 921, stock: 300,
    image: sleepMask, collection: "sleep", category: "sleep-masks", tags: ["best"],
    description: "22-momme mulberry silk with adjustable strap. 100% blackout contour.",
    features: ["Mulberry silk", "Contour cut", "Adjustable strap", "Travel pouch"],
  },
  {
    id: "p9", slug: "trigger-point-roller", name: "Trigger Point Roller", brand: "Sultanet",
    price: 59, rating: 4.7, reviews: 274, stock: 84,
    image: foamRoller, collection: "recovery", category: "compression-sleeves", tags: ["new"],
    description: "High-density EVA with textured trigger nodes for deep myofascial release.",
    features: ["High-density EVA", "Textured surface", "13-inch length", "Hollow core"],
  },
  {
    id: "p10", slug: "cloud-contour-pillow", name: "Cloud Contour Pillow", brand: "Sultanet Rest",
    price: 129, compareAt: 159, rating: 4.8, reviews: 1102, stock: 55,
    image: pillow, collection: "sleep", category: "memory-pillows", tags: ["best", "new"],
    description: "Ventilated memory foam with cooling gel infusion and bamboo cover.",
    features: ["Cooling gel", "Bamboo cover", "Ventilated foam", "5-year warranty"],
  },
  {
    id: "p11", slug: "quiet-space-sound-machine", name: "Quiet Space Sound Machine", brand: "Sultanet Rest",
    price: 89, rating: 4.7, reviews: 445, stock: 70,
    image: whiteNoise, collection: "sleep", category: "white-noise", tags: ["new"],
    description: "30 immersive soundscapes, sunrise alarm, and Bluetooth streaming.",
    features: ["30 sounds", "Sunrise alarm", "Bluetooth", "Sleep timer"],
  },
  {
    id: "p12", slug: "recovery-heat-wrap", name: "Recovery Heat Wrap", brand: "Sultanet",
    price: 99, rating: 4.6, reviews: 210, stock: 40,
    image: massageGun, collection: "recovery", category: "heating-pads", tags: ["flash"],
    description: "Graphene heat therapy wrap with 4 zones and 6 temperature levels.",
    features: ["4 heat zones", "6 temperatures", "USB-C", "Machine washable"],
  },
];

export const featuredBrands = [
  "Sultanet", "Sultanet Iron", "Sultanet Rest", "Halo Fitness", "Nordic Recover", "LumaSleep",
];

export function findProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function productsByCollection(c: Collection) {
  return products.filter((p) => p.collection === c);
}
export function productsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}
export function newArrivals() {
  return products.filter((p) => p.tags.includes("new"));
}
export function bestSellers() {
  return products.filter((p) => p.tags.includes("best"));
}
export function flashSales() {
  return products.filter((p) => p.tags.includes("flash"));
}

/**
 * Derived merchandising fields (deterministic so SSR and client agree).
 * A Shopify migration replaces this with metafields / `totalInventory`.
 */
products.forEach((p, i) => {
  p.sold = p.sold ?? Math.round(p.reviews * (7 + (i % 5)));
  if (!p.gallery || p.gallery.length < 2) {
    const others = products.filter((o) => o.id !== p.id && o.collection === p.collection);
    p.gallery = [p.image, ...others.slice(0, 3).map((o) => o.image)];
  }
});

/** Accessories eligible as the "Buy 5, get 1 free" reward. */
export const giftAccessorySlugs = [
  "flex-band-set",
  "silk-eclipse-sleep-mask",
  "trigger-point-roller",
  "aroma-halo-diffuser",
] as const;
