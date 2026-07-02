import TableCheckbox from '../atoms/TableCheckbox';
import TableSortIcon from '../atoms/TableSortIcon';
import TableHeaderCell from '../molecules/TableHeaderCell';
import type { TableColumn, TableSortDirection } from '../types';

interface TableHeadProps<T> {
  columns: TableColumn<T>[];
  selectable?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleAll?: () => void;
  sortKey?: string | null;
  sortDirection?: TableSortDirection;
  onSortChange?: (key: string) => void;
}

export default function TableHead<T>({
  columns,
  selectable = false,
  allSelected = false,
  someSelected = false,
  onToggleAll,
  sortKey,
  sortDirection = null,
  onSortChange,
}: TableHeadProps<T>) {
  return (
    <thead>
      <tr className="border-b border-border bg-muted/80">
        {selectable ? (
          <th className="w-12 px-5 py-4">
            <TableCheckbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={() => onToggleAll?.()}
              ariaLabel="Seleccionar todos"
            />
          </th>
        ) : null}
        {columns.map((column) => (
          <TableHeaderCell
            key={column.key}
            align={column.align}
            width={column.width}
            sortable={column.sortable}
            sorted={sortKey === column.key}
            sortIcon={
              <TableSortIcon
                active={sortKey === column.key}
                direction={sortKey === column.key ? sortDirection : null}
              />
            }
            onSort={column.sortable ? () => onSortChange?.(column.key) : undefined}
          >
            {column.label}
          </TableHeaderCell>
        ))}
      </tr>
    </thead>
  );
}
