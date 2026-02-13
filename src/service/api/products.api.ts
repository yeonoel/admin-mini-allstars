import apiClient from './clients';
import type { ApiResponse, Product, CreateProductDto, CreateVariantDto, ProductVariant } from '@/types/product.types';

export const productsApi = {
  // Produits
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    return data; // ✅ Retourne { success, data, meta }
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data; // OK - pour un produit unique
  },

  create: async (productData: CreateProductDto) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('shortDescription', productData.shortDescription);
    formData.append('price', productData.price.toString());
    formData.append('stockQuantity', productData.stockQuantity.toString());

    // Ajouter les images
    productData.images.forEach((image) => {
      formData.append('images', image);
    });

    const { data } = await apiClient.post<ApiResponse<Product>>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data; // OK - retourne juste le produit créé
  },

  // ⭐ CORRECTION ICI
  update: async (id: string, productData: Partial<Product> & { newImages?: File[]; imagesToDelete?: string[] }) => {
    const formData = new FormData();

    // Ajouter les champs texte
    if (productData.name) formData.append('name', productData.name);
    if (productData.shortDescription) formData.append('shortDescription', productData.shortDescription);
    if (productData.price) formData.append('price', productData.price.toString());
    if (productData.stockQuantity !== undefined) formData.append('stockQuantity', productData.stockQuantity.toString());

    // Ajouter les nouvelles images
    if (productData.newImages && productData.newImages.length > 0) {
      productData.newImages.forEach((image) => {
        formData.append('newImages', image);
      });
    }

    // Ajouter les IDs des images à supprimer
    if (productData.imagesToDelete && productData.imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(productData.imagesToDelete));
    }
    formData.forEach((value, key) => {
      console.log(`FormData - ${key}:`, value);
    });

    const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // ✅ CHANGEMENT: Retourner data.data (le produit) comme create()
    // Cela permet aux hooks de recevoir directement le produit
    return data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },

  // Variantes
  addVariant: async (variant: CreateVariantDto) => {
    const { productId, ...variantData } = variant;
    const { data } = await apiClient.post<ApiResponse<ProductVariant>>(
      `/product-variants/${productId}/variants`,
      variantData
    );
    return data.data;
  },

  updateVariant: async (id: string, variant: Partial<ProductVariant>) => {
    const { data } = await apiClient.patch<ApiResponse<ProductVariant>>(
      `/product-variants/${id}`,
      variant
    );
    return data.data;
  },

  deleteVariant: async (id: string) => {
    await apiClient.delete(`/product-variants/${id}`);
  },
};