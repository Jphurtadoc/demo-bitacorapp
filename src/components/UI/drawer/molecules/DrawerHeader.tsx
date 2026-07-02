import type { ReactNode } from 'react';
import DrawerCloseButton from '../atoms/DrawerCloseButton';

interface DrawerHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  headerBottom?: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function DrawerHeader({
  title,
  subtitle,
  headerActions,
  headerBottom,
  onClose,
  showCloseButton = true,
}: DrawerHeaderProps) {
  if (!title && !subtitle && !headerActions && !headerBottom && !showCloseButton) {
    return null;
  }

  return (
    <div className="shrink-0">
      <div className="flex items-start justify-between gap-3 px-5 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          {title ? (
            <h2 id="drawer-title" className="page-drawer-title">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-1 text-sm font-medium text-subtle">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {headerActions}
          {showCloseButton && onClose ? <DrawerCloseButton onClose={onClose} /> : null}
        </div>
      </div>
      {headerBottom}
    </div>
  );
}
