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

interface ConfirmStatusChangeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string;
    currentStatus: string;
    newStatus: string;
    onConfirm: () => void;
}

export function ConfirmStatusChangeDialog({
    open,
    onOpenChange,
    orderId,
    currentStatus,
    newStatus,
    onConfirm,
}: ConfirmStatusChangeDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmer le changement de statut
                    </AlertDialogTitle>

                    <AlertDialogDescription className="space-y-2">
                        <p>
                            Vous êtes sur le point de modifier le statut de la commande :
                        </p>

                        <p className="font-semibold">
                            #{orderId}
                        </p>

                        <p>
                            <span className="text-muted-foreground">De :</span>{" "}
                            <span className="font-medium">{currentStatus}</span>
                        </p>

                        <p>
                            <span className="text-muted-foreground">Vers :</span>{" "}
                            <span className="font-medium text-blue-600">
                                {newStatus}
                            </span>
                        </p>

                        <p className="text-red-600 font-medium">
                            Cette action peut être irréversible.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Confirmer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
