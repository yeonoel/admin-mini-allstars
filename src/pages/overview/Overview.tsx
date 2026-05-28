import { StatCard } from "@/components/features/StatCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverview } from "@/hooks/useOverview";
import { formatNumber } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  TrendingDown,
} from "lucide-react";

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
        <p className="text-sm text-gray-500">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Commandes"
          value={formatNumber(stats.countOrders)}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          iconBgColor="bg-green-500"
        />
        <StatCard
          title="Produits vendus"
          value={formatNumber(stats.orderDelivered)}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconBgColor="bg-blue-600"
        />
        <StatCard
          title="Revenu"
          value={formatNumber(stats.totalRevenue)}
          icon={<ShoppingBag className="w-6 h-6 text-white" />}
          iconLabel="FCFA"
          iconBgColor="bg-orange-500"
        />
        <StatCard
          title="Nombre de clients"
          value={formatNumber(stats.clientsNumber)}
          icon={<AlertCircle className="w-6 h-6 text-white" />}
          iconBgColor="bg-red-500"
        />
      </div>
    </div>
  );
}
