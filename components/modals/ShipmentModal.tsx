"use client";

import { useState } from "react";

import ShipmentsTable from "@/components/ShipmentsTable";

import { shippingService } from "@/services/shipping.service";

import { Shipment } from "@/utils/types";

interface ShipmentModalProps {
  shipments: Shipment[];
  onClose: () => void;
  onRefresh: () => Promise<void>;
}

const SHIPPING_STATUSES = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function ShipmentModal({
  shipments,
  onClose,
  onRefresh,
}: ShipmentModalProps) {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null,
  );

  const [orderId, setOrderId] = useState("");
  const [carrierId, setCarrierId] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("PENDING");

  const [loading, setLoading] = useState(false);

  async function handleCreateShipment() {
    if (!orderId.trim()) return;

    try {
      setLoading(true);

      await shippingService.createShipment(orderId);

      setOrderId("");

      await onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignCarrier() {
    if (!selectedShipment || !carrierId.trim()) return;

    try {
      setLoading(true);

      await shippingService.assignCarrier(selectedShipment.id, carrierId);

      await onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTracking() {
    if (!selectedShipment) return;

    try {
      setLoading(true);

      await shippingService.addTrackingStatus(
        selectedShipment.id,
        trackingStatus,
      );

      await onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-[90vh] w-[95%] max-w-7xl flex-col overflow-hidden rounded-xl bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">Gestión de Envíos</h2>

          <button onClick={onClose} className="rounded border px-4 py-2">
            Cerrar
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Crear envío */}

          <section className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Crear envío</h3>

            <div className="flex gap-3">
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Order ID"
                className="flex-1 rounded border px-3 py-2"
              />

              <button
                onClick={handleCreateShipment}
                disabled={loading}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Crear
              </button>
            </div>
          </section>

          {/* Tabla */}

          <ShipmentsTable
            shipments={shipments}
            onSelect={setSelectedShipment}
          />

          {/* Detalle */}

          {selectedShipment && (
            <section className="space-y-6 rounded-lg border p-4">
              <h3 className="font-semibold">Shipment: {selectedShipment.id}</h3>

              {/* Carrier */}

              <div>
                <h4 className="mb-2 font-medium">Asignar carrier</h4>

                <div className="flex gap-3">
                  <input
                    value={carrierId}
                    onChange={(e) => setCarrierId(e.target.value)}
                    placeholder="Carrier ID"
                    className="flex-1 rounded border px-3 py-2"
                  />

                  <button
                    onClick={handleAssignCarrier}
                    disabled={loading}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {/* Tracking */}

              <div>
                <h4 className="mb-2 font-medium">Agregar tracking</h4>

                <div className="flex gap-3">
                  <select
                    value={trackingStatus}
                    onChange={(e) => setTrackingStatus(e.target.value)}
                    className="rounded border px-3 py-2"
                  >
                    {SHIPPING_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddTracking}
                    disabled={loading}
                    className="rounded bg-orange-600 px-4 py-2 text-white"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Historial */}

              <div>
                <h4 className="mb-2 font-medium">Historial de estados</h4>

                <div className="space-y-2">
                  {selectedShipment.statuses.map((status) => (
                    <div key={status.id} className="rounded border p-3">
                      <p>{status.description}</p>

                      <p className="text-xs text-gray-500">
                        {new Date(status.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
