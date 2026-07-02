import type { UserLog } from '@/types/userLog';

const logTemplates: Omit<UserLog, 'id'>[] = [
  {
    fecha: '2026-06-30 14:32',
    accion: 'Inicio de sesión',
    modulo: 'Autenticación',
    detalle: 'Acceso exitoso desde navegador web',
    ip: '190.85.42.18',
    tipo: 'success',
  },
  {
    fecha: '2026-06-30 11:15',
    accion: 'Actualización de perfil',
    modulo: 'Usuarios',
    detalle: 'Se actualizó el correo electrónico del usuario',
    ip: '190.85.42.18',
    tipo: 'info',
  },
  {
    fecha: '2026-06-29 16:48',
    accion: 'Asignación de cliente',
    modulo: 'Administración',
    detalle: 'Cliente asignado al usuario',
    ip: '181.49.112.7',
    tipo: 'info',
  },
  {
    fecha: '2026-06-29 09:02',
    accion: 'Intento de acceso fallido',
    modulo: 'Autenticación',
    detalle: 'Contraseña incorrecta (intento 1 de 3)',
    ip: '181.49.112.7',
    tipo: 'warning',
  },
  {
    fecha: '2026-06-28 18:20',
    accion: 'Cambio de contraseña',
    modulo: 'Seguridad',
    detalle: 'Contraseña actualizada correctamente',
    ip: '190.85.42.18',
    tipo: 'success',
  },
  {
    fecha: '2026-06-28 08:55',
    accion: 'Exportación de reporte',
    modulo: 'Reportes',
    detalle: 'Exportó listado de rondas en formato Excel',
    ip: '190.85.42.18',
    tipo: 'info',
  },
  {
    fecha: '2026-06-27 22:10',
    accion: 'Cierre de sesión',
    modulo: 'Autenticación',
    detalle: 'Sesión finalizada por el usuario',
    ip: '190.85.42.18',
    tipo: 'info',
  },
  {
    fecha: '2026-06-27 15:33',
    accion: 'Eliminación de asignación',
    modulo: 'Administración',
    detalle: 'Se removió un cliente de la cuenta del usuario',
    ip: '181.49.112.7',
    tipo: 'danger',
  },
];

const logsCountByUser: Record<string, number> = {
  '1': 8,
  '2': 6,
  '3': 4,
  '5': 7,
  '6': 3,
  '7': 5,
  '8': 6,
  '9': 2,
  '10': 8,
};

export function getUserLogs(userId: string): UserLog[] {
  const count = logsCountByUser[userId] ?? 5;

  return logTemplates.slice(0, count).map((log, index) => ({
    ...log,
    id: `${userId}-log-${index + 1}`,
  }));
}
