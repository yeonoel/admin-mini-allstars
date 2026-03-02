import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/service/api/Order.api';
import type { OrdersResponseDto } from '@/types/order.type';
import type { OrderStatus } from '@/types/order-status';
import { dateFilters } from '@/lib/date-filters';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { handleApiError, handleApiSuccess } from '@/utils/api-error';

// Type de filtre de date
type DateFilterType = 'today' | 'week' | 'month' | null;

export const useOrder = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  const queryClient = useQueryClient();

  // --------------------------
  // États pour filtres
  // --------------------------
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --------------------------
  // Query backend pour récupérer les commandes
  // --------------------------
  const ordersQuery = useQuery<OrdersResponseDto>({
    queryKey: ["orders", slugStore, dateFilter],
    queryFn: () => {
      const params: any = {};
      if (dateFilter === 'today') params.date = dateFilters.today();
      else if (dateFilter === 'week') params.date = dateFilters.thisWeek();
      else if (dateFilter === 'month') params.date = dateFilters.thisMonth();
      return ordersApi.getAll(params, slugStore);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!slugStore, // ne fetch que si store exist
  });

  // --------------------------
  // Filtrage frontend pour statut + recherche
  // --------------------------
  const filteredOrders = useMemo(() => {
    let orders = ordersQuery.data?.data?.items || [];

    if (statusFilter) {
      orders = orders.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      orders = orders.filter(order => {
        const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesCustomerName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(query);
        const matchesPhone = order.user.phone.replace(/\s/g, '').includes(query.replace(/\s/g, ''));
        return matchesOrderNumber || matchesCustomerName || matchesPhone;
      });
    }

    return orders;
  }, [ordersQuery.data, statusFilter, searchQuery]);

  // --------------------------
  // Compteur de filtres actifs
  // --------------------------
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (dateFilter) count++;
    if (statusFilter) count++;
    if (searchQuery) count++;
    return count;
  }, [dateFilter, statusFilter, searchQuery]);

  const resetFilters = () => {
    setDateFilter(null);
    setStatusFilter(null);
    setSearchQuery('');
  };

  // --------------------------
  // Mutation pour update le statut avec optimistic update
  // --------------------------
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!slugStore) throw new Error("Slug store requis");
      return ordersApi.updateStatus({ orderId, status }, slugStore);
    },
    onMutate: async ({ orderId, status: newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["orders", slugStore, dateFilter] });
      const previousOrders = queryClient.getQueryData<OrdersResponseDto>(["orders", slugStore, dateFilter]);

      // Optimistic update
      if (previousOrders) {
        queryClient.setQueryData<OrdersResponseDto>(["orders", slugStore, dateFilter], {
          ...previousOrders,
          data: {
            ...previousOrders.data,
            items: previousOrders.data.items.map(order =>
              order.id === orderId ? { ...order, status: newStatus } : order
            ),
          },
        });
      }

      return { previousOrders };
    },
    onError: (error, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders", slugStore, dateFilter], context.previousOrders);
      }
      handleApiError(error);
      console.error("Erreur update status:", error);
    },
    onSuccess: () => {
      handleApiSuccess("Statut mis à jour avec succès");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", slugStore, dateFilter] });
    },
  });

  // --------------------------
  // Retour de tous les helpers
  // --------------------------
  return {
    orders: filteredOrders,
    allOrders: ordersQuery.data?.data?.items || [],
    totalCount: ordersQuery.data?.data?.items?.length || 0,
    filteredCount: filteredOrders.length,

    // États de chargement
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,

    // Filtres
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    activeFiltersCount,
    resetFilters,

    // Mutation
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};