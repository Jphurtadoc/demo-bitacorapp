import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { pushOverlayEscape } from '@/hooks/useOverlayEscape';
import { DEFAULT_PAGE_SIZE_OPTIONS, type TablePaginationConfig } from '../types';

interface TablePaginationProps extends TablePaginationConfig {}

const navButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-subtle transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Renders page-size selector, total count, and page navigation.
 */
export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
  onPageSizeChange,
}: TablePaginationProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const sizeOptions = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    const removeEscape = pushOverlayEscape(() => setMenuOpen(false));

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      removeEscape();
    };
  }, [menuOpen]);

  const handlePageSizeChange = (nextSize: number) => {
    if (!onPageSizeChange || nextSize === pageSize) return;
    onPageSizeChange(nextSize);
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-sm font-medium text-subtle">
        <span className="whitespace-nowrap">Mostrando</span>
        {onPageSizeChange ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="Registros por página"
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-9 min-w-[4.25rem] items-center justify-between gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-sm font-semibold tabular-nums text-foreground outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-brand/10"
            >
              <span>{pageSize}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-subtle transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen ? (
              <div
                role="listbox"
                aria-label="Registros por página"
                className="absolute bottom-full left-0 z-50 mb-1.5 min-w-full overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
              >
                {sizeOptions.map((size) => {
                  const isSelected = size === pageSize;

                  return (
                    <button
                      key={size}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handlePageSizeChange(size)}
                      className={`flex w-full items-center justify-center px-3 py-2.5 text-sm font-semibold tabular-nums transition-colors ${
                        isSelected
                          ? 'bg-brand/10 text-brand'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : (
          <span className="font-semibold tabular-nums text-foreground">{pageSize}</span>
        )}
        <span className="whitespace-nowrap">
          de <span className="font-semibold text-foreground">{total}</span>
        </span>
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
