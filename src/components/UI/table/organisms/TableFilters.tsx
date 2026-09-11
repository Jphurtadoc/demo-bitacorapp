import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ListFilter, X } from 'lucide-react';
import { pushOverlayEscape } from '@/hooks/useOverlayEscape';
import TableBadge from '../atoms/TableBadge';
import TableFilterFieldComponent from '../molecules/TableFilterField';
import TableSearchInput from '../molecules/TableSearchInput';
import type { TableFilterField } from '../types';

interface TableFiltersProps {
  filters?: TableFilterField[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  metaLabel?: string;
}

interface ActiveFilterChip {
  id: string;
  label: string;
  displayValue: string;
  onClear: () => void;
}

function getFilterDisplayValue(filter: TableFilterField): string {
  const value = filter.value?.trim() ?? '';
  if (!value) return '';
  if (filter.type === 'select') {
    return filter.options?.find((option) => option.value === value)?.label ?? value;
  }
  return value;
}

/**
 * Renders search, a filter accordion menu, and chips for active filters.
 */
export default function TableFilters({
  filters = [],
  searchValue,
  searchPlaceholder,
  onSearchChange,
  metaLabel,
}: TableFiltersProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeChips = useMemo(() => {
    return filters.reduce<ActiveFilterChip[]>((chips, filter) => {
      const displayValue = getFilterDisplayValue(filter);
      if (!displayValue) return chips;
      chips.push({
        id: filter.id,
        label: filter.label,
        displayValue,
        onClear: () => filter.onChange?.(''),
      });
      return chips;
    }, []);
  }, [filters]);

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

  if (!filters.length && !onSearchChange && !metaLabel) return null;

  const handleToggleFilter = (filterId: string) => {
    setExpandedId((current) => (current === filterId ? null : filterId));
  };

  const handleOpenMenu = () => {
    setMenuOpen((current) => {
      const nextOpen = !current;
      if (!current) {
        const firstActive = filters.find((filter) => Boolean(getFilterDisplayValue(filter)));
        setExpandedId(firstActive?.id ?? filters[0]?.id ?? null);
      }
      return nextOpen;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {onSearchChange ? (
          <TableSearchInput
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
            className="w-full shrink-0 lg:max-w-xs"
          />
        ) : null}

        {filters.length ? (
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              id="table-filters-trigger"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? 'table-filters-panel' : undefined}
              onClick={handleOpenMenu}
              className={`inline-flex h-[42px] items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-colors ${
                menuOpen || activeChips.length
                  ? 'border-brand/30 bg-brand/10 text-brand'
                  : 'border-border bg-muted text-foreground hover:bg-surface'
              }`}
            >
              <ListFilter size={16} />
              <span>Filtros</span>
              {activeChips.length ? (
                <TableBadge tone="primary">{activeChips.length}</TableBadge>
              ) : null}
            </button>

            {menuOpen ? (
              <div
                id="table-filters-panel"
                role="region"
                aria-labelledby="table-filters-trigger"
                className="absolute left-0 top-full z-50 mt-1.5 w-[min(100vw-2rem,20rem)] overflow-visible rounded-xl border border-border bg-surface shadow-lg"
              >
                <div className="border-b border-border px-3 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-subtle">
                    Filtros
                  </p>
                </div>
                <div className="py-1">
                  {filters.map((filter) => {
                    const isExpanded = expandedId === filter.id;
                    const hasValue = Boolean(getFilterDisplayValue(filter));

                    return (
                      <div key={filter.id} className="border-b border-border last:border-b-0">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => handleToggleFilter(filter.id)}
                          className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate">{filter.label}</span>
                            {hasValue ? <TableBadge tone="primary">1</TableBadge> : null}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`shrink-0 text-subtle transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isExpanded ? (
                          <div className="px-3 pb-3">
                            <TableFilterFieldComponent {...filter} hideLabel />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex min-h-[42px] min-w-0 flex-1 flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-foreground"
            >
              <span className="truncate">
                {chip.label}: {chip.displayValue}
              </span>
              <button
                type="button"
                aria-label={`Quitar filtro ${chip.label}`}
                onClick={chip.onClear}
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-surface hover:text-foreground"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {metaLabel ? (
        <p className="shrink-0 text-sm font-semibold text-subtle">{metaLabel}</p>
      ) : null}
    </div>
  );
}
