import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Inbox, Reply, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Surface } from '@/components/UI/surface';
import { useOverlayEscape } from '@/hooks/useOverlayEscape';
import { isPqrsNotification, useNotifications } from '@/context/NotificationContext';
import { NOTIFICATION_KIND_LABEL, type AppNotificationKind } from '@/types/notification';

function formatWhen(value: string) {
  const [datePart, timePart] = value.split(' ');
  const [year, month, day] = datePart.split('-');
  return timePart ? `${day}/${month} ${timePart}` : `${day}/${month}/${year}`;
}

function kindIcon(kind: AppNotificationKind) {
  if (kind === 'pqrs_asignada') return <UserPlus size={14} />;
  if (kind === 'pqrs_respondida') return <Reply size={14} />;
  return <Inbox size={14} />;
}

export default function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const close = useCallback(() => setOpen(false), []);

  useOverlayEscape(open, close);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative hidden h-9 w-9 items-center justify-center rounded-full text-subtle transition-colors hover:bg-muted sm:flex"
        aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : 'Notificaciones'}
        aria-expanded={open}
      >
        <Bell size={18} strokeWidth={2.25} />
        {unreadCount > 0 ? (
          <span
            aria-hidden
            className={`pointer-events-none absolute -right-0.5 -top-0.5 flex h-[18px] items-center justify-center rounded-full border-2 border-surface bg-primary text-[10px] font-bold leading-none text-[#ffffff] shadow-[0_2px_6px_rgba(255,143,71,0.45)] tabular-nums ${
              unreadCount > 9 ? 'min-w-[22px] px-1' : 'w-[18px]'
            }`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <Surface
          radius="xl"
          padding="none"
          className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden shadow-lg animate-fade-in"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Centro de notificaciones</p>
              <p className="text-[11px] font-medium text-subtle">
                {unreadCount > 0 ? `${unreadCount} sin leer` : 'No hay pendientes'}
              </p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-subtle hover:bg-muted hover:text-foreground"
              >
                <CheckCheck size={14} />
                Marcar leídas
              </button>
            ) : null}
          </div>

          <div className="max-h-[min(70vh,420px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-subtle">No hay notificaciones.</p>
            ) : (
              <ul>
                {notifications.map((item) => (
                  <li key={item.id} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      onClick={() => {
                        markAsRead(item.id);
                        setOpen(false);
                        navigate(item.path);
                      }}
                      className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${
                        item.read ? 'bg-surface' : 'bg-brand/5'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isPqrsNotification(item.kind)
                            ? 'bg-brand/10 text-brand'
                            : 'bg-muted text-subtle'
                        }`}
                      >
                        {kindIcon(item.kind)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-subtle">
                            {NOTIFICATION_KIND_LABEL[item.kind]}
                          </span>
                          <span className="text-[10px] font-medium text-subtle">{formatWhen(item.createdAt)}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-subtle">{item.message}</span>
                      </span>
                      {!item.read ? (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Surface>
      ) : null}
    </div>
  );
}
