import apiClient from './clients';
import type { ApiResponse, Product, CreateProductDto, CreateVariantDto, ProductVariant } from '@/types/product.types';

export const productsApi = {

  // Produits
  getAll: async (params?: { page?: number; limit?: number; search?: string }, slugStore?: string) => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(`/${slugStore}/products`, { params });
    return data; // ✅ Retourne { success, data, meta }
  },

  getById: async (id: string, slugStore?: string) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/${slugStore}/products/${id}`);
    return data.data;
  },

  create: async (productData: CreateProductDto, slugStore?: string) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('shortDescription', productData.shortDescription);
    formData.append('price', productData.price.toString());
    formData.append('stockQuantity', productData.stockQuantity.toString());

    // Ajouter les images
    productData.images.forEach((image) => {
      formData.append('images', image);
    });

    const { data } = await apiClient.post<ApiResponse<Product>>(`/${slugStore}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  update: async (id: string, productData: Partial<Product> & { newImages?: File[]; imagesToDelete?: string[] }, slugStore?: string,) => {
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

    const { data } = await apiClient.patch<ApiResponse<Product>>(`/${slugStore}/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    //CHANGEMENT: Retourner data.data (le produit) comme create()
    // Cela permet aux hooks de recevoir directement le produit
    return data.data;
  },

  delete: async (id: string, slugStore?: string) => {
    await apiClient.delete(`/${slugStore}/products/${id}`);
  },

  // Variantes
  addVariant: async (variant: CreateVariantDto, slugStore?: string) => {
    const { productId, ...variantData } = variant;
    const { data } = await apiClient.post<ApiResponse<ProductVariant>>(
      `/${slugStore}/product-variants/${productId}/variants`,
      variantData
    );
    return data.data;
  },

  updateVariant: async (idVariante: string, productId: string, variant: Partial<ProductVariant>, slugStore?: string) => {
    const { data } = await apiClient.patch<ApiResponse<ProductVariant>>(
      `/${slugStore}/product-variants/${productId}/variants/${idVariante}`,
      variant
    );
    return data.data;
  },

  deleteVariant: async (id: string, productId: string, slugStore?: string) => {
    await apiClient.delete(`/${slugStore}/product-variants/${productId}/variants/${id}`);
  },
};