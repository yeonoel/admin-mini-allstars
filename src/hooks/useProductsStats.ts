import { dashboardApi } from "@/service/api/dashboard.api";
import { useQuery } from "@tanstack/react-query";

export const useProductsStats = () => {
    return useQuery({
        queryKey: ["product-stats"],
        queryFn: dashboardApi.getProductsStats,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    })
};