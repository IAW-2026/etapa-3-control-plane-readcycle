"use client";

import { Shipment } from "@/utils/types";

interface ShipmentsTableProps {
  shipments: Shipment[];
  onSelect: (shipment: Shipment) => void;
}

export default function ShipmentsTable({
  shipments,
  onSelect,
}: ShipmentsTableProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Shipment ID</th>

            <th className="text-left p-3">Order ID</th>

            <th className="text-left p-3">Carrier</th>

            <th className="text-left p-3">Estado</th>

            <th className="text-left p-3">Fecha</th>

            <th className="text-left p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="border-b">
              <td className="p-3">{shipment.id}</td>

              <td className="p-3">{shipment.orderId}</td>

              <td className="p-3">{shipment.carrierId ?? "Sin asignar"}</td>

              <td className="p-3">{shipment.currentStatus}</td>

              <td className="p-3">
                {new Date(shipment.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3">
                <button
                  onClick={() => onSelect(shipment)}
                  className="
                                        px-3
                                        py-1
                                        rounded
                                        bg-black
                                        text-white
                                        text-sm
                                    "
                >
                  Gestionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
