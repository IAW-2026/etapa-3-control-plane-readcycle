"use client";

import { Order } from "@/utils/types";

interface OrdersTableProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export default function OrdersTable({ orders, onSelect }: OrdersTableProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">ID</th>

            <th className="p-3 text-left">Comprador</th>

            <th className="p-3 text-left">Total</th>

            <th className="p-3 text-left">Shipping</th>

            <th className="p-3 text-left">Items</th>

            <th className="p-3 text-left">Fecha</th>

            <th className="p-3 text-left">Acción</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-3">{order.id}</td>

              <td className="p-3">{order.buyerId}</td>

              <td className="p-3">${order.total}</td>

              <td className="p-3">${order.shippingCost}</td>

              <td className="p-3">{order.items.length}</td>

              <td className="p-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3">
                <button
                  onClick={() => onSelect(order)}
                  className="
                                        px-3
                                        py-1
                                        bg-black
                                        text-white
                                        rounded
                                    "
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
