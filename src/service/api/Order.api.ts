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
    }, slugStore?: string): Promise<OrdersResponseDto> => {
        const { data } = await apiClient.get<OrdersResponseDto>(`/orders/dashboard/${slugStore}/all`, { params });
        return data;
    },

    updateStatus: async ({ orderId, status }: UpdateOrderStatusDto, slugStore?: string): Promise<Order> => {
        const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/dashboard/${slugStore}/${orderId}/status`, { status });
        return data.data;
    }
};