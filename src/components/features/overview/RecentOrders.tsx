
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { type RecentOrder } from '@/types/dashboard.types';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecentOrdersProps {
    data: RecentOrder[];
}

// Mapping des statuts vers couleurs et labels
const ORDER_STATUS = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'En préparation', color: 'bg-purple-100 text-purple-800' },
    shipped: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
} as const;

type OrderStatus = keyof typeof ORDER_STATUS;

export const RecentOrders = ({ data }: RecentOrdersProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                    Commandes récentes
                </CardTitle>
                <Link to="/admin/orders">
                    <Button variant="ghost" size="sm" className="gap-2">
                        Voir tout
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Aucune commande récente
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.map((order) => {
                            const status = ORDER_STATUS[order.status as OrderStatus] || ORDER_STATUS.pending;

                            return (
                                <Link
                                    key={order.id}
                                    to={`/admin/orders/${order.id}`}
                                    className="block"
                                >
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {order.orderNumber}
                                                </p>
                                                <Badge className={cn('text-xs', status.color)}>
                                                    {status.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">
                                                {order.customerName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatPrice(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
