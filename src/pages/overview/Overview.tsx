import { StatCard } from "@/components/features/StatCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverview } from "@/hooks/useOverview";
import { formatPrice } from "@/lib/utils";
import { DollarSign, TrendingUp, ShoppingBag, AlertCircle, TrendingDown } from "lucide-react";


export default function Overview() {
    const { data, isLoading, error, refetch } = useOverview();
    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
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
    const stats = data;

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <p className="text-sm text-gray-500">Vue d'ensemble de votre activité</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Ventes du jour"
                    value={formatPrice(stats.salesToday)}
                    icon={<DollarSign className="w-6 h-6 text-white" />}
                    iconBgColor="bg-green-500"
                />
                <StatCard
                    title="Ventes du mois"
                    value={formatPrice(stats.salesThisMonth)}
                    icon={<TrendingUp className="w-6 h-6 text-white" />}
                    iconBgColor="bg-blue-600"
                />
                <StatCard
                    title="Commandes à livrer"
                    value={stats.pendingDeliveries.toString()}
                    icon={<ShoppingBag className="w-6 h-6 text-white" />}
                    iconBgColor="bg-orange-500"
                />
                <StatCard
                    title="Produits en rupture"
                    value={stats.outOfStockProducts.toString()}
                    icon={<AlertCircle className="w-6 h-6 text-white" />}
                    iconBgColor="bg-red-500"
                />
            </div>

            {/* Performance Alert */}
            <Alert className={`${stats.revenueChange.isPositive
                ? "bg-blue-50 border-blue-200"
                : "bg-red-50 border-red-200"
                }`}
            >
                {stats.revenueChange.isPositive ? (
                    <TrendingUp className="w-6 h-6 text-blue-900" />
                ) : (
                    <TrendingDown className="w-6 h-6 text-red-900" />
                )}

                <AlertDescription className="ml-2">
                    <span
                        className={`font-semibold ${stats.revenueChange.isPositive
                            ? "text-blue-900"
                            : "text-red-900"
                            }`}
                    >
                        {stats.revenueChange.isPositive
                            ? "Excellente performance !"
                            : "Baisse des performances"}
                    </span>

                    <br />

                    <span
                        className={`${stats.revenueChange.isPositive
                            ? "text-blue-700"
                            : "text-red-700"
                            }`}
                    >
                        Vos ventes sont{" "}
                        {stats.revenueChange.isPositive ? "en hausse" : "en baisse"} de{" "}
                        <strong>{stats.revenueChange.percentage} %</strong>{" "}
                        {stats.revenueChange.label}.
                    </span>
                </AlertDescription>
            </Alert>

        </div>
    );
}