import { useState } from 'react';
import type { OrderStatus } from '@/types/order-status';

interface PendingStatusChange {
    orderId: string;
    orderNumber: string;
    currentStatus: OrderStatus;
    newStatus: OrderStatus;
}

export function useStatusChangeConfirm(
    onConfirm: (orderId: string, newStatus: OrderStatus) => void
) {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingChange, setPendingChange] = useState<PendingStatusChange | null>(null);

    const requestStatusChange = (
        orderId: string,
        orderNumber: string,
        currentStatus: OrderStatus,
        newStatus: OrderStatus
    ) => {
        setPendingChange({ orderId, orderNumber, currentStatus, newStatus });
        setIsOpen(true);
    };

    const handleConfirm = () => {
        if (pendingChange) {
            onConfirm(pendingChange.orderId, pendingChange.newStatus);
            setIsOpen(false);
            setPendingChange(null);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setPendingChange(null);
    };

    return {
        isOpen,
        setIsOpen,
        pendingChange,
        requestStatusChange,
        handleConfirm,
        handleCancel
    };
}