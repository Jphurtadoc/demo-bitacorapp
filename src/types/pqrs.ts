export type PqrsType = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';
export type PqrsStatus = 'nuevo' | 'en_proceso' | 'respondido' | 'cerrado';
export type PqrsChannel = 'web' | 'email' | 'presencial' | 'telefono';
export type PqrsSlaLevel = 'verde' | 'amarillo' | 'rojo';
export type PqrsViewMode = 'tabla' | 'semaforo';
export type PqrsAssigneeKind = 'persona' | 'area';

export interface PqrsRequestType {
  id: string;
  codigo: string;
  nombre: string;
  slaHoras: number;
  activa: boolean;
}

export interface PqrsAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
}

export interface PqrsTicket {
  id: string;
  radicado: string;
  tipo: PqrsType;
  asunto: string;
  descripcion: string;
  solicitante: string;
  email: string;
  telefono: string;
  cliente: string;
  sede: string;
  estado: PqrsStatus;
  canal: PqrsChannel;
  createdAt: string;
  dueAt: string;
  assignedKind?: PqrsAssigneeKind | null;
  assignedToId: string | null;
  assignedToName: string | null;
  assignmentNote: string;
  attachments?: PqrsAttachment[];
  respuesta?: string;
  respuestaAt?: string;
  respuestaAttachments?: PqrsAttachment[];
}

export const PQRS_TYPE_LABEL: Record<PqrsType, string> = {
  peticion: 'Petición',
  queja: 'Queja',
  reclamo: 'Reclamo',
  sugerencia: 'Sugerencia',
};

export const PQRS_STATUS_LABEL: Record<PqrsStatus, string> = {
  nuevo: 'Nuevo',
  en_proceso: 'En proceso',
  respondido: 'Respondido',
  cerrado: 'Cerrado',
};

export const PQRS_CHANNEL_LABEL: Record<PqrsChannel, string> = {
  web: 'Web',
  email: 'Correo',
  presencial: 'Presencial',
  telefono: 'Teléfono',
};

export const PQRS_SLA_LABEL: Record<PqrsSlaLevel, string> = {
  verde: 'A tiempo',
  amarillo: 'Riesgo',
  rojo: 'Vencidos',
};

const RISK_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getPqrsSlaLevel(ticket: Pick<PqrsTicket, 'dueAt' | 'estado'>, now = Date.now()): PqrsSlaLevel {
  if (ticket.estado === 'cerrado' || ticket.estado === 'respondido') return 'verde';

  const remaining = new Date(ticket.dueAt.replace(' ', 'T')).getTime() - now;
  if (remaining < 0) return 'rojo';
  if (remaining <= RISK_WINDOW_MS) return 'amarillo';
  return 'verde';
}

export function formatPqrsDate(value: string) {
  const [datePart, timePart] = value.split(' ');
  const [year, month, day] = datePart.split('-');
  return timePart ? `${day}/${month}/${year} ${timePart}` : `${day}/${month}/${year}`;
}

export function getPqrsAssigneeKind(ticket: Pick<PqrsTicket, 'assignedKind' | 'assignedToId'>): PqrsAssigneeKind | null {
  if (ticket.assignedKind) return ticket.assignedKind;
  return ticket.assignedToId ? 'persona' : null;
}

export function toDatetimeLocal(value: string) {
  return value.replace(' ', 'T').slice(0, 16);
}

export function fromDatetimeLocal(value: string) {
  return value.replace('T', ' ');
}

export function formatPqrsFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isPqrsImageAttachment(attachment: Pick<PqrsAttachment, 'type' | 'name'>) {
  if (attachment.type.startsWith('image/')) return true;
  return /\.(png|jpe?g|webp|gif)$/i.test(attachment.name);
}

export function nextPqrsRadicado(existing: string[]) {
  const max = existing.reduce((acc, radicado) => {
    const match = radicado.match(/(\d+)$/);
    return Math.max(acc, match ? Number.parseInt(match[1], 10) : 0);
  }, 0);
  return `PQRS-2026-${String(max + 1).padStart(4, '0')}`;
}
