import type { ReactNode } from 'react';
import TableActionButton from '../molecules/TableActionButton';
import type { TableActionItem } from '../types';

interface TableActionsProps {
  items?: TableActionItem[];
  children?: ReactNode;
  className?: string;
}

export default function TableActions({
  items = [],
  children,
  className = '',
}: TableActionsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((item, index) => (
        <TableActionButton key={item.id ?? `${item.label}-${index}`} {...item} />
      ))}
      {children}
    </div>
  );
}
