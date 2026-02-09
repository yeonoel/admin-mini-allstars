import type { ApiResponse, Product } from "@/types";
import apiClient from "./clients";
import type { CreateProductDto, CreateVariantDto } from "@/types/dashboard.types";

// Products API
export const productsApi = {
    getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
        const { data } = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
        return data;
    },
    
    getById: async (id: string): Promise<Product> => {
        const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
        return data.data;
    },
    
    create: async (product: CreateProductDto): Promise<Product> => {
        const { data } = await apiClient.post<ApiResponse<Product>>('/products', product);
        return data.data;
    },
    
    update: async (id: string, product: Partial<Product>): Promise<Product> => {
        const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, product);
        return data.data;
    },
    
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    },
    
    // Variants
    addVariant: async (variant: CreateVariantDto) => {
        const { data } = await apiClient.post<ApiResponse<any>>('/product-variants', variant);
        return data.data;
    },
    
    updateVariant: async (id: string, variant: Partial<CreateVariantDto>) => {
        const { data } = await apiClient.patch<ApiResponse<any>>(`/product-variants/${id}`, variant);
        return data.data;
    },
    
    deleteVariant: async (id: string): Promise<void> => {
        await apiClient.delete(`/product-variants/${id}`);
    },
};