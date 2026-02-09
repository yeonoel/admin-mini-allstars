
import { useOverview } from '@/hooks/useOverview';
import { StatCard } from '@/components/features/StatCard';
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RevenueChart } from '@/components/features/overview/RevenueChart';
import { SalesCategoryChart } from '@/components/features/overview/SalesCategoryChart';
import { RecentOrders } from '@/components/features/overview/RecentOrders';
import { TopProducts } from '@/components/features/overview/TopProducts';

export default function Overview() {
    const { data, isLoading, error, refetch } = useOverview();
    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>

                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>

                {/* Lists Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }
    // Error state
    if (error) {
        return (
            <div>
                <Alert variant="destructive">
                    <AlertDescription>
                        Erreur lors du chargement des statistiques.
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="ml-4"
                        >
                            Réessayer
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) return null;
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Chiffre d'affaires"
                    value={formatPrice(data.totalRevenue)}
                    icon={TrendingUp}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                    change={data.revenueChange}
                />

                <StatCard
                    title="Commandes"
                    value={data.totalOrders.toLocaleString('fr-FR')}
                    icon={ShoppingCart}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                    change={data.ordersChange}
                />

                <StatCard
                    title="Produits"
                    value={data.totalProducts.toLocaleString('fr-FR')}
                    icon={Package}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    change={data.productsChange}
                />

                <StatCard
                    title="Clients"
                    value={data.totalCustomers.toLocaleString('fr-FR')}
                    icon={Users}
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                    change={data.customersChange}
                />
            </div>

            {/* Section supplémentaire (optionnelle) */}
            {data.lowStockProducts.length > 0 && (
                <Alert className="mt-6">
                    <AlertDescription>
                        ⚠️ <strong>{data.lowStockProducts.length} produit(s)</strong> en stock faible
                    </AlertDescription>
                </Alert>
            )}

            {/* Charts - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={data.revenueByMonth} />
                <SalesCategoryChart data={data.topProducts} />
            </div>

            {/* Recent Orders & Top Products - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders data={data.recentOrders} />
                <TopProducts data={data.topProducts} limit={5} />
            </div>
        </div>
    );
}
