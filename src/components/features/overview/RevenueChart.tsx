
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type RevenueByMonth } from '@/types/dashboard.types';
import { formatPrice } from '@/lib/utils';

interface RevenueChartProps {
    data: RevenueByMonth[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 mb-2">
                        {payload[0].payload.label}
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-indigo-600">Revenus:</span>{' '}
                            {formatPrice(payload[0].value)}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">Commandes:</span>{' '}
                            {payload[1].value}
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
                <CardTitle>Évolution du chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        <XAxis
                            dataKey="label"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={{ stroke: '#d1d5db' }}
                        />

                        <YAxis
                            yAxisId="left"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={{ stroke: '#d1d5db' }}
                            tickFormatter={(value) => `${value / 1000}k€`}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={{ stroke: '#d1d5db' }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenus (€)"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={{ fill: '#6366f1', r: 4 }}
                            activeDot={{ r: 6 }}
                        />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="orders"
                            name="Commandes"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
