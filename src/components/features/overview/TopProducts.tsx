
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package } from 'lucide-react';
import { type TopProduct } from '@/types/dashboard.types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TopProductsProps {
    data: TopProduct[];
    limit?: number; // Nombre de produits à afficher (défaut: 4)
}

export const TopProducts = ({ data, limit = 4 }: TopProductsProps) => {
    const displayData = data.slice(0, limit);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Produits les plus vendus
                </CardTitle>
            </CardHeader>
            <CardContent>
                {displayData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Aucun produit vendu
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayData.map((product, index) => {
                            // Calculer le rang (médaille pour top 3)
                            const rank = index + 1;
                            const isTopThree = rank <= 3;

                            return (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {/* Rang */}
                                    <div
                                        className={cn(
                                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                                            isTopThree
                                                ? rank === 1
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : rank === 2
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : 'bg-orange-100 text-orange-700'
                                                : 'bg-gray-50 text-gray-600'
                                        )}
                                    >
                                        {rank}
                                    </div>

                                    {/* Image produit */}
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                                            <Package className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Infos produit */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {product.name}
                                        </p>
                                        {product.category && (
                                            <p className="text-xs text-gray-500">
                                                {product.category}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-600">
                                                {product.sales} unités
                                            </span>
                                            <span className="text-xs font-medium text-gray-900">
                                                {formatPrice(product.revenue)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Icône trend (optionnel - peut être calculé côté backend) */}
                                    <div className="flex-shrink-0">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
