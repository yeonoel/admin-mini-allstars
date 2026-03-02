import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/service/api/products.api';
import type { CreateProductDto, CreateVariantDto } from '@/types/product.types';
import { useAuth } from './useAuth';
import { handleApiError, handleApiSuccess } from '@/utils/api-error';

export const useProducts = (params?: { page?: number; limit?: number; search?: string }) => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;

  return useQuery({
    queryKey: ['products', slugStore, params],
    queryFn: () => productsApi.getAll(params, slugStore),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  return useQuery({
    queryKey: ['products', id, slugStore],
    queryFn: () => productsApi.getById(id, slugStore),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => {
      if (!slugStore) throw new Error('Le slugStore est requis');
      return productsApi.create(data, slugStore)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', slugStore]
      });
      handleApiSuccess('Produit créé avec succès');
    },
    onError: (error: any) => handleApiError(error),
  });
};

export const useUpdateProduct = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      if (!slugStore) throw new Error("Slug store manquant");
      return productsApi.update(id, data, slugStore)
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['products', updatedProduct.id], updatedProduct)
      queryClient.invalidateQueries({ queryKey: ['products', slugStore] });
      handleApiSuccess('Produit modifié avec succès');
    },
    onError: (error: any) => handleApiError(error),
  });
};

export const useDeleteProduct = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!slugStore) throw new Error("Slug store manquant");
      return productsApi.delete(id, slugStore)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', slugStore]
      });
      handleApiSuccess('Produit supprimé avec succès');
    },
    onError: (error: any) => handleApiError(error),
  });
};

export const useCreateVariant = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVariantDto) => {
      if (!slugStore) throw new Error("Slug store manquant");
      return productsApi.addVariant(data, slugStore)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', slugStore]
      });
      handleApiSuccess('Variante ajoutée avec succès');
    },
    onError: (error: any) => handleApiError(error),
  });
};

export const useUpdateVariant = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, productId }: { id: string; data: Partial<CreateVariantDto>, productId: string }) => {
      if (!slugStore) throw new Error("Slug manquant");
      return productsApi.updateVariant(id, productId, data, slugStore)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', slugStore] });
      handleApiSuccess('Variante modifiée avec succès');
    },
    onError: (error: any) => handleApiError(error),
  });
};

export const useDeleteVariant = () => {
  const { user } = useAuth();
  const slugStore = user?.slugStore;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, productId }: { id: string, productId: string }) => {
      if (!slugStore) throw new Error("Slug manquant");
      return productsApi.deleteVariant(id, productId, slugStore)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', slugStore] });
      handleApiSuccess('Variante supprimée avec succès');
    },
    onError: (error: any) => handleApiError(error),
  });
};