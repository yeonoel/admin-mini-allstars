
import { useProductsStats } from '@/hooks/useProductsStats';
import { StatCard } from '@/components/features/StatCard';
import { Package, DollarSign, AlertTriangle, XCircle } from 'lucide-react';
import { formatPrice, formatNumber } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Products() {
    const { data: stats, isLoading, error } = useProductsStats();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Produits</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">Produits</h1>
                <Alert variant="destructive">
                    <AlertDescription>
                        Erreur lors du chargement des statistiques produits.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    if (!stats) return;
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    + Ajouter un produit
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Produits"
                    value={formatNumber(stats.totalProducts)}
                    icon={Package}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <StatCard
                    title="Valeur du Stock"
                    value={formatPrice(stats.inventoryValue)}
                    icon={DollarSign}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />

                <StatCard
                    title="Stock Faible"
                    value={formatNumber(stats.lowStockCount)}
                    icon={AlertTriangle}
                    iconBg="bg-yellow-100"
                    iconColor="text-yellow-600"
                />

                <StatCard
                    title="Rupture de Stock"
                    value={formatNumber(stats.outOfStockCount)}
                    icon={XCircle}
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
            </div>

            {/* Alertes */}
            {stats.lowStockCount > 0 && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>{stats.lowStockCount} produit(s)</strong> en stock faible
                    </AlertDescription>
                </Alert>
            )}

            {stats.outOfStockCount > 0 && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>{stats.outOfStockCount} produit(s)</strong> en rupture de stock
                    </AlertDescription>
                </Alert>
            )}

            {/* Tableau produits à ajouter ici (Jour 2) */}
        </div>
    );
}