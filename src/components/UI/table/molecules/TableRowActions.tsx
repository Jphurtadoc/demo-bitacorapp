import TableActionButton from './TableActionButton';
import type { TableActionItem } from '../types';

interface TableRowActionsProps {
  items: TableActionItem[];
}

export default function TableRowActions({ items }: TableRowActionsProps) {
  return (
    <div
      className="flex items-center gap-0.5"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {items.map((item, index) => (
        <TableActionButton key={item.id ?? `${item.label}-${index}`} {...item} />
      ))}
    </div>
  );
}
