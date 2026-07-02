import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  size?: 'lg' | 'md';
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  size = 'lg',
  className = '',
}: PageHeaderProps) {
  const titleClass =
    size === 'lg'
      ? 'page-header-title page-header-title-lg'
      : 'page-header-title page-header-title-md';

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`.trim()}
    >
      <div>
        <h1 className={titleClass}>{title}</h1>
        {subtitle ? <p className="page-header-subtitle mt-1">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
