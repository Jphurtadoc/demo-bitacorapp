import type { ReactNode } from 'react';
import ModalDrawerCloseButton from '../atoms/ModalDrawerCloseButton';

interface ModalDrawerHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function ModalDrawerHeader({
  title,
  subtitle,
  headerActions,
  onClose,
  showCloseButton = true,
}: ModalDrawerHeaderProps) {
  if (!title && !subtitle && !headerActions && !showCloseButton) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4 md:px-6">
      <div className="min-w-0 flex-1">
        {title ? (
          <h2 id="modal-drawer-title" className="page-drawer-title">
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p className="mt-1 text-sm font-medium text-subtle">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {headerActions}
        {showCloseButton && onClose ? (
          <ModalDrawerCloseButton onClose={onClose} />
        ) : null}
      </div>
    </div>
  );
}
