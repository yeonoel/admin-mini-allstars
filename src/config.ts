export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const STOREFRONT_URL =
  import.meta.env.VITE_STOREFRONT_URL || "http://localhost:3001";
export const getStoreUrl = (slug: string) => `${STOREFRONT_URL}/${slug}`;

console.log(" Environment:", import.meta.env.MODE);
