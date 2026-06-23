import { paymentsApi } from "./api";

class PaymentsService {
  async getTransactions(page = 1) {
    const { data } = await paymentsApi.get(
      `/payments/transactions?page=${page}`,
    );

    return data;
  }

  async getDisputes(page = 1) {
    const { data } = await paymentsApi.get(`/payments/disputes?page=${page}`);

    return data;
  }
}

export const paymentsService = new PaymentsService();
