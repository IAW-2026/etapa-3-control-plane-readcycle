'use client';

interface AdminTableProps {
  sectionId: string;
  records: any[];
  onEditClick: (item: any) => void;
  onDeleteClick: (id: string) => void;
  onSuspendClick?: (id: string) => void;
  onActivateClick?: (id: string) => void;
}

function formatHeaderKey(key: string): string {
  // Convierte camelCase o snake_case o palabras conjuntas en títulos legibles
  const spaced = key
    .replace(/([A-Z])/g, ' $1') // agrega espacio antes de mayúsculas
    .replace(/[_-]/g, ' ')      // reemplaza guiones por espacios
    .replace(/\bid\b/gi, 'ID');  // resalta la palabra ID
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).trim();
}

function renderStatusBadge(val: string) {
  const positiveStates = ["activo", "aprobada", "entregado", "completada", "resuelta"];
  const warningStates = ["procesando", "en camino", "pendiente", "en revisión", "preparación"];
  const negativeStates = ["suspendido", "rechazada", "cancelada", "abandonado"];
  
  const cleanVal = val.toLowerCase();
  
  if (positiveStates.includes(cleanVal)) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700">
        {val}
      </span>
    );
  }
  if (warningStates.includes(cleanVal)) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800">
        {val}
      </span>
    );
  }
  if (negativeStates.includes(cleanVal)) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-clay/10 text-brand-clay">
        {val}
      </span>
    );
  }
  
  return (
    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-sand/50 text-brand-forest">
      {val}
    </span>
  );
}

export default function AdminTable({
  sectionId,
  records,
  onEditClick,
  onDeleteClick,
  onSuspendClick,
  onActivateClick
}: AdminTableProps) {
  // Obtenemos las llaves del primer registro (excluyendo el id que se muestra destacado en la primera columna)
  const columns = records.length > 0 
    ? Object.keys(records[0]).filter(key => key !== 'id') 
    : [];

  const renderCell = (key: string, value: any) => {
    if (value === null || value === undefined) return "-";
    
    // Si la llave del campo sugiere un monto/precio y es numérico, lo formateamos como ARS
    const lowerKey = key.toLowerCase();
    const isCurrency = lowerKey.includes("precio") || lowerKey.includes("monto") || lowerKey.includes("total");
    
    if (isCurrency && typeof value === 'number') {
      return <span className="font-mono">${value.toLocaleString('es-AR')}</span>;
    }
    
    // Si la llave es un ID de referencia (ej: idOrden), le damos formato de código monospaciado
    if (lowerKey.includes("id") && typeof value === 'string') {
      return <span className="font-mono font-semibold text-brand-forest/70">{value}</span>;
    }

    // Si la llave representa un estado, rol o severidad, usamos badges
    if (lowerKey === "estado" || lowerKey === "rol" || lowerKey === "severidad") {
      return renderStatusBadge(String(value));
    }

    // Formato general
    return String(value);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-sand/60 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs text-brand-forest">
          <thead className="bg-brand-beige/40 text-brand-forest/70 uppercase tracking-wider text-[10px] border-b border-brand-sand/60">
            <tr>
              <th className="px-5 py-3 font-bold">ID</th>
              {columns.map((col) => (
                <th key={col} className="px-5 py-3 font-bold">
                  {formatHeaderKey(col)}
                </th>
              ))}
              <th className="px-5 py-3 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand/40">
            {records.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-5 py-8 text-center text-brand-forest/50 font-light italic">
                  No se encontraron registros en este módulo.
                </td>
              </tr>
            ) : (
              records.map((row) => (
                <tr key={row.id} className="hover:bg-brand-beige/10 transition-colors">
                  <td className="px-5 py-3.5 font-bold font-mono text-brand-sage">{row.id}</td>
                  
                  {columns.map((col) => (
                    <td key={col} className="px-5 py-3.5 max-w-[200px] truncate">
                      {renderCell(col, row[col])}
                    </td>
                  ))}

                  {/* Acciones de cada Fila */}
                  <td className="px-5 py-3.5 text-right flex justify-end gap-1.5">
                    {sectionId === 'usuarios' ? (
                      <>
                        {row.estado === 'Activo' ? (
                          <button
                            onClick={() => onSuspendClick?.(row.id)}
                            className="p-1 text-brand-clay hover:bg-brand-clay/10 rounded-lg transition-colors cursor-pointer"
                            title="Suspender"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => onActivateClick?.(row.id)}
                            className="p-1 text-brand-sage hover:bg-brand-sage/10 rounded-lg transition-colors cursor-pointer"
                            title="Activar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteClick(row.id)}
                          className="p-1 text-brand-clay hover:bg-brand-clay/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        {sectionId !== 'productos' && (
                          <button
                            onClick={() => onEditClick(row)}
                            className="p-1 text-brand-sage hover:bg-brand-sage/10 rounded-lg transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteClick(row.id)}
                          className="p-1 text-brand-clay hover:bg-brand-clay/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
