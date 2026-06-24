'use client';

interface AdminFormProps {
  sectionId: string;
  formData: Record<string, any>;
  setFormData: (data: any) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingId?: string | null;
}

function formatLabelKey(key: string): string {
  const spaced = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\bid\b/gi, 'ID');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
}

function getSelectOptions(key: string, sectionId: string): string[] | null {
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'rol') return ["Cliente", "Moderador", "Administrador"];
  if (lowerKey === 'metodo') return ["MercadoPago", "Tarjeta de Crédito", "Tarjeta de Débito", "Transferencia"];
  if (lowerKey === 'correo') return ["Andreani", "Correo Argentino", "OCA"];
  if (lowerKey === 'severidad') return ["Baja", "Media", "Alta"];
  if (lowerKey === 'estado') {
    if (sectionId === 'usuarios') return ["Activo", "Suspendido"];
    if (sectionId === 'productos') return ["Disponible", "Agotado"];
    if (sectionId === 'ordenes') return ["Pendiente", "Procesando", "Completada", "Cancelada"];
    if (sectionId === 'carritos') return ["Activo", "Abandonado"];
    if (sectionId === 'transacciones') return ["Pendiente", "Aprobada", "Rechazada"];
    if (sectionId === 'disputas') return ["Pendiente", "En Revisión", "Resuelta"];
    if (sectionId === 'envios') return ["Preparación", "En Camino", "Entregado"];
  }
  return null;
}

export default function AdminForm({
  sectionId,
  formData,
  setFormData,
  onSave,
  onCancel,
  editingId
}: AdminFormProps) {
  // Obtenemos los campos del registro excluyendo el 'id' (que se autogenera)
  const fields = Object.entries(formData).filter(([key]) => key !== 'id');

  return (
    <form onSubmit={onSave} className="bg-white p-5 rounded-2xl border border-brand-sage/20 shadow-md space-y-4 animate-fade-in">
      <div className="flex justify-between items-center border-b border-brand-sand/60 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-sage">
          {editingId ? `Modificar Registro (${editingId})` : "Dar de Alta Nuevo Registro"}
        </h3>
        <button 
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-brand-clay hover:underline cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(([key, value]) => {
          const selectOptions = getSelectOptions(key, sectionId);
          const isNumber = typeof value === 'number';

          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-forest/65">
                {formatLabelKey(key)}
              </label>
              
              {selectOptions ? (
                <select
                  value={formData[key] ?? selectOptions[0]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="border border-brand-sand rounded-xl px-3 py-2 bg-brand-beige/40 focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage text-sm cursor-pointer"
                >
                  {selectOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={key === 'password' ? 'password' : (isNumber ? "number" : "text")}
                  required
                  min={isNumber ? "0" : undefined}
                  value={formData[key] ?? ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    [key]: isNumber ? Number(e.target.value) : e.target.value
                  })}
                  placeholder={`Ingrese ${formatLabelKey(key).toLowerCase()}...`}
                  className="border border-brand-sand rounded-xl px-3 py-2 bg-brand-beige/40 focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage text-sm"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-brand-sand/50">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-brand-sand rounded-xl text-xs font-semibold text-brand-forest/70 hover:bg-brand-beige transition-colors cursor-pointer"
        >
          Cerrar
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-brand-sage hover:bg-brand-forest text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          Guardar Datos
        </button>
      </div>
    </form>
  );
}
