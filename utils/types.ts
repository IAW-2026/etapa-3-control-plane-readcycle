export interface ShipmentStatus {
  id: string;
  description: string;
  timestamp: string;
  shipmentId: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrierId: string | null;
  currentStatus: string;
  createdAt: string;
  statuses: ShipmentStatus[];
}
export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  sellerId: string;
  categoryId: string;
  isActive: boolean;

  category: Category;
  images: ProductImage[];
}
export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  sellerId: string;
  buyerId: string;

  total: number;
  shippingCost: number;

  paymentId: string;
  shippingId: string;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
}
export interface Transaction {
  id: string;

  orderId: string;

  amount: number;

  status: string;

  paymentMethod: string;

  mercadoPagoPaymentId: string;

  mercadoPagoPreferenceId: string;

  buyerId: string;
  sellerId: string;

  createdAt: string;
}
export interface Transaction {
  id: string;

  orderId: string;

  amount: number;

  status: string;

  paymentMethod: string;

  mercadoPagoPaymentId: string;

  mercadoPagoPreferenceId: string;

  buyerId: string;
  sellerId: string;

  createdAt: string;
}
export interface Dispute {
  id: string;

  userId: string;

  transactionId: string;

  reason: string;

  status: string;

  resolution: string | null;

  createdAt: string;

  transaction: Transaction;
}
export interface PaginatedResponse<T> {
  data: T[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}
export interface DashboardData {
  products: Product[];
  orders: Order[];
  shipments: Shipment[];
  transactions: Transaction[];
  disputes: Dispute[];

  metrics: {
    products: number;
    activeProducts: number;
    outOfStock: number;

    orders: number;

    shipments: number;
    pendingShipments: number;

    transactions: number;
    approvedTransactions: number;

    disputes: number;
    openDisputes: number;

    totalRevenue: number;
  };
}
