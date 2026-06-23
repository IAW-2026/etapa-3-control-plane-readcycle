import { shippingApi } from "./api";
import { Shipment } from "@/utils/types";

class ShippingService {
  async getShipments(): Promise<Shipment[]> {
    const { data } = await shippingApi.get("/shipments");
    return data;
  }

  async createShipment(orderId: string) {
    const { data } = await shippingApi.post("/shipments", {
      orderId,
    });

    return data;
  }

  async assignCarrier(shipmentId: string, carrierId: string) {
    const { data } = await shippingApi.put(`/shipments/${shipmentId}`, {
      carrierId,
    });

    return data;
  }

  async addTrackingStatus(shipmentId: string, description: string) {
    const { data } = await shippingApi.post(
      `/shipments/${shipmentId}/tracking`,
      {
        description,
      },
    );

    return data;
  }
}

export const shippingService = new ShippingService();
