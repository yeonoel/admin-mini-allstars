import { OrderStatus } from "@/types/order-status"

export const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
    [OrderStatus.PENDING_CONFIRMATION]: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    [OrderStatus.CONFIRMED_BY_CLIENT]: { label: "Validé", color: "bg-purple-100 text-purple-800" },
    [OrderStatus.CONFIRMED_BY_SELLER]: { label: "Approuvé", color: "bg-purple-100 text-purple-800" },
    [OrderStatus.DELIVERED]: { label: "Livré", color: "bg-green-100 text-green-800" },
    [OrderStatus.CANCELLED]: { label: "Annulé", color: "bg-red-100 text-red-800" },
};

export const StatusCanBeChanged = {
    [OrderStatus.CONFIRMED_BY_SELLER]: { label: "Approuvé", color: "bg-teal-100 text-teal-800" },
    [OrderStatus.DELIVERED]: { label: "Livré", color: "bg-green-100 text-green-800" },
    [OrderStatus.CANCELLED]: { label: "Annulé", color: "bg-red-100 text-red-800" },
};

export const filterButtons = [
    { label: "Tous", status: null },
    { label: "En attente", status: OrderStatus.PENDING_CONFIRMATION, color: "bg-yellow-100 text-yellow-800" },
    { label: "Validé", status: OrderStatus.CONFIRMED_BY_CLIENT, color: "bg-purple-100 text-purple-800" },
    { label: "Approuvé", status: OrderStatus.CONFIRMED_BY_SELLER, color: "bg-teal-100 text-teal-800" },
    { label: "Livré", status: OrderStatus.DELIVERED, color: "bg-green-100 text-green-800" },
];