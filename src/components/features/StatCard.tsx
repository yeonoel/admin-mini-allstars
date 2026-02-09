
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    iconBgColor: string;
}

export const StatCard = ({ title, value, icon, iconBgColor }: StatCardProps) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                            <p className="text-2xl font-semibold text-gray-900">{value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                            {icon}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
