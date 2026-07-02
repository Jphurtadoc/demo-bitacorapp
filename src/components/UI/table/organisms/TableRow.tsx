import type { ReactNode } from 'react';
import TableCheckbox from '../atoms/TableCheckbox';

interface TableRowProps {
  children: ReactNode;
  selected?: boolean;
  selectable?: boolean;
  onToggleSelect?: () => void;
  onClick?: () => void;
}

export default function TableRow({
  children,
  selected = false,
  selectable = false,
  onToggleSelect,
  onClick,
}: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${selected ? 'bg-brand/5' : 'hover:bg-muted/80'} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {selectable ? (
        <td className="w-12 px-5 py-4" onClick={(event) => event.stopPropagation()}>
          <TableCheckbox
            checked={selected}
            onChange={() => onToggleSelect?.()}
            ariaLabel="Seleccionar fila"
          />
        </td>
      ) : null}
      {children}
    </tr>
  );
}
