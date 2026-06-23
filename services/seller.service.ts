import { sellerApi } from "./api";

class SellerService {
  async getProducts() {
    const { data } = await sellerApi.get("/seller/public/products");

    return data;
  }

  async getOrders() {
    const { data } = await sellerApi.get("/seller/orders");

    return data;
  }

  async createOrder(payload: {
    buyerId: string;
    shippingCost: number;

    items: {
      productId: string;
      quantity: number;
    }[];
  }) {
    const { data } = await sellerApi.post("/seller/orders", payload);

    return data;
  }
}

export const sellerService = new SellerService();
