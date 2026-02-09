import { useState } from "react";
import { Search, Calendar, MessageCircle, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@/types/order-status";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    productName: string;
    productVariant: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
    [OrderStatus.PENDING_PAYMENT]: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    [OrderStatus.PAID]: { label: "Payé", color: "bg-blue-100 text-blue-800" },
    [OrderStatus.DELIVERED]: { label: "Livré", color: "bg-green-100 text-green-800" },
    [OrderStatus.CANCELLED]: { label: "Annulé", color: "bg-red-100 text-red-800" },
    [OrderStatus.CONFIRMED]: { label: "Confirmé", color: "bg-purple-100 text-purple-800" },
    [OrderStatus.PROCESSING]: { label: "En cours", color: "bg-orange-100 text-orange-800" },
    [OrderStatus.SHIPPED]: { label: "Expédié", color: "bg-teal-100 text-teal-800" },
    [OrderStatus.PAYMENT_FAILED]: { label: "Paiement échoué", color: "bg-red-100 text-red-800" },
    [OrderStatus.EXPIRED]: { label: "Expiré", color: "bg-gray-100 text-gray-800" },
};

const filterButtons = [
    { label: "Tous", status: null, count: 5 },
    { label: "En attente", status: OrderStatus.PENDING_PAYMENT, count: 2, color: "bg-yellow-100 text-yellow-800" },
    { label: "Payé", status: OrderStatus.PAID, count: 1, color: "bg-blue-100 text-blue-800" },
    { label: "Livré", status: OrderStatus.DELIVERED, count: 1, color: "bg-green-100 text-green-800" },
    { label: "Annulé", status: OrderStatus.CANCELLED, count: 1, color: "bg-red-100 text-red-800" },
];

export function Orders() {
    const [selectedFilter, setSelectedFilter] = useState<OrderStatus | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data
    const orders: Order[] = [
        {
            id: "1",
            orderNumber: "CMD-001",
            customerName: "Marie Kouassi",
            customerPhone: "+225 07 12 34 56 78",
            productName: "Classic High Top",
            productVariant: "Black - Size 9",
            total: 75000,
            status: OrderStatus.PENDING_PAYMENT,
            createdAt: "09/02/2026"
        },
        {
            id: "2",
            orderNumber: "CMD-002",
            customerName: "Jean Koné",
            customerPhone: "+225 05 98 76 54 32",
            productName: "Low Top Classic",
            productVariant: "White - Size 10",
            total: 65000,
            status: OrderStatus.PAID,
            createdAt: "09/02/2026"
        },
        {
            id: "3",
            orderNumber: "CMD-003",
            customerName: "Aïcha Traoré",
            customerPhone: "+225 01 23 45 67 89",
            productName: "Platform High Top",
            productVariant: "Leopard Print - Size 8",
            total: 95000,
            status: OrderStatus.DELIVERED,
            createdAt: "08/02/2026"
        },
        {
            id: "4",
            orderNumber: "CMD-004",
            customerName: "Kouadio Yao",
            customerPhone: "+225 07 11 22 33 44",
            productName: "Vibrant Red High",
            productVariant: "Red - Size 9",
            total: 75000,
            status: OrderStatus.PENDING_PAYMENT,
            createdAt: "09/02/2026"
        },
        {
            id: "5",
            orderNumber: "CMD-005",
            customerName: "Fatou Diallo",
            customerPhone: "+225 05 55 66 77 88",
            productName: "Ocean Blue Low",
            productVariant: "Blue - Size 8",
            total: 65000,
            status: OrderStatus.CANCELLED,
            createdAt: "07/02/2026"
        },
    ];

    const handleWhatsApp = (phone: string, orderNumber: string) => {
        const message = `Bonjour, je vous contacte concernant votre commande ${orderNumber}.`;
        const whatsappUrl = `https://wa.me/${phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{orders.length} commande(s)</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Aujourd'hui
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {filterButtons.map((filter) => (
                    <button
                        key={filter.label}
                        onClick={() => setSelectedFilter(filter.status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter.status
                            ? filter.color || "bg-gray-900 text-white"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {filter.label} ({filter.count})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Rechercher par client, commande ou téléphone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200"
                />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                N° Commande
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{order.customerName}</p>
                                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{order.productName}</p>
                                        <p className="text-sm text-gray-500">{order.productVariant}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.createdAt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Select defaultValue={order.status}>
                                        <SelectTrigger className={`w-40 ${statusConfig[order.status].color} border-0`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statusConfig).map(([status, config]) => (
                                                <SelectItem key={status} value={status}>
                                                    {config.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => handleWhatsApp(order.customerPhone, order.orderNumber)}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}