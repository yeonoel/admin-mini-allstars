
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/service/api/dashboard.api';
import type { DashboardStatsDto } from '@/types/dashboard.types';
import { useAuth } from './useAuth';

export const useOverview = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore ?? "";
  return useQuery<DashboardStatsDto>({
    queryKey: ["overview", slugStore],
    queryFn: () => dashboardApi.getOverviewStats(slugStore!),
    enabled: !!slugStore,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}