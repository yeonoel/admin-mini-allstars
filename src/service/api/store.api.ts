import type { CreateStoreDto } from "@/types/createStore";
import apiClient from "./clients";
import type { CreateStoreResponse } from "@/types/CreateStoreResponse";
import { normalizePhone } from "@/lib/utils";
import type { StoreData } from "@/types/store";
import type { UpdateStoreData } from "@/types/UpdateStoreData";


export const storesApi = {
    create: async (dto: CreateStoreDto): Promise<CreateStoreResponse> => {
        try {
            const formData = new FormData();
            formData.append("name", dto.name);
            formData.append("whatsappNumber", dto.whatsappNumber);
            formData.append("vendorName", dto.vendorName);
            formData.append("password", dto.password);
            if (dto.description) formData.append("description", dto.description);
            if (dto.logo) formData.append("logo", dto.logo);

            const { data } = await apiClient.post<CreateStoreResponse>("/stores/create", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return data;
        } catch (error) {
            console.error("[Store API] Erreur lors de la création:", error);
            console.log(error);
            throw error;
        }
    },

    getMe: async (): Promise<StoreData> => {
        const { data } = await apiClient.get<StoreData>("/stores/me");
        return data;
    },

    update: async (id: string, dto: UpdateStoreData): Promise<CreateStoreResponse> => {
        const formData = new FormData();
        if (dto.name) formData.append("name", dto.name);
        if (dto.whatsappNumber) formData.append("whatsappNumber", normalizePhone(dto.whatsappNumber));
        if (dto.description !== undefined) formData.append("description", dto.description ?? "");
        if (dto.logo) formData.append("logo", dto.logo);
        const { data } = await apiClient.patch<CreateStoreResponse>(`/stores/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

};