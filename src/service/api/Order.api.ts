import type { ApiResponse } from "@/types";
import apiClient from "./clients";
import type { Order, UpdateOrderStatusDto } from "@/types/dashboard.types";

export const ordersApi = {
    getAll: async (params?: { 
        page?: number; 
        limit?: number; 
        status?: string;
        search?: string;
        date?: string;
    }) => {
        const { data } = await apiClient.get<ApiResponse<Order[]>>('/orders', { params });
        return data;
    },
    
    getById: async (id: string): Promise<Order> => {
        const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
        return data.data;
    },
    
    updateStatus: async ({ orderId, status }: UpdateOrderStatusDto): Promise<Order> => {
        const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
        return data.data;
    },
};