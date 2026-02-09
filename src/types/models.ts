export type UserRole = "admin" | "customer";
export type ProductStatus = "active" | "draft" | "archived";
export type CustomerStatus = "active" | "blocked";
export type PaymentMethod = "card" | "mobile_money" | "cash_on_delivery";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}


export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  name: string;         
  sku?: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  status: ProductStatus;
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpent: number;
  joinDate: string;
  status: CustomerStatus;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number;
}

