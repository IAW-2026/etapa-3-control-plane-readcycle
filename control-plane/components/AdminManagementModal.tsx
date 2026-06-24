import { useState, useMemo, useEffect } from "react";
import { mockDatabase } from "./admin-modal/mockData";
import AdminTableHeader from "./admin-modal/AdminTableHeader";
import AdminForm from "./admin-modal/AdminForm";
import AdminTable from "./admin-modal/AdminTable";
import AdminTablePagination from "./admin-modal/AdminTablePagination";
import { useToast } from "@/components/Toast";

const DEFAULT_SCHEMAS: Record<string, Record<string, any>> = {
  usuarios: { nombre: "", email: "", rol: "Cliente", estado: "Activo" },
  productos: { titulo: "", autor: "", precio: 0, stock: 5 },
  ordenes: { cliente: "", total: 0, estado: "Pendiente" },
  carritos: { cliente: "", cantidadLibros: 1, totalEstimado: 0, estado: "Activo" },
  transacciones: { monto: 0, metodo: "MercadoPago", estado: "Pendiente" },
  disputas: { idOrden: "ORD-", motivo: "", estado: "Pendiente", severidad: "Baja", resolucion: "" },
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
  const toast = useToast();

  // Estado local sincronizado con la base de datos simulada en memoria, la API de Clerk o Payments API
  const [records, setRecords] = useState<any[]>(() => {
    if (sectionId === 'usuarios' || sectionId === 'productos' || sectionId === 'disputas') return [];
    return mockDatabase[sectionId] || [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estados de control para la gestión ABM
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Estado para el modal de confirmación personalizado
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'clay' | 'sage';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    confirmColor: "clay",
    onConfirm: () => { }
  });

  // Cargar usuarios desde la API de Clerk
  const fetchClerkUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/control/users');
      const data = await response.json();
      if (data.success && data.data) {
        setRecords(data.data);
        if (onUpdateCount) {
          onUpdateCount('usuarios', data.data.length);
        }
      } else {
        console.error("Failed to fetch Clerk users:", data.error);
        toast.error(`Error al cargar usuarios de Clerk: ${data.error}`);
      }
    } catch (error: any) {
      console.error("Error fetching Clerk users:", error);
      toast.error("Error de conexión al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos desde la API
  const fetchApiProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/control/products');
      const data = await response.json();
      if (data.success && data.data) {
        setRecords(data.data);
        if (onUpdateCount) {
          onUpdateCount('productos', data.data.length);
        }
      } else {
        console.error("Failed to fetch products:", data.error);
        toast.error(`Error al cargar productos: ${data.error}`);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Error de conexión al cargar productos.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar disputas desde la API de Pagos
  const fetchApiDisputes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/control/disputes');
      const data = await response.json();
      if (data.success && data.data) {
        setRecords(data.data);
        if (onUpdateCount) {
          onUpdateCount('disputas', data.data.length);
        }
      } else {
        console.error("Failed to fetch disputes:", data.error);
        toast.error(`Error al cargar disputas: ${data.error}`);
      }
    } catch (error: any) {
      console.error("Error fetching disputes:", error);
      toast.error("Error de conexión al cargar disputas.");
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar registros según la sección activa
  useEffect(() => {
    if (sectionId === 'usuarios') {
      fetchClerkUsers();
    } else if (sectionId === 'productos') {
      fetchApiProducts();
    } else if (sectionId === 'disputas') {
      fetchApiDisputes();
    } else {
      setRecords(mockDatabase[sectionId] || []);
    }
  }, [sectionId]);

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

  // Inicializar formulario de creación (Alta)
  const handleOpenCreate = () => {
    setEditingItem(null);
    let initialForm: Record<string, any> = {};
    if (sectionId === 'usuarios') {
      initialForm = { nombre: "", email: "", password: "", rol: "Cliente" };
    } else {
      const schemaSource = records.length > 0
        ? records[0]
        : (DEFAULT_SCHEMAS[sectionId] || {});

      Object.entries(schemaSource).forEach(([key, val]) => {
        if (key !== 'id') {
          initialForm[key] = typeof val === 'number' ? 0 : "";
        }
      });
    }
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
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sectionId === 'usuarios') {
      try {
        setLoading(true);
        const response = await fetch('/api/control/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            rol: formData.rol
          })
        });
        const data = await response.json();
        if (data.success) {
          await fetchClerkUsers();
          setIsFormOpen(false);
          toast.success("Usuario creado exitosamente en Clerk.");
        } else {
          toast.error(`Error al crear usuario en Clerk: ${data.error}`);
        }
      } catch (error) {
        console.error("Error creating user:", error);
        toast.error("Ocurrió un error inesperado al intentar crear el usuario.");
      } finally {
        setLoading(false);
      }
    } else if (sectionId === 'disputas') {
      try {
        setLoading(true);
        const response = await fetch('/api/control/disputes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem?.id,
            estado: formData.estado,
            resolucion: formData.resolucion
          })
        });
        const data = await response.json();
        if (data.success) {
          await fetchApiDisputes();
          toast.success("Disputa modificada exitosamente.");
        } else {
          toast.error(`Error al modificar la disputa: ${data.error}`);
        }
      } catch (error) {
        console.error("Error editing dispute:", error);
        toast.error("Ocurrió un error inesperado al intentar modificar la disputa.");
      } finally {
        setLoading(false);
        setIsFormOpen(false);
      }
    } else {
      if (editingItem) {
        const updated = records.map((r) => (r.id === editingItem.id ? { ...formData } : r));
        updateDatabase(updated);
        toast.success("Registro modificado correctamente.");
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
        toast.success("Nuevo registro creado correctamente.");
      }
      setIsFormOpen(false);
    }
  };

  // Eliminar registro (Baja)
  const handleDelete = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: "Eliminar Publicación",
      message: `¿Estás seguro de que deseas eliminar la publicacion ${id}?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      confirmColor: "clay",
      onConfirm: async () => {
        if (sectionId === 'usuarios') {
          try {
            setLoading(true);
            const response = await fetch('/api/control/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: id, action: 'delete' })
            });
            const data = await response.json();
            if (data.success) {
              await fetchClerkUsers();
              toast.success("Usuario eliminado exitosamente de Clerk.");
            } else {
              toast.error(`Error al eliminar en Clerk: ${data.error}`);
            }
          } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Ocurrió un error inesperado al intentar eliminar el usuario.");
          } finally {
            setLoading(false);
          }
        } else if (sectionId === 'productos') {
          try {
            setLoading(true);
            const response = await fetch(`/api/control/products?id=${id}`, {
              method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
              await fetchApiProducts();
              toast.success("Producto eliminado exitosamente.");
            } else {
              toast.error(`Error al eliminar el producto: ${data.error}`);
            }
          } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Ocurrió un error inesperado al intentar eliminar el producto.");
          } finally {
            setLoading(false);
          }
        } else {
          if (sectionId === 'disputas') return;
          const updated = records.filter((r) => r.id !== id);
          updateDatabase(updated);
          toast.success("Registro eliminado correctamente.");
        }
      }
    });
  };

  // Suspender usuario (Clerk)
  const handleSuspend = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: "Suspender Usuario",
      message: `¿Estás seguro de que deseas suspender al usuario con ID ${id}? Esto revocará sus sesiones activas y le impedirá iniciar sesión en la plataforma.`,
      confirmText: "Suspender",
      cancelText: "Cancelar",
      confirmColor: "clay",
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/control/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: id, action: 'suspend' })
          });
          const data = await response.json();
          if (data.success) {
            await fetchClerkUsers();
            toast.success("Usuario suspendido correctamente en Clerk.");
          } else {
            toast.error(`Error al suspender en Clerk: ${data.error}`);
          }
        } catch (error) {
          console.error("Error suspending user:", error);
          toast.error("Ocurrió un error inesperado al intentar suspender el usuario.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Activar usuario (Clerk)
  const handleActivate = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: "Activar Usuario",
      message: `¿Estás seguro de que deseas activar al usuario con ID ${id}? Esto le permitirá volver a iniciar sesión y utilizar todas las funciones del sitio.`,
      confirmText: "Activar",
      cancelText: "Cancelar",
      confirmColor: "sage",
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/control/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: id, action: 'activate' })
          });
          const data = await response.json();
          if (data.success) {
            await fetchClerkUsers();
            toast.success("Usuario activado correctamente en Clerk.");
          } else {
            toast.error(`Error al activar en Clerk: ${data.error}`);
          }
        } catch (error) {
          console.error("Error activating user:", error);
          toast.error("Ocurrió un error inesperado al intentar activar el usuario.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-forest/40 backdrop-blur-md">
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Ventana Modal principal */}
      <div className="relative bg-brand-beige rounded-3xl border border-brand-sand shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up z-10">

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
            showAdd={sectionId !== 'productos' && sectionId !== 'disputas'}
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-brand-sand/60 shadow-sm space-y-3">
              <div className="w-9 h-9 border-4 border-brand-sage/20 border-t-brand-sage rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-brand-forest/60 tracking-wider uppercase">Procesando datos...</p>
            </div>
          ) : (
            <>
              {/* Tabla de registros */}
              <AdminTable
                sectionId={sectionId}
                records={paginatedRecords}
                onEditClick={handleOpenEdit}
                onDeleteClick={handleDelete}
                onSuspendClick={handleSuspend}
                onActivateClick={handleActivate}
              />

              {/* Barra inferior de paginación */}
              <AdminTablePagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Custom Confirmation Modal Dialog */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-forest/60 backdrop-blur-sm animate-fade-in">
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
          ></div>
          <div className="relative bg-white rounded-3xl border border-brand-sand shadow-2xl p-6 max-w-sm w-full space-y-4 animate-scale-up z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full border ${confirmState.confirmColor === 'sage'
                ? 'bg-brand-sage/10 border-brand-sage/20 text-brand-sage'
                : 'bg-brand-clay/10 border-brand-clay/20 text-brand-clay'
                }`}>
                {confirmState.confirmColor === 'sage' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                  </svg>
                )}
              </div>
              <h3 className="text-base font-bold text-brand-forest">
                {confirmState.title}
              </h3>
            </div>
            <p className="text-xs text-brand-forest/70 font-light leading-relaxed">
              {confirmState.message}
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-brand-sand/50">
              <button
                type="button"
                onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-brand-sand rounded-xl text-xs font-semibold text-brand-forest/70 hover:bg-brand-beige transition-colors cursor-pointer"
              >
                {confirmState.cancelText || "Cancelar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmState.onConfirm();
                  setConfirmState(prev => ({ ...prev, isOpen: false }));
                }}
                className={`px-5 py-2 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer ${confirmState.confirmColor === 'sage'
                  ? 'bg-brand-sage hover:bg-brand-forest'
                  : 'bg-brand-clay hover:bg-brand-forest'
                  }`}
              >
                {confirmState.confirmText || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
