
import apiClient from './clients';
import type { DashboardStats } from '../../types/dashboard.types';
import type { ProductStats } from '@/types/products.types';

export const dashboardApi = {
  getOverviewStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>('/admin/overview');
    return data;
  },

  getProductsStats: async (): Promise<ProductStats> => {
    const {data} = await apiClient.get<ProductStats>('/products/admin/stats');
    return data;
  }
};