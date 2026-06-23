"use client";

import { useState } from "react";

import DashboardCard from "@/components/DashboardCard";

import { useDashboard } from "@/hooks/useDashboard";

import ProductModal from "@/modals/ProductModal";
import OrderModal from "@/modals/OrderModal";
import ShipmentModal from "@/modals/ShipmentModal";
import DisputeModal from "@/modals/DisputeModal";

type DashboardSection =
  | "products"
  | "orders"
  | "shipments"
  | "transactions"
  | "disputes"
  | null;

export default function DashboardPage() {
  const { dashboard, loading, error, refresh, lastUpdated } = useDashboard();

  const [activeSection, setActiveSection] = useState<DashboardSection>(null);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Cargando dashboard...</h1>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>

        <p>{error}</p>

        <button
          onClick={refresh}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const metrics = dashboard.metrics;

  return (
    <>
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Control Plane</h1>

            <p className="text-gray-500 mt-2">Administración centralizada</p>
          </div>

          <div className="text-right">
            <button
              onClick={refresh}
              className="
                                px-4
                                py-2
                                rounded-lg
                                bg-black
                                text-white
                            "
            >
              Actualizar
            </button>

            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-2">
                Última actualización: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* KPIs */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardCard
            title="Productos"
            value={metrics.products}
            description="Catálogo total"
            onClick={() => setActiveSection("products")}
          />

          <DashboardCard
            title="Productos Activos"
            value={metrics.activeProducts}
          />

          <DashboardCard title="Sin Stock" value={metrics.outOfStock} />

          <DashboardCard
            title="Órdenes"
            value={metrics.orders}
            description="Órdenes registradas"
            onClick={() => setActiveSection("orders")}
          />

          <DashboardCard
            title="Envíos"
            value={metrics.shipments}
            description="Total de envíos"
            onClick={() => setActiveSection("shipments")}
          />

          <DashboardCard title="Pendientes" value={metrics.pendingShipments} />

          <DashboardCard
            title="Transacciones"
            value={metrics.transactions}
            onClick={() => setActiveSection("transactions")}
          />

          <DashboardCard
            title="Disputas"
            value={metrics.disputes}
            onClick={() => setActiveSection("disputes")}
          />

          <DashboardCard
            title="Disputas Abiertas"
            value={metrics.openDisputes}
          />

          <DashboardCard title="Revenue" value={`$${metrics.totalRevenue}`} />
        </div>

        {/* Resumen rápido */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Últimos envíos</h2>

            <div className="space-y-3">
              {dashboard.shipments.slice(0, 5).map((shipment) => (
                <div
                  key={shipment.id}
                  className="
                                            flex
                                            justify-between
                                            border-b
                                            pb-2
                                        "
                >
                  <span>{shipment.orderId}</span>

                  <span>{shipment.currentStatus}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Últimas disputas</h2>

            <div className="space-y-3">
              {dashboard.disputes.slice(0, 5).map((dispute) => (
                <div
                  key={dispute.id}
                  className="
                                            flex
                                            justify-between
                                            border-b
                                            pb-2
                                        "
                >
                  <span>{dispute.reason}</span>

                  <span>{dispute.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}

      {activeSection === "products" && (
        <ProductModal
          products={dashboard.products}
          onClose={() => setActiveSection(null)}
        />
      )}

      {activeSection === "orders" && (
        <OrderModal
          orders={dashboard.orders}
          onClose={() => setActiveSection(null)}
        />
      )}

      {activeSection === "shipments" && (
        <ShipmentModal
          shipments={dashboard.shipments}
          onClose={() => setActiveSection(null)}
          onRefresh={refresh}
        />
      )}

      {activeSection === "disputes" && (
        <DisputeModal
          disputes={dashboard.disputes}
          onClose={() => setActiveSection(null)}
        />
      )}
    </>
  );
}
