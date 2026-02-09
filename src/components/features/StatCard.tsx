
import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { type PercentageChange } from '@/types/dashboard.types';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconBg: string;           // 'bg-green-100' par exemple
    iconColor: string;        // 'text-green-600'
    change?: PercentageChange;
}

export const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, change }: StatCardProps) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>

                        {change && (
                            <div className="flex items-center mt-2 text-sm">
                                {change.isPositive ? (
                                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                                )}
                                <span className={cn(
                                    'font-medium',
                                    change.isPositive ? 'text-green-600' : 'text-red-600'
                                )}
                                >
                                    {change.isPositive ? '+' : ''}
                                    {change.percentage}%
                                </span>
                                <span className="text-gray-500 ml-1">{change.label}</span>
                            </div>
                        )}
                    </div>

                    <div className={cn('p-3 rounded-lg', iconBg)}>
                        <Icon className={cn('w-6 h-6', iconColor)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
