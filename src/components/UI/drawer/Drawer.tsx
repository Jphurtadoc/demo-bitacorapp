import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayEscape } from '@/hooks/useOverlayEscape';
import DrawerHandle from './atoms/DrawerHandle';
import DrawerOverlay from './atoms/DrawerOverlay';
import DrawerBody from './molecules/DrawerBody';
import DrawerFooter from './molecules/DrawerFooter';
import DrawerHeader from './molecules/DrawerHeader';
import type { DrawerProps } from './types';
import { drawerDesktopWidthClass } from './types';

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  headerActions,
  headerBottom,
  footer,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  showHandle = true,
  className = '',
  contentClassName = '',
}: DrawerProps) {
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
      <DrawerOverlay open={open} onClose={onClose} closeOnClick={closeOnOverlayClick} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        className={`fixed z-[70] flex w-full flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out
          inset-x-0 bottom-0 max-h-[92dvh] rounded-t-2xl
          ${open ? 'translate-y-0' : 'translate-y-full'}
          md:inset-x-auto md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-full md:max-h-none md:rounded-none md:rounded-l-2xl
          ${open ? 'md:translate-x-0 md:translate-y-0' : 'md:translate-x-full md:translate-y-0'}
          ${drawerDesktopWidthClass[size]}
          ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {showHandle ? <DrawerHandle onClose={onClose} /> : null}

        <DrawerHeader
          title={title}
          subtitle={subtitle}
          headerActions={headerActions}
          headerBottom={headerBottom}
          onClose={onClose}
          showCloseButton={showCloseButton}
        />

        <DrawerBody className={contentClassName}>{children}</DrawerBody>

        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </aside>
    </>
  );

  if (typeof document === 'undefined') {
    return content;
  }

  return createPortal(content, document.body);
}
