import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* En-tête */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>

                    {/* Client */}
                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-start gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>

                    {/* Articles */}
                    <div className="pt-2 border-t">
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Total */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-24 ml-auto" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function OrderTableSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-28" />
                        </div>

                        <div className="text-right space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-6 w-24" />
                        </div>

                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function OrdersListSkeleton({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
    if (variant === "mobile") {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <OrderCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <OrderTableSkeleton key={i} />
            ))}
        </div>
    );
}