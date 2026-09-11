import type { ReactNode } from 'react';
import { Surface } from '@/components/UI/surface';

interface TableContainerProps {
  children: ReactNode;
  className?: string;
}

export default function TableContainer({ children, className = '' }: TableContainerProps) {
  return (
    <Surface radius="lg" className={`overflow-hidden ${className}`}>{children}</Surface>
  );
}
