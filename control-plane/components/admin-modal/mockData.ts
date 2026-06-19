// Base de datos simulada en memoria del cliente para persistir cambios mientras dure la sesión.
export const mockDatabase: Record<string, any[]> = {
  usuarios: [
    { id: "USR-001", nombre: "Sofía Alarcón", email: "sofia.alarcon@email.com", rol: "Cliente", estado: "Activo" },
    { id: "USR-002", nombre: "Mateo Benítez", email: "mateo.b@email.com", rol: "Cliente", estado: "Activo" },
    { id: "USR-003", nombre: "Valentina Costa", email: "valen.costa@email.com", rol: "Moderador", estado: "Activo" },
    { id: "USR-004", nombre: "Javier Díaz", email: "javier.diaz@email.com", rol: "Cliente", estado: "Suspendido" },
    { id: "USR-005", nombre: "Lucía Fernández", email: "lucia.f@email.com", rol: "Administrador", estado: "Activo" },
    { id: "USR-006", nombre: "Nicolás Gómez", email: "nicolas.g@email.com", rol: "Cliente", estado: "Activo" },
    { id: "USR-007", nombre: "Camila Herrera", email: "camila.h@email.com", rol: "Cliente", estado: "Activo" },
    { id: "USR-008", nombre: "Tomás Ibarra", email: "tomas.i@email.com", rol: "Cliente", estado: "Suspendido" },
    { id: "USR-009", nombre: "Martina Juarez", email: "marti.j@email.com", rol: "Cliente", estado: "Activo" },
    { id: "USR-010", nombre: "Lucas López", email: "lucas.lopez@email.com", rol: "Cliente", estado: "Activo" }
  ],
  productos: [
    { id: "PRD-001", titulo: "Ficciones", autor: "Jorge Luis Borges", precio: 15500, stock: 12 },
    { id: "PRD-002", titulo: "Rayuela", autor: "Julio Cortázar", precio: 18900, stock: 5 },
    { id: "PRD-003", titulo: "El Aleph", autor: "Jorge Luis Borges", precio: 14200, stock: 8 },
    { id: "PRD-004", titulo: "100 años de Soledad", autor: "Gabriel García Márquez", precio: 22000, stock: 15 },
    { id: "PRD-005", titulo: "Pedro Páramo", autor: "Juan Rulfo", precio: 11500, stock: 0 },
    { id: "PRD-006", titulo: "El túnel", autor: "Ernesto Sabato", precio: 13800, stock: 4 },
    { id: "PRD-007", titulo: "Adán Buenosayres", autor: "Leopoldo Marechal", precio: 19500, stock: 3 },
    { id: "PRD-008", titulo: "Sobre héroes y tumbas", autor: "Ernesto Sabato", precio: 21000, stock: 9 }
  ],
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
