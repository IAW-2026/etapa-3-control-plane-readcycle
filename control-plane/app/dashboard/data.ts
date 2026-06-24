export interface DashboardMetric {
  id: string;
  name: string;
  count: number;
  unit: string;
  group: 'comunidad' | 'comercio' | 'soporte' | 'logistica';
  description: string;
}

export const groupNames = {
  comunidad: {
    title: 'Comunidad & Seguridad',
    description: 'Gestión y control de cuentas de usuarios de la plataforma.',
  },
  comercio: {
    title: 'Catálogo & E-Commerce',
    description: 'Monitoreo de publicaciones de libros, transacciones de compra y carritos activos.',
  },
  soporte: {
    title: 'Finanzas & Soporte',
    description: 'Control de transacciones de pago e intermediación en disputas de intercambio.',
  },
  logistica: {
    title: 'Logística & Distribución',
    description: 'Supervisión de despachos y estado de envíos entre lectores.',
  },
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: 'usuarios',
    name: 'Usuarios',
    count: 0,
    unit: 'usuarios registrados',
    group: 'comunidad',
    description: 'Control de perfiles, activación, suspensiones y permisos.',
  },
  {
    id: 'productos',
    name: 'Productos',
    count: 0,
    unit: 'libros publicados',
    group: 'comercio',
    description: 'Gestión del catálogo, libros en intercambio y categorías.',
  },
  {
    id: 'disputas',
    name: 'Disputas',
    count: 0,
    unit: 'casos reportados',
    group: 'soporte',
    description: 'Moderación de reclamos sobre el estado de libros o envíos.',
  },
  {
    id: 'envios',
    name: 'Envíos',
    count: 0,
    unit: 'despachos gestionados',
    group: 'logistica',
    description: 'Integraciones postales, etiquetas y entregas a domicilio.',
  },
];