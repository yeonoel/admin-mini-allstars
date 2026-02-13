
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


//"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
// 


export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  sku: string;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  color: string | null;
  size: string | null;
  material: string | null;
  price: string;
  stockQuantity: number;
  reservedQuantity: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  shortDescription: string;
  price: number;
  stockQuantity: number;
  images: File[];
}

export interface CreateVariantDto {
  productId: string;
  name: string;
  size: string;
  color: string;
  stockQuantity: number;
}

export interface UpdateProductDto {
  name: string;
  shortDescription: string;
  price: number;
  stockQuantity: number;
  newImages?: File[];
  imagesToDelete?: string[];
}


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
