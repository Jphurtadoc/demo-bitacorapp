import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import mockNotifications from '@/data/mockNotifications.json';
import { PQRS_TYPE_LABEL, type PqrsTicket } from '@/types/pqrs';
import type { AppNotification, AppNotificationKind } from '@/types/notification';

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (input: Omit<AppNotification, 'id' | 'read' | 'createdAt'> & { createdAt?: string }) => void;
  notifyPqrsNueva: (ticket: Pick<PqrsTicket, 'radicado' | 'tipo' | 'asunto' | 'cliente'>) => void;
  notifyPqrsAsignada: (
    ticket: Pick<PqrsTicket, 'radicado' | 'tipo' | 'asunto'>,
    assigneeName: string,
  ) => void;
  notifyPqrsRespondida: (ticket: Pick<PqrsTicket, 'radicado' | 'tipo' | 'asunto'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function nowTimestamp() {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function nextId(items: AppNotification[]) {
  const max = items.reduce((acc, item) => {
    const match = item.id.match(/(\d+)$/);
    return Math.max(acc, match ? Number.parseInt(match[1], 10) : 0);
  }, 0);
  return `n${max + 1}`;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    mockNotifications as AppNotification[],
  );

  const addNotification = useCallback(
    (input: Omit<AppNotification, 'id' | 'read' | 'createdAt'> & { createdAt?: string }) => {
      setNotifications((current) => [
        {
          id: nextId(current),
          read: false,
          createdAt: input.createdAt ?? nowTimestamp(),
          kind: input.kind,
          title: input.title,
          message: input.message,
          path: input.path,
        },
        ...current,
      ]);
    },
    [],
  );

  const notifyPqrsNueva = useCallback(
    (ticket: Pick<PqrsTicket, 'radicado' | 'tipo' | 'asunto' | 'cliente'>) => {
      addNotification({
        kind: 'pqrs_nueva',
        title: `Nueva PQRS ${ticket.radicado}`,
        message: `${PQRS_TYPE_LABEL[ticket.tipo]}: ${ticket.asunto} · ${ticket.cliente}`,
        path: '/pqrs/inbox',
      });
    },
    [addNotification],
  );

  const notifyPqrsAsignada = useCallback(
    (ticket: Pick<PqrsTicket, 'radicado' | 'tipo' | 'asunto'>, assigneeName: string) => {
      addNotification({
        kind: 'pqrs_asignada',
        title: `PQRS asignada ${ticket.radicado}`,
        message: `${PQRS_TYPE_LABEL[ticket.tipo]} asignada a ${assigneeName} · ${ticket.asunto}`,
        path: '/pqrs/inbox',
      });
    },
    [addNotification],
  );

  const notifyPqrsRespondida = useCallback(
    (ticket: Pick<PqrsTicket, 'radicado' | 'tipo' | 'asunto'>) => {
      addNotification({
        kind: 'pqrs_respondida',
        title: `PQRS respondida ${ticket.radicado}`,
        message: `Se envió la respuesta de ${PQRS_TYPE_LABEL[ticket.tipo]} · ${ticket.asunto}`,
        path: '/pqrs/inbox',
      });
    },
    [addNotification],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      notifyPqrsNueva,
      notifyPqrsAsignada,
      notifyPqrsRespondida,
      markAsRead,
      markAllAsRead,
    }),
    [
      addNotification,
      markAllAsRead,
      markAsRead,
      notifications,
      notifyPqrsAsignada,
      notifyPqrsNueva,
      notifyPqrsRespondida,
      unreadCount,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

export function isPqrsNotification(kind: AppNotificationKind) {
  return kind.startsWith('pqrs_');
}
