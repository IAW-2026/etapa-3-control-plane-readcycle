'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { dashboardMetrics, groupNames, DashboardMetric } from "./data";
import DashboardCard from "@/components/DashboardCard";
import AdminManagementModal from "@/components/AdminManagementModal";

export default function DashboardPage() {
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

    // Guardamos los conteos dinámicos para que se actualicen en tiempo real al agregar/eliminar items en el modal ABM
    const [counts, setCounts] = useState<Record<string, number>>(() =>
        dashboardMetrics.reduce((acc, m) => {
            acc[m.id] = m.count;
            return acc;
        }, {} as Record<string, number>)
    );

    // Cargar métricas reales desde la API al montar el componente
    useEffect(() => {
        fetch('/api/control/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setCounts(data.data);
                }
            })
            .catch(err => console.error("Error al obtener las métricas del dashboard:", err));
    }, []);

    // Agrupamiento dinámico de métricas utilizando los contadores locales actualizados
    const groupedMetrics = Object.keys(groupNames).reduce((acc, key) => {
        acc[key] = dashboardMetrics.filter((m) => m.group === key);
        return acc;
    }, {} as Record<string, DashboardMetric[]>);

    // Computaciones de encabezados de resumen rápidos
    const totalUsers = counts['usuarios'] ?? 0;
    const activeDisputes = counts['disputas'] ?? 0;
    const activeShipments = counts['envios'] ?? 0;

    // Obtener nombre del elemento activo
    const activeMetric = dashboardMetrics.find(m => m.id === selectedSectionId);
    const sectionName = activeMetric ? activeMetric.name : "";

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
            {/* Breadcrumbs & Live Pulse status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <nav className="flex items-center gap-2 text-xs font-medium text-brand-forest/60">
                    <Link href="/" className="hover:text-brand-sage transition-colors flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        Inicio
                    </Link>
                    <span>/</span>
                    <span className="text-brand-forest/80 font-semibold">Panel de Administración</span>
                </nav>
            </div>

            {/* Main Header Title Section */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-forest font-sans">
                    Consola de Control Central
                </h1>
                <p className="mt-2 text-sm text-brand-forest/70 max-w-3xl leading-relaxed font-light">
                    Supervise métricas críticas de la base de datos, administre cuentas de la comunidad, rastree despachos y resuelva reclamos de intercambio. Seleccione cualquier módulo para acceder a las operaciones detalladas.
                </p>
            </div>

            {/* Grid Groups Section */}
            <div className="space-y-12">
                {Object.entries(groupNames).map(([groupKey, groupInfo]) => {
                    const metrics = groupedMetrics[groupKey] || [];
                    if (metrics.length === 0) return null;

                    return (
                        <section key={groupKey} className="space-y-4">
                            {/* Group Title and Info */}
                            <div className="border-b border-brand-sand/60 pb-2">
                                <h2 className="text-lg font-bold text-brand-forest font-sans flex items-center gap-2">
                                    {groupInfo.title}
                                </h2>
                                <p className="text-xs text-brand-forest/60 font-light mt-0.5">
                                    {groupInfo.description}
                                </p>
                            </div>

                            {/* Items Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {metrics.map((item) => {
                                    // Enviamos la métrica con el contador actualizado dinámicamente
                                    const updatedItem = {
                                        ...item,
                                        count: counts[item.id] ?? item.count
                                    };
                                    return (
                                        <DashboardCard
                                            key={item.id}
                                            item={updatedItem}
                                            onClick={(id) => setSelectedSectionId(id)}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Ventana modal de gestión ABM superpuesta */}
            {selectedSectionId && (
                <AdminManagementModal
                    sectionId={selectedSectionId}
                    sectionName={sectionName}
                    onClose={() => setSelectedSectionId(null)}
                    onUpdateCount={(id, newCount) => {
                        setCounts((prev) => ({
                            ...prev,
                            [id]: newCount,
                        }));
                    }}
                />
            )}
        </div>
    );
}
