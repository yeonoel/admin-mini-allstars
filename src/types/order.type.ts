import type { OrderStatus } from "./order-status";

export interface OrderItemDto {
  id: string;
  productName: string;
  productSku: string;
  variantName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
}

export interface AddressDto {
  city: string;
  state: string;
  country: string;
  apartment: string;
  postalCode: string;
  streetAddress: string;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  subtotal: string;
  tax: string;
  shippingCost: string;
  discountAmount: string;
  total: string;
  customerNote?: string;
  items: OrderItemDto[];
  user: UserDto;
  itemsCount: number;
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponseDto {
  success: boolean;
  message: string;
  data: {
    items: OrderDto[];
    pagination: PaginationDto;
  };
}
