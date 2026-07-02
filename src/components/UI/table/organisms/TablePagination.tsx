import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { TablePaginationConfig } from '../types';

interface TablePaginationProps extends TablePaginationConfig {}

const navButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-subtle transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50';

export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-subtle">
        Mostrando <span className="font-semibold text-foreground">{start}</span>-
        <span className="font-semibold text-foreground">{end}</span> de{' '}
        <span className="font-semibold text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className={navButtonClass}
          aria-label="Ir al principio"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={navButtonClass}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="min-w-[3.5rem] px-2 text-center text-sm font-semibold text-subtle">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={navButtonClass}
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className={navButtonClass}
          aria-label="Ir al final"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
