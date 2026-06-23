import { paymentsApi } from "./api";

class PaymentsService {
  async getTransactions(page = 1) {
    try {
      const { data } = await paymentsApi.get(`/payments/transactions`);

      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getDisputes(page = 1) {
    try {
      const { data } = await paymentsApi.get(`/payments/disputes`);

      return data;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }
}

export const paymentsService = new PaymentsService();
