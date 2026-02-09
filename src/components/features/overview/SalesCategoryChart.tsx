
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type TopProduct } from '@/types/dashboard.types';
import { formatPrice } from '@/lib/utils';

interface SalesCategoryChartProps {
    data: TopProduct[];
}

// Couleurs pour les barres
const COLORS = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Green
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime
];

export const SalesCategoryChart = ({ data }: SalesCategoryChartProps) => {
    // Préparer les données pour le graphique
    const chartData = data.map((product, index) => ({
        name: product.name.length > 20
            ? product.name.substring(0, 20) + '...'
            : product.name,
        fullName: product.name,
        sales: product.sales,
        revenue: product.revenue,
        category: product.category,
        color: COLORS[index % COLORS.length],
    }));

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 mb-2">
                        {data.fullName}
                    </p>
                    {data.category && (
                        <p className="text-xs text-gray-500 mb-2">
                            {data.category}
                        </p>
                    )}
                    <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Ventes:</span>{' '}
                            {data.sales} unités
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Revenus:</span>{' '}
                            {formatPrice(data.revenue)}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 des produits</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#6b7280', fontSize: 11 }}
                            tickLine={{ stroke: '#d1d5db' }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />

                        <YAxis
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={{ stroke: '#d1d5db' }}
                            label={{
                                value: 'Nombre de ventes',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fill: '#6b7280', fontSize: 12 },
                            }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Bar
                            dataKey="sales"
                            radius={[8, 8, 0, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
