
export interface LowStockProduct {
  id: string;
  name: string;
  stockQuantity: number;
  lowStockThreshold: number;
  image?: string;
  category?: string;
}

export interface OutOfStockProduct {
  id: string;
  name: string;
  category?: string;
  image?: string;
}

export interface ProductStats {
  totalProducts: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  lowStockProducts: LowStockProduct[];
  outOfStockProducts: OutOfStockProduct[];
  activeProducts: number;
  inactiveProducts: number;
  featuredProducts: number;
  totalVariants: number;
}
