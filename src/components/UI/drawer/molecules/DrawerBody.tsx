import type { ReactNode } from 'react';

interface DrawerBodyProps {
  children: ReactNode;
  className?: string;
}

export default function DrawerBody({ children, className = '' }: DrawerBodyProps) {
  return (
    <div className={`flex-1 overflow-y-auto px-5 py-4 md:px-6 ${className}`}>{children}</div>
  );
}
