import { useState } from "react";
import { Search, Calendar, MessageCircle, ChevronDown, ChevronUp, X, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderCard } from "@/components/features/Order/OrderCard";
import { OrderItemsList } from "@/components/features/Order/OrderItemsList";
import { StatusChangeConfirmDialog } from "@/components/features/Order/StatusChangeConfirmeDialog";
import { statusConfig, filterButtons, StatusCanBeChanged } from "@/components/features/Order/order-config";
import { useOrder } from "@/hooks/useOrder";
import { useStatusChangeConfirm } from "@/hooks/useStatusChangeConfrme";
import { OrdersError } from "@/components/features/Order/OrderErrror";
import { OrdersListSkeleton } from "@/components/features/Order/OrderSkeleton";
import { OrdersEmpty } from "@/components/features/Order/OrdersEmpty";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/types/order-status";

export function Orders() {
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    //Hook avec filtres hybrides (backend + frontend)
    const {
        orders,
        totalCount,
        filteredCount,
        isLoading,
        error,
        refetch,
        dateFilter,
        setDateFilter,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        activeFiltersCount,
        resetFilters,
        updateStatus,
        isUpdatingStatus
    } = useOrder();

    // Gestion de la confirmation de changement de statut
    const {
        isOpen: isConfirmDialogOpen,
        setIsOpen: setConfirmDialogOpen,
        pendingChange,
        requestStatusChange,
        handleConfirm: confirmStatusChange,
        handleCancel: cancelStatusChange
    } = useStatusChangeConfirm((orderId, newStatus) => {
        updateStatus({ orderId, status: newStatus });
    });

    // ========== LOADING STATE ==========
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-full sm:w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                    ))}
                </div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="lg:hidden">
                    <OrdersListSkeleton variant="mobile" />
                </div>
                <div className="hidden lg:block">
                    <OrdersListSkeleton variant="desktop" />
                </div>
            </div>
        );
    }

    // ========== ERROR STATE ==========
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Commandes</h2>
                    </div>
                </div>
                <OrdersError error={error} onRetry={refetch} />
            </div>
        );
    }

    // ========== EMPTY STATE (aucune commande du tout) ==========
    if (totalCount === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500">0 commande</p>
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2 w-full sm:w-auto"
                        onClick={() => setDateFilter('today')}
                    >
                        <Calendar className="w-4 h-4" />
                        Aujourd'hui
                    </Button>
                </div>
                <OrdersEmpty />
            </div>
        );
    }

    /**
     * Toggle the expansion of an order.
     * If the order is currently expanded, it will be collapsed.
     * If the order is currently collapsed, it will be expanded.
     * @param {string} orderId - The ID of the order to toggle.
     */
    const toggleOrderExpansion = (orderId: string) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    /**
     * Return true if the order can be updated to a new status, false otherwise.
     * An order can be updated if its status is PENDING_PAYMENT, PAYMENT_FAILED, DELIVERED or CANCELED.
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

    const canChangeTo = (current: OrderStatus, newStatus: OrderStatus) => {
        if (current === OrderStatus.CONFIRMED && newStatus === OrderStatus.CANCELLED) return true;
        if (current === newStatus) return true;
        return false;
    };


    const handleWhatsApp = (phone: string, orderNumber: string) => {
        const message = `Bonjour, je vous contacte concernant votre commande ${orderNumber}.`;
        const whatsappUrl = `https://wa.me/${phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleStatusChangeRequest = (
        orderId: string,
        orderNumber: string,
        currentStatus: OrderStatus,
        newStatus: OrderStatus
    ) => {
        requestStatusChange(orderId, orderNumber, currentStatus, newStatus);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // ========== RENDER ==========
    return (
        <div className="space-y-6">
            {/* Dialog de confirmation */}
            {pendingChange && (
                <StatusChangeConfirmDialog
                    isOpen={isConfirmDialogOpen}
                    onOpenChange={setConfirmDialogOpen}
                    onConfirm={confirmStatusChange}
                    orderNumber={pendingChange.orderNumber}
                    currentStatus={pendingChange.currentStatus}
                    newStatus={pendingChange.newStatus}
                    isLoading={isUpdatingStatus}
                />
            )}

            {/* ========== HEADER ========== */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">
                        {filteredCount} commande{filteredCount > 1 ? 's' : ''}
                        {filteredCount !== totalCount && (
                            <span className="text-gray-400"> sur {totalCount}</span>
                        )}
                    </p>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="h-7 text-xs gap-1 text-gray-600 hover:text-gray-900"
                        >
                            <X className="w-3 h-3" />
                            Réinitialiser ({activeFiltersCount})
                        </Button>
                    )}
                </div>

                {/* Bouton Aujourd'hui */}
                <Button
                    variant={dateFilter === 'today' ? "default" : "outline"}
                    className={`gap-2 w-full sm:w-auto ${dateFilter === 'today' ? 'bg-gray-900 text-white' : ''}`}
                    onClick={() => setDateFilter(dateFilter === 'today' ? null : 'today')}
                >
                    <Calendar className="w-4 h-4" />
                    Aujourd'hui
                </Button>
            </div>

            {/* ========== FILTRES DE STATUT ========== */}
            <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {filterButtons.map((filter) => (
                    <button
                        key={filter.label}
                        onClick={() => setStatusFilter(statusFilter === filter.status ? null : filter.status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === filter.status
                            ? filter.color || "bg-gray-900 text-white"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* ========== FILTRES ACTIFS ========== */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-500">Filtres actifs :</span>

                    {dateFilter && (
                        <Badge
                            variant="secondary"
                            className="gap-1 cursor-pointer hover:bg-gray-200"
                            onClick={() => setDateFilter(null)}
                        >
                            {dateFilter === 'today' ? "Aujourd'hui" :
                                dateFilter === 'week' ? "Cette semaine" :
                                    "Ce mois"}
                            <X className="w-3 h-3" />
                        </Badge>
                    )}

                    {statusFilter && (
                        <Badge
                            variant="secondary"
                            className="gap-1 cursor-pointer hover:bg-gray-200"
                            onClick={() => setStatusFilter(null)}
                        >
                            {statusConfig[statusFilter].label}
                            <X className="w-3 h-3" />
                        </Badge>
                    )}

                    {searchQuery && (
                        <Badge
                            variant="secondary"
                            className="gap-1 cursor-pointer hover:bg-gray-200"
                            onClick={() => setSearchQuery('')}
                        >
                            Recherche: "{searchQuery}"
                            <X className="w-3 h-3" />
                        </Badge>
                    )}
                </div>
            )}

            {/* ========== BARRE DE RECHERCHE ========== */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Rechercher par client, commande, téléphone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ========== AUCUN RÉSULTAT AVEC FILTRES ========== */}
            {filteredCount === 0 && activeFiltersCount > 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-2">Aucune commande ne correspond à vos filtres</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Réinitialiser les filtres
                    </Button>
                </div>
            )}

            {/* ========== MOBILE: VUE EN CARTES ========== */}
            {filteredCount > 0 && (
                <div className="lg:hidden space-y-4">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onStatusChange={(orderId, newStatus) =>
                                handleStatusChangeRequest(orderId, order.orderNumber, order.status, newStatus)
                            }
                            onWhatsApp={handleWhatsApp}
                            isUpdating={isUpdatingStatus}
                        />
                    ))}
                </div>
            )}

            {/* ========== DESKTOP: VUE TABLEAU ========== */}
            {filteredCount > 0 && (
                <div className="hidden lg:block">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-12 px-4 py-3"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Commande
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Client
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Statut
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-32">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <>
                                        {/* Ligne principale */}
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleOrderExpansion(order.id)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    {expandedOrders.has(order.id) ? (
                                                        <ChevronDown className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronUp className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>

                                            {/* Commande */}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-bold text-gray-900">{order.orderNumber}</p>
                                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                                </div>
                                            </td>

                                            {/* Client */}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {order.user.firstName} {order.user.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{order.user.phone}</p>
                                                </div>
                                            </td>

                                            {/* Total */}
                                            <td className="px-4 py-4 text-right">
                                                <p className="font-bold text-lg text-gray-900 whitespace-nowrap">
                                                    {formatPrice(order.total)}
                                                </p>
                                            </td>

                                            {/* Statut */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Badge className={`${statusConfig[order.status].color}`}>
                                                        {statusConfig[order.status].label}
                                                    </Badge>
                                                    {!canBeUpdate(order.status) && (
                                                        <Select
                                                            onValueChange={(newStatus: OrderStatus) =>
                                                                handleStatusChangeRequest(
                                                                    order.id,
                                                                    order.orderNumber,
                                                                    order.status,
                                                                    newStatus
                                                                )
                                                            }
                                                            disabled={isUpdatingStatus}
                                                        >
                                                            <SelectTrigger className="w-[140px] h-8 text-xs">
                                                                <Edit2 className="h-3 w-3 mr-1" />
                                                                <SelectValue placeholder="Modifier" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(StatusCanBeChanged).map(([status, config]) => (
                                                                    <SelectItem
                                                                        key={status}
                                                                        value={status}
                                                                        disabled={canChangeTo(order.status, status as OrderStatus)}
                                                                    >
                                                                        {config.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleWhatsApp(order.user.phone, order.orderNumber)}
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        WhatsApp
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Détails expandables */}
                                        {expandedOrders.has(order.id) && (
                                            <tr>
                                                <td colSpan={6} className="bg-gray-50">
                                                    <div className="p-6 space-y-6">
                                                        {/* Articles */}
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                                Articles commandés ({order.itemsCount})
                                                            </h4>
                                                            <OrderItemsList items={order.items} />
                                                        </div>

                                                        {/* Adresses et récapitulatif */}
                                                        <div className="grid grid-cols-2 gap-6">
                                                            {/* Adresse de livraison */}
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                                    Adresse de livraison
                                                                </h4>
                                                                <div className="bg-white rounded-lg p-4 text-sm text-gray-600 space-y-1">
                                                                    <p>{order.shippingAddress.streetAddress}</p>
                                                                    {order.shippingAddress.apartment && (
                                                                        <p>{order.shippingAddress.apartment}</p>
                                                                    )}
                                                                    <p>
                                                                        {order.shippingAddress.city}, {order.shippingAddress.state}
                                                                    </p>
                                                                    <p>
                                                                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Récapitulatif */}
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                                    Récapitulatif
                                                                </h4>
                                                                <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
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
                                                                    <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                                                                        <span>Total</span>
                                                                        <span className="text-lg">{formatPrice(order.total)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Note client */}
                                                        {order.customerNote && (
                                                            <div className="bg-blue-50 rounded-lg p-4">
                                                                <p className="font-semibold text-blue-900 mb-1">
                                                                    Note du client
                                                                </p>
                                                                <p className="text-sm text-blue-700">
                                                                    {order.customerNote}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}