export interface CreateStoreResponse {
    success: boolean;
    message: string;
    data: {
        store: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string;
        };
        user: {
            id: string;
            phone: string;
            firstName?: string;
        };
    };
}