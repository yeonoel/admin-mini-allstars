import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function OrdersEmpty() {
    return (
        <Card className="border-2 border-dashed">
            <CardContent className="p-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-gray-100">
                        <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                            Aucune commande
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Vous n'avez pas encore de commandes.
                            Les nouvelles commandes apparaîtront ici.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}