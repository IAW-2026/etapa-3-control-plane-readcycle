import { sellerService } from "./seller.service";
import { shippingService } from "./shipping.service";
import { paymentsService } from "./payments.service";

class DashboardService {
  async getDashboardData() {
    try {
      const [
        products,
        orders,
        shipments,
        transactionsResponse,
        disputesResponse,
      ] = await Promise.all([
        sellerService.getProducts(),
        sellerService.getOrders(),
        shippingService.getShipments(),
        paymentsService.getTransactions(),
        paymentsService.getDisputes(),
      ]);

      const transactions = transactionsResponse.data;

      const disputes = disputesResponse.data;

      return {
        products,
        orders,
        shipments,
        transactions,
        disputes,

        metrics: {
          products: products?.length,

          activeProducts: products?.filter((p) => p.isActive).length,

          outOfStock: products?.filter((p) => p.stock === 0).length,

          orders: orders?.length,

          shipments: shipments?.length,

          pendingShipments: shipments?.filter(
            (s) => s.currentStatus === "PENDING",
          ).length,

          transactions: transactions?.length,

          approvedTransactions: transactions?.filter(
            (t) => t.status === "APPROVED",
          ).length,

          disputes: disputes?.length,

          openDisputes: disputes?.filter((d) => d.status !== "RESOLVED").length,

          totalRevenue: transactions
            ?.filter((t) => t.status === "APPROVED")
            ?.reduce((sum, t) => sum + t.amount, 0),
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export const dashboardService = new DashboardService();
