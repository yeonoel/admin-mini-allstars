import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { DashboardStatsDto } from "@/types/dashboard.types";
import { DollarSign, TrendingUp, ShoppingBag, AlertCircle } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    iconBgColor: string;
}

const StatCard = ({ title, value, icon, iconBgColor }: StatCardProps) => {
    return (
        <Card className="border-gray-200">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function Overview() {
    const stats: DashboardStatsDto = {
        salesToday: 145500,
        salesThisMonth: 3245000,
        totalRevenue: 12500000,
        pendingDeliveries: 12,
        outOfStockProducts: 3
    };

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
            <Alert className="bg-blue-50 border-blue-200">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <AlertDescription className="ml-2">
                    <span className="font-semibold text-blue-900">Excellente performance !</span>
                    <br />
                    <span className="text-blue-700">
                        Vos ventes sont en hausse de 23% par rapport au mois dernier. Continuez comme ça !
                    </span>
                </AlertDescription>
            </Alert>
        </div>
    );
}