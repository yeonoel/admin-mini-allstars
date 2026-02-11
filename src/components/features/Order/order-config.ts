import { OrderStatus } from "@/types/order-status"

export const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
    [OrderStatus.PENDING_PAYMENT]: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    [OrderStatus.PAID]: { label: "Payé", color: "bg-blue-100 text-blue-800" },
    [OrderStatus.CONFIRMED]: { label: "Confirmé", color: "bg-purple-100 text-purple-800" },
    [OrderStatus.PROCESSING]: { label: "Préparation", color: "bg-orange-100 text-orange-800" },
    [OrderStatus.SHIPPED]: { label: "Livraison", color: "bg-teal-100 text-teal-800" },
    [OrderStatus.DELIVERED]: { label: "Livré", color: "bg-green-100 text-green-800" },
    [OrderStatus.CANCELLED]: { label: "Annulé", color: "bg-red-100 text-red-800" },
    [OrderStatus.PAYMENT_FAILED]: { label: "Paiement échoué", color: "bg-red-100 text-red-800" },
    [OrderStatus.EXPIRED]: { label: "Expiré", color: "bg-gray-100 text-gray-800" },
};

export const StatusCanBeChanged = {
    [OrderStatus.PROCESSING]: { label: "Préparation", color: "bg-orange-100 text-orange-800" },
    [OrderStatus.SHIPPED]: { label: "Livraison", color: "bg-teal-100 text-teal-800" },
    [OrderStatus.DELIVERED]: { label: "Livré", color: "bg-green-100 text-green-800" },
    [OrderStatus.CANCELLED]: { label: "Annulé", color: "bg-red-100 text-red-800" },
};

export const filterButtons = [
    { label: "Tous", status: null },
    { label: "En attente", status: OrderStatus.PENDING_PAYMENT, color: "bg-yellow-100 text-yellow-800" },
    { label: "Confirmé", status: OrderStatus.CONFIRMED, color: "bg-purple-100 text-purple-800" },
    { label: "Expédié", status: OrderStatus.SHIPPED, color: "bg-teal-100 text-teal-800" },
    { label: "Livré", status: OrderStatus.DELIVERED, color: "bg-green-100 text-green-800" },
];