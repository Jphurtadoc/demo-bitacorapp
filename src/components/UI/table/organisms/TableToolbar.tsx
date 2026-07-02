import type { ReactNode } from 'react';

interface TableToolbarProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function TableToolbar({ title, subtitle, actions }: TableToolbarProps) {
  if (!title && !subtitle && !actions) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {(title || subtitle) && (
        <div>
          {title ? (
            <h2 className="page-header-title page-header-title-sm">{title}</h2>
          ) : null}
          {subtitle ? <p className="mt-1 text-sm font-medium text-subtle">{subtitle}</p> : null}
        </div>
      )}
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
