import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "./order-config";
import type { OrderStatus } from "@/types/order-status";

interface StatusChangeConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    orderNumber: string;
    currentStatus: OrderStatus;
    newStatus: OrderStatus;
    isLoading?: boolean;
}

export function StatusChangeConfirmDialog({
    isOpen,
    onOpenChange,
    onConfirm,
    orderNumber,
    currentStatus,
    newStatus,
    isLoading = false
}: StatusChangeConfirmDialogProps) {
    const currentConfig = statusConfig[currentStatus];
    const newConfig = statusConfig[newStatus];

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer le changement de statut</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                        <p>
                            Voulez-vous vraiment modifier le statut de la commande{" "}
                            <span className="font-semibold text-gray-900">{orderNumber}</span> ?
                        </p>

                        <div className="flex items-center justify-center gap-4 py-4">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-gray-500">Statut actuel</span>
                                <Badge className={currentConfig.color}>
                                    {currentConfig.label}
                                </Badge>
                            </div>

                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>

                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-gray-500">Nouveau statut</span>
                                <Badge className={newConfig.color}>
                                    {newConfig.label}
                                </Badge>
                            </div>
                        </div>

                        {/* Messages contextuels selon le statut */}
                        {getStatusChangeMessage(newStatus)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-gray-900 hover:bg-gray-800"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Modification...
                            </>
                        ) : (
                            'Confirmer'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Messages contextuels selon le statut
function getStatusChangeMessage(status: OrderStatus) {
    const messages: Partial<Record<OrderStatus, { text: string; type: 'info' | 'warning' | 'success' }>> = {
        shipped: {
            text: "Le client sera notifié que sa commande a été expédiée.",
            type: 'info'
        },
        delivered: {
            text: "Cette action confirmera que le client a bien reçu sa commande.",
            type: 'success'
        },
        cancelled: {
            text: "⚠️ Cette action annulera définitivement la commande.",
            type: 'warning'
        },
        processing: {
            text: "La commande passera en cours de préparation.",
            type: 'info'
        }
    };

    const message = messages[status];
    if (!message) return null;

    const bgColors = {
        info: 'bg-blue-50 border-blue-200 text-blue-700',
        warning: 'bg-orange-50 border-orange-200 text-orange-700',
        success: 'bg-green-50 border-green-200 text-green-700'
    };

    return (
        <div className={`p-3 rounded-lg border text-sm ${bgColors[message.type]}`}>
            {message.text}
        </div>
    );
}