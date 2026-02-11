import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/service/api/Order.api';
import type { OrdersResponseDto } from '@/types/order.type';
import type { OrderStatus } from '@/types/order-status';
import { dateFilters } from '@/lib/date-filters';
import toast from 'react-hot-toast';

type DateFilterType = 'today' | 'week' | 'month' | null;

export const useOrder = () => {
  const queryClient = useQueryClient();
  
  // BACKEND filter (heavy) - Réduit la quantité de données
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null);
  
  // FRONTEND filters (light) - Filtrage instantané
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Query avec filtre de date uniquement
  const ordersQuery = useQuery<OrdersResponseDto>({
    queryKey: ["orders", dateFilter],
    queryFn: () => {
      const params: any = {};
      
      // Conversion du filtre de date en paramètre API
      if (dateFilter === 'today') {
        params.date = dateFilters.today();
      } else if (dateFilter === 'week') {
        params.date = dateFilters.thisWeek();
      } else if (dateFilter === 'month') {
        params.date = dateFilters.thisMonth();
      }
      
      return ordersApi.getAll(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Filtrage côté FRONTEND pour status et search (instantané)
  const filteredOrders = useMemo(() => {
    let result = ordersQuery.data?.data?.items || [];
    
    // Filtre par statut
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(order => {
        const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesCustomerName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(query);
        const matchesPhone = order.user.phone.replace(/\s/g, '').includes(query.replace(/\s/g, ''));
        
        return matchesOrderNumber || matchesCustomerName || matchesPhone;
      });
    }
    
    return result;
  }, [ordersQuery.data, statusFilter, searchQuery]);

  // Compteur de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (dateFilter) count++;
    if (statusFilter) count++;
    if (searchQuery) count++;
    return count;
  }, [dateFilter, statusFilter, searchQuery]);

  // Reset tous les filtres
  const resetFilters = () => {
    setDateFilter(null);
    setStatusFilter(null);
    setSearchQuery('');
  };

  // ✏️ Mutation pour mise à jour du statut
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => 
      ordersApi.updateStatus({ orderId, status }),
    
    onMutate: async ({ orderId, status: newStatus }) => {
      // Annuler les queries en cours
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      // Sauvegarder l'ancien état
      const previousOrders = queryClient.getQueryData<OrdersResponseDto>(
        ["orders", dateFilter]
      );

      // Mise à jour optimiste
      if (previousOrders) {
        queryClient.setQueryData<OrdersResponseDto>(
          ["orders", dateFilter],
          {
            ...previousOrders,
            data: {
              ...previousOrders.data,
              items: previousOrders.data.items.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
              )
            }
          }
        );
      }

      return { previousOrders };
    },

    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousOrders) {
        queryClient.setQueryData(
          ["orders", dateFilter], 
          context.previousOrders
        );
      }
      toast.error("Impossible de mettre à jour le statut");
      console.error('Update status error:', error);
    },

    onSuccess: () => {
      toast.success("Statut mis à jour avec succès");
    },

    onSettled: () => {
      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });

  return {
    // Données filtrées
    orders: filteredOrders,
    allOrders: ordersQuery.data?.data?.items || [], // Toutes les commandes non filtrées
    totalCount: ordersQuery.data?.data?.items?.length || 0,
    filteredCount: filteredOrders.length,
    
    // États de chargement
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,

    // Filtres backend
    dateFilter,
    setDateFilter,
    
    // Filtres frontend
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    
    // Helpers
    activeFiltersCount,
    resetFilters,

    // Mutations
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};