
export const CATEGORIES = [
  "Tasbih",
  "Photo",
  "Books",
  "CD",
] as const;


export type Category = typeof CATEGORIES[number];