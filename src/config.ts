export const API_URL = import.meta.env.vite_API_URL || 'http://localhost:3000/api';

const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173';
export const getStoreUrl = (slug: string) => `${STOREFRONT_URL}/${slug}`;

console.log(' Environment:', import.meta.env.MODE);