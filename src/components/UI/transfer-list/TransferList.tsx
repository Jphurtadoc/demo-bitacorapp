import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { Surface } from '@/components/UI/surface';
import type { TransferListItem, TransferListProps } from './types';

/**
 * Dual-pane transfer list: left = available, right = assigned.
 * Moves selected items between panes with middle controls.
 */
export default function TransferList({
  items,
  selectedIds,
  onChange,
  leftTitle = 'Disponibles',
  rightTitle = 'Asignados',
  searchPlaceholder = 'Buscar…',
  disabled = false,
  className = '',
}: TransferListProps) {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const availableItems = useMemo(
    () => items.filter((item) => !selectedSet.has(item.id)),
    [items, selectedSet],
  );

  const assignedItems = useMemo(
    () => items.filter((item) => selectedSet.has(item.id)),
    [items, selectedSet],
  );

  const filteredAvailable = useMemo(
    () => filterItems(availableItems, leftSearch),
    [availableItems, leftSearch],
  );

  const filteredAssigned = useMemo(
    () => filterItems(assignedItems, rightSearch),
    [assignedItems, rightSearch],
  );

  useEffect(() => {
    const availableIds = new Set(availableItems.map((item) => item.id));
    const assignedIds = new Set(assignedItems.map((item) => item.id));
    setLeftChecked((current) => current.filter((id) => availableIds.has(id)));
    setRightChecked((current) => current.filter((id) => assignedIds.has(id)));
  }, [availableItems, assignedItems]);

  const handleMoveRight = () => {
    if (disabled || leftChecked.length === 0) return;
    const next = [...selectedIds, ...leftChecked.filter((id) => !selectedSet.has(id))];
    onChange(next);
    setLeftChecked([]);
  };

  const handleMoveLeft = () => {
    if (disabled || rightChecked.length === 0) return;
    const remove = new Set(rightChecked);
    onChange(selectedIds.filter((id) => !remove.has(id)));
    setRightChecked([]);
  };

  const handleMoveAllRight = () => {
    if (disabled || filteredAvailable.length === 0) return;
    onChange([...selectedIds, ...filteredAvailable.map((item) => item.id)]);
    setLeftChecked([]);
  };

  const handleMoveAllLeft = () => {
    if (disabled || filteredAssigned.length === 0) return;
    const remove = new Set(filteredAssigned.map((item) => item.id));
    onChange(selectedIds.filter((id) => !remove.has(id)));
    setRightChecked([]);
  };

  return (
    <div className={`flex flex-col gap-3 lg:flex-row lg:items-stretch ${className}`}>
      <TransferPane
        title={leftTitle}
        count={filteredAvailable.length}
        search={leftSearch}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={setLeftSearch}
        items={filteredAvailable}
        checkedIds={leftChecked}
        onCheckedChange={setLeftChecked}
        disabled={disabled}
      />

      <div className="flex shrink-0 flex-row items-center justify-center gap-2 lg:flex-col lg:px-1">
        <TransferButton
          ariaLabel="Asignar seleccionados"
          onClick={handleMoveRight}
          disabled={disabled || leftChecked.length === 0}
        >
          <ChevronRight size={16} />
        </TransferButton>
        <TransferButton
          ariaLabel="Asignar visibles"
          onClick={handleMoveAllRight}
          disabled={disabled || filteredAvailable.length === 0}
        >
          <ChevronsRight size={16} />
        </TransferButton>
        <TransferButton
          ariaLabel="Quitar seleccionados"
          onClick={handleMoveLeft}
          disabled={disabled || rightChecked.length === 0}
        >
          <ChevronLeft size={16} />
        </TransferButton>
        <TransferButton
          ariaLabel="Quitar visibles"
          onClick={handleMoveAllLeft}
          disabled={disabled || filteredAssigned.length === 0}
        >
          <ChevronsLeft size={16} />
        </TransferButton>
      </div>

      <TransferPane
        title={rightTitle}
        count={filteredAssigned.length}
        search={rightSearch}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={setRightSearch}
        items={filteredAssigned}
        checkedIds={rightChecked}
        onCheckedChange={setRightChecked}
        disabled={disabled}
      />
    </div>
  );
}

function filterItems(items: readonly TransferListItem[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...items];
  return items.filter((item) => {
    const haystack = `${item.label} ${item.description ?? ''} ${item.group ?? ''}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

function TransferButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function TransferPane({
  title,
  count,
  search,
  searchPlaceholder,
  onSearchChange,
  items,
  checkedIds,
  onCheckedChange,
  disabled,
}: {
  title: string;
  count: number;
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  items: TransferListItem[];
  checkedIds: string[];
  onCheckedChange: (ids: string[]) => void;
  disabled: boolean;
}) {
  const checkedSet = useMemo(() => new Set(checkedIds), [checkedIds]);
  const allVisibleChecked = items.length > 0 && items.every((item) => checkedSet.has(item.id));

  const handleToggleAll = () => {
    if (disabled) return;
    if (allVisibleChecked) {
      const visible = new Set(items.map((item) => item.id));
      onCheckedChange(checkedIds.filter((id) => !visible.has(id)));
      return;
    }
    const merged = new Set([...checkedIds, ...items.map((item) => item.id)]);
    onCheckedChange([...merged]);
  };

  const handleToggleOne = (id: string) => {
    if (disabled) return;
    if (checkedSet.has(id)) {
      onCheckedChange(checkedIds.filter((itemId) => itemId !== id));
      return;
    }
    onCheckedChange([...checkedIds, id]);
  };

  return (
    <Surface
      variant="muted"
      padding="none"
      radius="xl"
      className="flex min-h-[280px] min-w-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground">
          {title}{' '}
          <span className="font-medium text-subtle">({count})</span>
        </p>
        <label className="inline-flex items-center gap-1.5 text-xs text-subtle">
          <input
            type="checkbox"
            checked={allVisibleChecked}
            disabled={disabled || items.length === 0}
            onChange={handleToggleAll}
            className="h-3.5 w-3.5 rounded border-border"
            aria-label={`Seleccionar todos en ${title}`}
          />
          Todos
        </label>
      </div>

      <div className="border-b border-border px-3 py-2">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            disabled={disabled}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={`Buscar en ${title}`}
            className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm text-foreground outline-none transition-colors focus:border-border focus:ring-2 focus:ring-brand/10 disabled:opacity-50"
          />
        </div>
      </div>

      <ul
        aria-label={title}
        className="max-h-[320px] flex-1 space-y-0.5 overflow-y-auto p-2"
      >
        {items.length === 0 ? (
          <li className="px-2 py-6 text-center text-sm text-subtle">Sin elementos</li>
        ) : (
          items.map((item) => {
            const isChecked = checkedSet.has(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={isChecked}
                  onClick={() => handleToggleOne(item.id)}
                  className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 disabled:cursor-not-allowed ${
                    isChecked
                      ? 'bg-brand/10 text-foreground dark:bg-primary/15'
                      : 'hover:bg-surface'
                  }`}
                >
                  <input
                    type="checkbox"
                    tabIndex={-1}
                    readOnly
                    checked={isChecked}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-border"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{item.label}</span>
                    {item.group || item.description ? (
                      <span className="mt-0.5 block text-xs text-subtle">
                        {[item.group, item.description].filter(Boolean).join(' · ')}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </Surface>
  );
}
