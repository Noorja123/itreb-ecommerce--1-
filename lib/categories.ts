/**
 * A central list of product categories.
 * Using 'as const' makes this a read-only tuple of string literals,
 * which is great for type safety.
 */
export const CATEGORIES = [
  "Books & Media",
  "Apparel",
  "Collectibles",
  "General",
] as const;

/**
 * A TypeScript type derived from the array.
 * This will be "Books & Media" | "Apparel" | "Collectibles" | "General".
 */
export type Category = typeof CATEGORIES[number];