
export interface PercentageChange {
  percentage: number;
  isPositive: boolean;
  label: string;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  orders: number;
  label?: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
  category?: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  lowStockThreshold: number;
  image?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  
  revenueChange: PercentageChange;
  ordersChange: PercentageChange;
  productsChange: PercentageChange;
  customersChange: PercentageChange;
  
  revenueByMonth: RevenueByMonth[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}
