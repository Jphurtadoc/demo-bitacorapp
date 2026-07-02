export type UserLogType = 'info' | 'success' | 'warning' | 'danger';

export interface UserLog {
  id: string;
  fecha: string;
  accion: string;
  modulo: string;
  detalle: string;
  ip: string;
  tipo: UserLogType;
}
