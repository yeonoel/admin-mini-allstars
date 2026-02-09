
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/service/api/dashboard.api';
import type { DashboardStats } from '@/types/dashboard.types';

export const useOverview = () => {
  return useQuery<DashboardStats>({
    queryKey: ["overview"],
    queryFn: dashboardApi.getOverviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false 
  })
}