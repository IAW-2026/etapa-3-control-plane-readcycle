import { sellerApi } from "./api";

class SellerService {
  async getProducts() {
    try {
      const { data } = await sellerApi.get("/public/products");
      return data;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  async getOrders() {
    try {
      const { data } = await sellerApi.get("/orders");
      return data;
    } catch (error) {
      console.log(error.message);
      return [];
    }
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
