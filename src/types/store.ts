export interface StoreData {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    whatsappNumber?: string;
    storeUrl?: string;
    status: "active" | "suspended" | "pending";
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    owner: {
        id: string;
        firstName?: string;
        lastName?: string;
        phone: string;
        role: string;
    };
}