export type AppNotificationKind = 'pqrs_nueva' | 'pqrs_asignada' | 'pqrs_respondida' | 'sistema';

export interface AppNotification {
  id: string;
  kind: AppNotificationKind;
  title: string;
  message: string;
  path: string;
  read: boolean;
  createdAt: string;
}

export const NOTIFICATION_KIND_LABEL: Record<AppNotificationKind, string> = {
  pqrs_nueva: 'PQRS',
  pqrs_asignada: 'PQRS',
  pqrs_respondida: 'PQRS',
  sistema: 'Sistema',
};
