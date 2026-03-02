export const OrderStatus = {
    PENDING_CONFIRMATION: "pending_confirmation",
    CONFIRMED_BY_CLIENT: "confirmed_by_client",
    CONFIRMED_BY_SELLER: "confirmed_by_seller",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]