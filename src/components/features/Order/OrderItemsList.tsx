import { Package, Box } from "lucide-react";
import type { OrderItemDto } from "@/types/order.type";

interface OrderItemsListProps {
    items: OrderItemDto[];
    compact?: boolean;
}

export function OrderItemsList({ items, compact = false }: OrderItemsListProps) {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(parseFloat(amount)) + ' FCFA';
    };

    if (compact) {
        // Vue compacte pour mobile (liste simple)
        return (
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2 text-sm">
                        <Box className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                                {item.productName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{item.variantName}</span>
                                <span>•</span>
                                <span>Qté: {item.quantity}</span>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-900 whitespace-nowrap">
                            {formatCurrency(item.totalPrice)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    // Vue détaillée pour desktop (tableau)
    return (
        <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Produit
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Variante
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Qté
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                            Prix unitaire
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">
                                        {item.productName}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {item.variantName}
                            </td>
                            <td className="px-4 py-3 text-center font-semibold text-gray-900">
                                {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                                {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                {formatCurrency(item.totalPrice)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}