import type { ApiResponse } from "@/types";
import apiClient from "./clients";
import type { Order, UpdateOrderStatusDto } from "@/types/dashboard.types";
import { type OrdersResponseDto } from "@/types/order.type";

export const ordersApi = {
    getAll: async (params?: { 
        page?: number; 
        limit?: number; 
        status?: string;
        search?: string;
        date?: string;
    }): Promise<OrdersResponseDto> => {
        const { data } = await apiClient.get<OrdersResponseDto>('/orders/admin/all', { params });
        return data;
    },
    
    getById: async (id: string): Promise<Order> => {
        const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
        return data.data;
    },
    
    updateStatus: async ({ orderId, status }: UpdateOrderStatusDto): Promise<Order> => {   
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/admin/${orderId}/status`, { status });
    return data.data;
}
};