// Base de datos simulada en memoria del cliente para persistir cambios mientras dure la sesión.
export const mockDatabase: Record<string, any[]> = {

  ordenes: [
    { id: "ORD-901", cliente: "Mateo Benítez", fecha: "2026-06-15", total: 34400, estado: "Completada" },
    { id: "ORD-902", cliente: "Sofía Alarcón", fecha: "2026-06-17", total: 15500, estado: "Procesando" },
    { id: "ORD-903", cliente: "Nicolás Gómez", fecha: "2026-06-18", total: 41500, estado: "Completada" },
    { id: "ORD-904", cliente: "Camila Herrera", fecha: "2026-06-18", total: 22000, estado: "Pendiente" },
    { id: "ORD-905", cliente: "Javier Díaz", fecha: "2026-06-14", total: 11500, estado: "Cancelada" },
    { id: "ORD-906", cliente: "Martina Juarez", fecha: "2026-06-16", total: 18900, estado: "Completada" }
  ],
  carritos: [
    { id: "CRT-301", cliente: "Tomás Ibarra", cantidadLibros: 2, totalEstimado: 29700, estado: "Activo" },
    { id: "CRT-302", cliente: "Lucas López", cantidadLibros: 1, totalEstimado: 15500, estado: "Activo" },
    { id: "CRT-303", cliente: "Sofía Alarcón", cantidadLibros: 3, totalEstimado: 48600, estado: "Abandonado" },
    { id: "CRT-304", cliente: "Javier Díaz", cantidadLibros: 4, totalEstimado: 62000, estado: "Abandonado" },
    { id: "CRT-305", cliente: "Nicolás Gómez", cantidadLibros: 1, totalEstimado: 11500, estado: "Activo" }
  ],
  transacciones: [
    { id: "TXN-701", monto: 34400, metodo: "MercadoPago", estado: "Aprobada", fecha: "2026-06-15" },
    { id: "TXN-702", monto: 15500, metodo: "Tarjeta de Crédito", estado: "Aprobada", fecha: "2026-06-17" },
    { id: "TXN-703", monto: 41500, metodo: "MercadoPago", estado: "Aprobada", fecha: "2026-06-18" },
    { id: "TXN-704", monto: 22000, metodo: "Transferencia", estado: "Pendiente", fecha: "2026-06-18" },
    { id: "TXN-705", monto: 11500, metodo: "Tarjeta de Débito", estado: "Rechazada", fecha: "2026-06-14" }
  ],
  disputas: [
    { id: "DSP-401", idOrden: "ORD-905", motivo: "Libro no recibido", estado: "Pendiente", severidad: "Alta" },
    { id: "DSP-402", idOrden: "ORD-901", motivo: "Estado incorrecto del libro", estado: "En Revisión", severidad: "Media" },
    { id: "DSP-403", idOrden: "ORD-906", motivo: "Páginas faltantes en impresión", estado: "Resuelta", severidad: "Baja" }
  ],
  envios: [
    { id: "SHP-801", idOrden: "ORD-901", destino: "Av. Alem 1250, Bahía Blanca", correo: "Andreani", estado: "Entregado" },
    { id: "SHP-802", idOrden: "ORD-903", destino: "San Martín 450, Punta Alta", correo: "Correo Argentino", estado: "En Camino" },
    { id: "SHP-803", idOrden: "ORD-902", destino: "Mitre 89, Bahía Blanca", correo: "Andreani", estado: "Preparación" },
    { id: "SHP-804", idOrden: "ORD-906", destino: "Urquiza 742, Punta Alta", correo: "OCA", estado: "Entregado" }
  ]
};
