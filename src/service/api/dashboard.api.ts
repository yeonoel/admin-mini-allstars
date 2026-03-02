
import type { DashboardStatsDto } from '@/types/dashboard.types';
import apiClient from './clients';
import type { ProductStats } from '@/types/product.types';

export const dashboardApi = {
  getOverviewStats: async (slugStore: string): Promise<DashboardStatsDto> => {
    const { data } = await apiClient.get<DashboardStatsDto>(`/dashboard/${slugStore}/overview`);
    return data;
  },

  getProductsStats: async (slugStore: string): Promise<ProductStats> => {
    const { data } = await apiClient.get<ProductStats>(`dashboard/${slugStore}/products/stats`);
    return data;
  }
};


