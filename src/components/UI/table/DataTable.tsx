import { useMemo } from 'react';
import TableEmptyState from './atoms/TableEmptyState';
import TableCell from './molecules/TableCell';
import TableActions from './organisms/TableActions';
import TableBody from './organisms/TableBody';
import TableContainer from './organisms/TableContainer';
import TableFilters from './organisms/TableFilters';
import TableHead from './organisms/TableHead';
import TablePagination from './organisms/TablePagination';
import TableRow from './organisms/TableRow';
import TableTabs from './organisms/TableTabs';
import TableToolbar from './organisms/TableToolbar';
import type { DataTableProps, TableSortDirection } from './types';

function getNextSortDirection(
  currentKey: string | null | undefined,
  columnKey: string,
  currentDirection: TableSortDirection,
): TableSortDirection {
  if (currentKey !== columnKey) return 'asc';
  if (currentDirection === 'asc') return 'desc';
  if (currentDirection === 'desc') return null;
  return 'asc';
}

export default function DataTable<T extends { id: string }>({
  title,
  subtitle,
  columns,
  data,
  tabs,
  activeTab,
  onTabChange,
  filters,
  searchValue,
  searchPlaceholder = 'Buscar...',
  onSearchChange,
  actions,
  actionItems,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sortKey,
  sortDirection = null,
  onSortChange,
  emptyMessage,
  metaLabel,
  pagination,
  headerSlot,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected = data.length > 0 && data.every((row) => selectedSet.has(row.id));
  const someSelected = data.some((row) => selectedSet.has(row.id));

  const handleToggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
      return;
    }
    onSelectionChange(data.map((row) => row.id));
  };

  const handleToggleRow = (rowId: string) => {
    if (!onSelectionChange) return;
    if (selectedSet.has(rowId)) {
      onSelectionChange(selectedIds.filter((id) => id !== rowId));
      return;
    }
    onSelectionChange([...selectedIds, rowId]);
  };

  const handleSort = (columnKey: string) => {
    if (!onSortChange) return;
    const nextDirection = getNextSortDirection(sortKey, columnKey, sortDirection);
    onSortChange(columnKey, nextDirection);
  };

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <TableToolbar
        title={title}
        subtitle={subtitle}
        actions={
          actionItems?.length ? (
            <TableActions items={actionItems} />
          ) : (
            actions
          )
        }
      />

      {headerSlot}

      <TableFilters
        filters={filters}
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={onSearchChange}
        metaLabel={metaLabel}
      />

      <TableContainer>
        {tabs?.length ? (
          <TableTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <TableHead
              columns={columns}
              selectable={selectable}
              allSelected={allSelected}
              someSelected={someSelected}
              onToggleAll={handleToggleAll}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSortChange={handleSort}
            />
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  selectable={selectable}
                  selected={selectedSet.has(row.id)}
                  onToggleSelect={() => handleToggleRow(row.id)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} align={column.align}>
                      {column.render
                        ? column.render(row, rowIndex)
                        : String((row as Record<string, unknown>)[column.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>

        {!data.length ? <TableEmptyState message={emptyMessage} /> : null}
        {pagination ? <TablePagination {...pagination} /> : null}
      </TableContainer>
    </div>
  );
}
