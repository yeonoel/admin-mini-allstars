export const  OrderStatus = {
    PAID : 'paid',
    PENDING_PAYMENT : 'pending_payment',
    CONFIRMED : 'confirmed',
    PAYMENT_FAILED : 'payment_failed',
    EXPIRED : 'expired',
    PROCESSING : 'processing',
    SHIPPED : 'shipped',
    DELIVERED : 'delivered',
    CANCELLED : 'cancelled',
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]