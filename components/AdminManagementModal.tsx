'use client';

import { useState, useMemo } from "react";
import { mockDatabase } from "./admin-modal/mockData";
import AdminTableHeader from "./admin-modal/AdminTableHeader";
import AdminForm from "./admin-modal/AdminForm";
import AdminTable from "./admin-modal/AdminTable";
import AdminTablePagination from "./admin-modal/AdminTablePagination";

const DEFAULT_SCHEMAS: Record<string, Record<string, any>> = {
  usuarios: { nombre: "", email: "", rol: "Cliente", estado: "Activo" },
  productos: { titulo: "", autor: "", precio: 0, stock: 5 },
  ordenes: { cliente: "", total: 0, estado: "Pendiente" },
  carritos: { cliente: "", cantidadLibros: 1, totalEstimado: 0, estado: "Activo" },
  transacciones: { monto: 0, metodo: "MercadoPago", estado: "Pendiente" },
  disputas: { idOrden: "ORD-", motivo: "", estado: "Pendiente", severidad: "Baja" },
  envios: { idOrden: "ORD-", destino: "", correo: "Andreani", estado: "Preparación" }
};

interface AdminManagementModalProps {
  sectionId: string;
  sectionName: string;
  onClose: () => void;
  onUpdateCount?: (sectionId: string, newCount: number) => void;
}

const ITEMS_PER_PAGE = 4;

export default function AdminManagementModal({
  sectionId,
  sectionName,
  onClose,
  onUpdateCount
}: AdminManagementModalProps) {
  // Estado local sincronizado con la base de datos simulada en memoria
  const [records, setRecords] = useState<any[]>(() => mockDatabase[sectionId] || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de control para la gestión ABM
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Guardar cambios en el almacenamiento simulado y actualizar el dashboard
  const updateDatabase = (newRecords: any[]) => {
    mockDatabase[sectionId] = newRecords;
    setRecords(newRecords);
    if (onUpdateCount) {
      onUpdateCount(sectionId, newRecords.length);
    }
  };

  // Filtrado reactivo de registros según término de búsqueda
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const searchStr = searchTerm.toLowerCase();
      return Object.values(r).some((val) => 
        String(val).toLowerCase().includes(searchStr)
      );
    });
  }, [records, searchTerm]);

  // Paginación reactiva
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRecords = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, safeCurrentPage]);

  // Inicializar formulario de creación (Alta) de forma genérica
  const handleOpenCreate = () => {
    setEditingItem(null);
    const initialForm: Record<string, any> = {};
    const schemaSource = records.length > 0 
      ? records[0] 
      : (DEFAULT_SCHEMAS[sectionId] || {});

    Object.entries(schemaSource).forEach(([key, val]) => {
      if (key !== 'id') {
        initialForm[key] = typeof val === 'number' ? 0 : "";
      }
    });
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  // Inicializar formulario de edición (Modificación)
  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  // Confirmar Guardado (Alta / Modificación)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = records.map((r) => (r.id === editingItem.id ? { ...formData } : r));
      updateDatabase(updated);
    } else {
      const prefix = sectionId.substring(0, 3).toUpperCase();
      const randomId = Math.floor(100 + Math.random() * 900);
      const newRecord = {
        id: `${prefix}-${randomId}`,
        ...formData,
        ...(formData.fecha === undefined && (sectionId === 'ordenes' || sectionId === 'transacciones') 
          ? { fecha: new Date().toISOString().split('T')[0] } 
          : {})
      };
      updateDatabase([newRecord, ...records]);
      setCurrentPage(1); // Volver a la primera página para visualizar la inserción
    }
    setIsFormOpen(false);
  };

  // Eliminar registro (Baja)
  const handleDelete = (id: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el registro ${id}?`)) {
      const updated = records.filter((r) => r.id !== id);
      updateDatabase(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-forest/40 backdrop-blur-md">
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Ventana Modal principal */}
      <div className="relative bg-brand-beige rounded-3xl border border-brand-sand shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up z-10">
        
        {/* Encabezado */}
        <header className="bg-white border-b border-brand-sand px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-sage bg-brand-sage/10 px-3 py-1 rounded-full border border-brand-sage/20">
              Gestión Administrativa
            </span>
            <h2 className="text-lg font-extrabold text-brand-forest">
              {sectionName}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-brand-sand/40 text-brand-forest/60 hover:text-brand-forest transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Zona de contenido */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Formulario Dinámico ABM */}
          {isFormOpen && (
            <AdminForm
              sectionId={sectionId}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onCancel={() => setIsFormOpen(false)}
              editingId={editingItem?.id}
            />
          )}

          {/* Buscador y disparador de creación */}
          <AdminTableHeader
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
            onAddClick={handleOpenCreate}
          />

          {/* Tabla de registros */}
          <AdminTable
            sectionId={sectionId}
            records={paginatedRecords}
            onEditClick={handleOpenEdit}
            onDeleteClick={handleDelete}
          />

          {/* Barra inferior de paginación */}
          <AdminTablePagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
