"use client";

import { useState } from "react";

import BaseModal from "./BaseModal";

import OrdersTable from "@/components/OrdersTable";

import { Order } from "@/utils/types";

interface OrderModalProps {
  orders: Order[];
  onClose: () => void;
}

export default function OrderModal({ orders, onClose }: OrderModalProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <BaseModal title="Órdenes" onClose={onClose}>
      <OrdersTable orders={orders} onSelect={setSelectedOrder} />

      {selectedOrder && (
        <div className="mt-8 border rounded p-4">
          <h3 className="font-bold text-xl mb-4">{selectedOrder.id}</h3>

          <div className="space-y-2">
            <div>Buyer: {selectedOrder.buyerId}</div>

            <div>Seller: {selectedOrder.sellerId}</div>

            <div>Total: ${selectedOrder.total}</div>

            <div>Shipping: ${selectedOrder.shippingCost}</div>

            <div>Payment: {selectedOrder.paymentId}</div>

            <div>Shipment: {selectedOrder.shippingId}</div>
          </div>

          <h4 className="mt-6 font-semibold">Items</h4>

          <ul className="mt-2">
            {selectedOrder.items.map((item) => (
              <li key={item.productId}>
                {item.productId} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </BaseModal>
  );
}
