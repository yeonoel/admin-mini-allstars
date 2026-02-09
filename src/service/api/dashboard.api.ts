
import type { DashboardStatsDto } from '@/types/dashboard.types';
import apiClient from './clients';
import type { ProductStats } from '@/types/products.types';

export const dashboardApi = {
  getOverviewStats: async (): Promise<DashboardStatsDto> => {
    const { data } = await apiClient.get<DashboardStatsDto>('/admin/overview');
    return data;
  },

  getProductsStats: async (): Promise<ProductStats> => {
    const {data} = await apiClient.get<ProductStats>('/products/admin/stats');
    return data;
  }
};


