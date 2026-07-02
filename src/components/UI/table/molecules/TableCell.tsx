import type { ReactNode } from 'react';
import type { TableAlign } from '../types';

interface TableCellProps {
  children: ReactNode;
  align?: TableAlign;
  className?: string;
}

const alignClass: Record<TableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export default function TableCell({
  children,
  align = 'left',
  className = '',
}: TableCellProps) {
  return (
    <td className={`px-5 py-4 text-sm text-foreground ${alignClass[align]} ${className}`}>
      {children}
    </td>
  );
}
