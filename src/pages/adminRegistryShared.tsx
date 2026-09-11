import type { ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { Surface } from '@/components/UI/surface';

export const PAGE_SIZE = 5;
export const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50] as const;

export const inputClassName =
  'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-border focus:ring-2 focus:ring-brand/10';

export const inputErrorClassName =
  'w-full rounded-xl border border-red-300 bg-red-50/40 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:focus:border-red-400 dark:focus:ring-red-500/20';

export type StatusFilter = 'all' | 'active' | 'inactive';
export type DrawerMode = 'detail' | 'create';

export function getDefaultPhoto(label: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=5B67C7&color=fff`;
}

export function RegistryDetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Surface variant="muted" padding="sm" radius="xl">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </Surface>
  );
}

export function RegistryFormField({
  label,
  required = false,
  error,
  className = '',
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-subtle">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}

export function RegistryAvatarEditor({
  photo,
  alt,
  editing,
  onPhotoClick,
}: {
  photo: string;
  alt: string;
  editing: boolean;
  onPhotoClick: () => void;
}) {
  return (
    <div className="relative w-fit">
      <div className="rounded-full border-2 border-dashed border-border p-1.5">
        <img src={photo} alt={alt} className="h-24 w-24 rounded-full border border-border object-cover" />
      </div>
      {editing ? (
        <button
          type="button"
          onClick={onPhotoClick}
          title="Cambiar foto"
          className="absolute bottom-2 right-0 flex h-9 w-9 translate-x-3 -translate-y-2 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-md transition-colors hover:bg-brand-hover"
        >
          <Camera size={16} />
        </button>
      ) : null}
    </div>
  );
}

export function ConfirmModalContent({
  icon,
  iconClassName,
  children,
}: {
  icon: ReactNode;
  iconClassName: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-2 text-center">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${iconClassName}`}>
        {icon}
      </div>
      <div className="mt-6 max-w-md">{children}</div>
    </div>
  );
}

export function ConfirmModalFooter({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmIcon,
  confirmClassName,
  confirmDisabled = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmIcon: ReactNode;
  confirmClassName: string;
  confirmDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-border bg-surface px-5 py-3 text-base font-semibold text-foreground hover:bg-muted"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${confirmClassName}`}
      >
        {confirmIcon}
        {confirmLabel}
      </button>
    </div>
  );
}

export function nextRecordId(ids: string[]) {
  return String(ids.reduce((max, id) => Math.max(max, Number.parseInt(id, 10) || 0), 0) + 1);
}
