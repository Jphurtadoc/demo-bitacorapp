import type { ReactNode } from 'react';

interface ModalDrawerFooterProps {
  children: ReactNode;
  className?: string;
}

export default function ModalDrawerFooter({ children, className = '' }: ModalDrawerFooterProps) {
  return (
    <div
      className={`shrink-0 border-t border-border bg-muted/80 px-5 py-4 md:px-6 ${className}`}
    >
      {children}
    </div>
  );
}
