import { storesApi } from "@/service/api/store.api";
import type { UpdateStoreData } from "@/types/UpdateStoreData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStore() {
    return useQuery({
        queryKey: ["store", "me"],
        queryFn: () => storesApi.getMe(),
        staleTime: 1000 * 60 * 5,
    });
}

import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function useUpdateStore() {
    const queryClient = useQueryClient();
    const { updateUser, user } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateStoreData }) =>
            storesApi.update(id, dto),
        onSuccess: (updatedStore) => {
            toast.success("Boutique mise à jour !");
            updateUser({
                slugStore: updatedStore.data.store.slug,
                logoStore: updatedStore.data.store.logoUrl,
            }); //sync localStorage + state
            console.log("updatedStore", updatedStore);
            queryClient.invalidateQueries({ queryKey: ["store", "me"] });
            if (updatedStore.data.store.logoUrl !== user?.slugStore) {
                navigate(`/dashboard/${updatedStore.data.store.slug}/boutique`);
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Erreur lors de la mise à jour");
        },
    });
}