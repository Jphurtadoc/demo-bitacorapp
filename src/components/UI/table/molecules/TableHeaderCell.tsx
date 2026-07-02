import type { ReactNode } from 'react';
import type { TableAlign } from '../types';

interface TableHeaderCellProps {
  children: ReactNode;
  align?: TableAlign;
  width?: string;
  sortable?: boolean;
  sorted?: boolean;
  sortIcon?: ReactNode;
  onSort?: () => void;
  className?: string;
}

const alignClass: Record<TableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export default function TableHeaderCell({
  children,
  align = 'left',
  width,
  sortable = false,
  sorted = false,
  sortIcon,
  onSort,
  className = '',
}: TableHeaderCellProps) {
  const content = (
    <span className="inline-flex items-center gap-1.5">
      <span>{children}</span>
      {sortable ? sortIcon : null}
    </span>
  );

  return (
    <th
      style={{ width }}
      className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-subtle ${alignClass[align]} ${className}`}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={`inline-flex items-center gap-1.5 transition-colors hover:text-subtle ${sorted ? 'text-brand' : ''}`}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </th>
  );
}
