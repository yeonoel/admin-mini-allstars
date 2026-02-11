import { useState } from "react";
import { User, Phone, MapPin, DollarSign, Clock, ChevronDown, ChevronUp, MessageCircle, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type OrderDto } from "@/types/order.type";
import { OrderItemsList } from "./OrderItemsList";
import { StatusCanBeChanged, statusConfig } from "./order-config";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/types/order-status";
interface OrderCardProps {
    order: OrderDto;
    onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
    onWhatsApp?: (phone: string, orderNumber: string) => void;
    isUpdating?: boolean
}

export function OrderCard({ order, onStatusChange, onWhatsApp, isUpdating = false }: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    /**
     * Return true if the order can be updated to a new status, false otherwise.
     * @param {OrderStatus} current - the current status of the order
     * @return {boolean} true if the order can be updated, false otherwise
     */
    const canBeUpdate = (current: OrderStatus) => {
        if (current === OrderStatus.PENDING_PAYMENT) return true;
        if (current === OrderStatus.PAYMENT_FAILED) return true;
        if (current === OrderStatus.DELIVERED) return true;
        if (current === OrderStatus.CANCELLED) return true;
        return false;
    };

    /**
     * Return true if the order can be changed from the current status to the new status, false otherwise.
     * @param {OrderStatus} current - the current status of the order
     * @param {OrderStatus} newStatus - the new status of the order
     * @return {boolean} true if the order can be changed, false otherwise
     */
    const canChangeTo = (current: OrderStatus, newStatus: OrderStatus) => {
        if (current === OrderStatus.CONFIRMED && newStatus === OrderStatus.CANCELLED) return true;
        if (current === newStatus) return true;
        return false;
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* En-tête */}
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-bold text-base text-gray-900">
                                {order.orderNumber}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(order.createdAt)}
                            </div>
                        </div>
                        <Badge className={statusConfig[order.status].color}>
                            {statusConfig[order.status].label}
                        </Badge>
                    </div>

                    {/* Client */}
                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm text-gray-900">
                                    {order.user.firstName} {order.user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <Phone className="h-3 w-3" />
                                    {order.user.phone}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600">
                                {order.shippingAddress.streetAddress}, {order.shippingAddress.city}
                            </p>
                        </div>
                    </div>

                    {/* Articles (aperçu) */}
                    <div className="pt-2 border-t">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900">
                            <span className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                {order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}
                            </span>
                            {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {isExpanded && (
                            <div className="mt-3 space-y-3">
                                <OrderItemsList items={order.items} compact />

                                {/* Récapitulatif */}
                                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sous-total</span>
                                        <span className="font-medium">{formatPrice(order.subtotal)}</span>
                                    </div>
                                    {parseFloat(order.tax) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">TVA</span>
                                            <span className="font-medium">{formatPrice(order.tax)}</span>
                                        </div>
                                    )}
                                    {parseFloat(order.shippingCost) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Livraison</span>
                                            <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                                        </div>
                                    )}
                                    {parseFloat(order.discountAmount) > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Réduction</span>
                                            <span className="font-medium">-{formatPrice(order.discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm">
                                        <span>Total</span>
                                        <span>{formatPrice(order.total)}</span>
                                    </div>
                                </div>

                                {/* Note client */}
                                {order.customerNote && (
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <p className="text-xs font-medium text-blue-900 mb-1">
                                            Note du client
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            {order.customerNote}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Total (toujours visible) */}
                    {!isExpanded && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Total</span>
                            <span className="font-bold text-base text-gray-900 ml-auto">
                                {formatPrice(order.total)}
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                        {
                            canBeUpdate(order.status) ? (
                                <Select
                                    onValueChange={(value: OrderStatus) => onStatusChange?.(order.id, value)}
                                    disabled={true}
                                >
                                    <SelectTrigger className={`flex-1 ${statusConfig[order.status].color} border-0`}>
                                        <SelectValue placeholder={statusConfig[order.status].label} />
                                    </SelectTrigger>
                                </Select>
                            ) : (
                                <Select
                                    onValueChange={(value: OrderStatus) => onStatusChange?.(order.id, value)}
                                    disabled={isUpdating}
                                >
                                    <SelectTrigger className={`flex-1 ${statusConfig[order.status].color} border-0`}>
                                        <SelectValue placeholder="Modifier de statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(StatusCanBeChanged).map(([status, config]) => (
                                            <SelectItem key={status} value={status} disabled={canChangeTo(order.status, status as OrderStatus)}>
                                                {config.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        }
                        <Button
                            size="sm"
                            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => onWhatsApp?.(order.user.phone, order.orderNumber)}
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}