import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayEscape } from '@/hooks/useOverlayEscape';
import ModalDrawerHandle from './atoms/ModalDrawerHandle';
import ModalDrawerOverlay from './atoms/ModalDrawerOverlay';
import ModalDrawerBody from './molecules/ModalDrawerBody';
import ModalDrawerFooter from './molecules/ModalDrawerFooter';
import ModalDrawerHeader from './molecules/ModalDrawerHeader';
import type { ModalDrawerProps } from './types';
import { modalDrawerSizeClass } from './types';

export default function ModalDrawer({
  open,
  onClose,
  title,
  subtitle,
  headerActions,
  footer,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  contentClassName = '',
}: ModalDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useOverlayEscape(open, onClose);

  if (!open) return null;

  const content = (
    <>
      <ModalDrawerOverlay
        open={open}
        onClose={onClose}
        closeOnClick={closeOnOverlayClick}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-drawer-title' : undefined}
        className={`fixed z-[80] flex w-full flex-col bg-surface shadow-2xl transition-all duration-300 ease-out
          bottom-0 left-0 right-0 max-h-[92dvh] rounded-t-2xl
          ${open ? 'translate-y-0' : 'translate-y-full'}
          md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:max-h-[85vh] md:rounded-2xl
          ${open ? 'md:-translate-x-1/2 md:-translate-y-1/2 md:opacity-100' : 'md:pointer-events-none md:-translate-x-1/2 md:-translate-y-[calc(50%-10px)] md:opacity-0'}
          ${modalDrawerSizeClass[size]}
          ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        <ModalDrawerHandle onClose={onClose} />

        <ModalDrawerHeader
          title={title}
          subtitle={subtitle}
          headerActions={headerActions}
          onClose={onClose}
          showCloseButton={showCloseButton}
        />

        <ModalDrawerBody className={contentClassName}>{children}</ModalDrawerBody>

        {footer ? <ModalDrawerFooter>{footer}</ModalDrawerFooter> : null}
      </div>
    </>
  );

  if (typeof document === 'undefined') {
    return content;
  }

  return createPortal(content, document.body);
}
