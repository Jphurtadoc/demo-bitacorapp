export type CommunicationType = 'noticia' | 'mensaje_puesto' | 'mensaje_usuario';
export type CommunicationStatus = 'borrador' | 'publicado' | 'archivado';
export type CommunicationPriority = 'baja' | 'media' | 'alta';
export type CommunicationAudience = 'todos' | 'residentes' | 'personal' | 'administracion';
export type CommunicationScope = 'interno' | 'cliente';
export type CommunicationMediaKind = 'ninguna' | 'banner' | 'carrusel';

export interface CommunicationFile {
  id: string;
  nombre: string;
  url: string;
  tipo: string;
}

export interface Communication {
  id: string;
  tipo: CommunicationType;
  titulo: string;
  contenido: string;
  autor: string;
  alcance: CommunicationScope;
  cliente: string;
  sede: string;
  audiencia: CommunicationAudience;
  puestos: string[];
  destinatarioId: string;
  destinatarioNombre: string;
  prioridad: CommunicationPriority;
  estado: CommunicationStatus;
  requiereAcuse: boolean;
  publishedAt: string;
  mediaKind: CommunicationMediaKind;
  banner: string;
  carrusel: string[];
  archivos: CommunicationFile[];
}

export const COMMUNICATION_TYPE_LABEL: Record<CommunicationType, string> = {
  noticia: 'Noticia',
  mensaje_puesto: 'Mensaje a puestos',
  mensaje_usuario: 'Mensaje directo',
};

export const COMMUNICATION_STATUS_LABEL: Record<CommunicationStatus, string> = {
  borrador: 'Borrador',
  publicado: 'Publicado',
  archivado: 'Archivado',
};

export const COMMUNICATION_PRIORITY_LABEL: Record<CommunicationPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};

export const COMMUNICATION_AUDIENCE_LABEL: Record<CommunicationAudience, string> = {
  todos: 'Todos',
  residentes: 'Residentes',
  personal: 'Personal',
  administracion: 'Administración',
};

export const COMMUNICATION_SCOPE_LABEL: Record<CommunicationScope, string> = {
  interno: 'Equipo interno',
  cliente: 'Cliente',
};

export function getCommunicationDirectedTo(item: Pick<Communication, 'alcance' | 'cliente'>) {
  return item.alcance === 'interno' ? COMMUNICATION_SCOPE_LABEL.interno : item.cliente || 'Cliente';
}

export const COMMUNICATION_MEDIA_LABEL: Record<CommunicationMediaKind, string> = {
  ninguna: 'Sin imagen',
  banner: 'Banner',
  carrusel: 'Carrusel',
};

export function getCommunicationCover(item: Pick<Communication, 'mediaKind' | 'banner' | 'carrusel'>) {
  if (item.mediaKind === 'banner' && item.banner) return item.banner;
  if (item.mediaKind === 'carrusel' && item.carrusel[0]) return item.carrusel[0];
  return '';
}

export function formatCommunicationDate(value: string) {
  if (!value) return '—';
  const [datePart, timePart] = value.split(' ');
  const [year, month, day] = datePart.split('-');
  return timePart ? `${day}/${month}/${year} ${timePart}` : `${day}/${month}/${year}`;
}
