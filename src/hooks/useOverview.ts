
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/service/api/dashboard.api';
import type { DashboardStatsDto } from '@/types/dashboard.types';

export const useOverview = () => {
  return useQuery<DashboardStatsDto>({
    queryKey: ["overview"],
    queryFn: dashboardApi.getOverviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false 
  })
}