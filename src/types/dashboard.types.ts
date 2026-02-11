import type { OrderStatus } from "./order-status";

export interface PercentageChange {
  percentage: number;
  isPositive: boolean;
  label: string;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  orders: number;
  label?: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
  category?: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  lowStockThreshold: number;
  image?: string;
}

/*export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  
  revenueChange: PercentageChange;
  ordersChange: PercentageChange;
  productsChange: PercentageChange;
  customersChange: PercentageChange;
  
  revenueByMonth: RevenueByMonth[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
} */

export interface PercentageChangeDto {
  percentage: number;      // +12.5 ou -5.3
  isPositive: boolean;     // true si augmentation
  label: string;           // "vs mois dernier"
}


// Dashboard Types
export interface DashboardStatsDto {
    salesToday: number;
    salesThisMonth: number;
    totalRevenue: number;
    pendingDeliveries: number;
    outOfStockProducts: number;
    revenueChange: PercentageChangeDto;
}

// Product Types
export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    sku?: string;
    stockQuantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
    isActive: boolean;
    isDeleted: boolean;
    isFeatured: boolean;
    category?: Category;
    metaTitle?: string;
    metaDescription?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    createdAt: Date;
    updatedAt: Date;
    images: ProductImage[];
    variants: ProductVariant[];
    
    // Computed properties
    isOnSale: boolean;
    discountPercentage: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
    availabledQuantity: number;
}

export interface ProductImage {
    id: string;
    url: string;
    altText?: string;
    position: number;
}

export interface ProductVariant {
    id: string;
    product: Product;
    name: string;
    sku?: string;
    color?: string;
    size?: string;
    material?: string;
    price?: number;
    stockQuantity: number;
    reservedQuantity: number;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    
    // Computed
    availabledQuantity: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export const PaymentStatus = {
    PENDING_PAYMENT: 'pending_payment',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
} as const;

// Pour le type
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface Order {
    id: string;
    orderNumber: string;
    user: User;
    payments: Payment[];
    shipments: Shipment[];
    items: OrderItem[];
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    couponCode?: string | null;
    shippingAddress?: Address;
    billingAddress?: Address;
    shippingAddressSnapshot?: Record<string, any>;
    billingAddressSnapshot?: Record<string, any>;
    customerNote?: string;
    adminNote?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date | null;
    paidAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
}

export interface OrderItem {
    id: string;
    product: Product;
    variant?: ProductVariant;
    quantity: number;
    price: number;
    total: number;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface Address {
    id: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}

export interface Payment {
    id: string;
    amount: number;
    status: PaymentStatus;
    createdAt: Date;
}

export interface Shipment {
    id: string;
    trackingNumber?: string;
    status: string;
    createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Form Types
export interface CreateProductDto {
    name: string;
    shortDescription?: string;
    price: number;
    images: string[];
}

export interface CreateVariantDto {
    productId: string;
    color?: string;
    size?: string;
    stockQuantity: number;
    sku?: string;
}

export interface UpdateOrderStatusDto {
    orderId: string;
    status: OrderStatus;
}