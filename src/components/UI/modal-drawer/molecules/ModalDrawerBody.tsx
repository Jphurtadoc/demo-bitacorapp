import type { ReactNode } from 'react';

interface ModalDrawerBodyProps {
  children: ReactNode;
  className?: string;
}

export default function ModalDrawerBody({ children, className = '' }: ModalDrawerBodyProps) {
  return (
    <div className={`flex-1 overflow-y-auto px-5 py-4 md:px-6 ${className}`}>{children}</div>
  );
}
