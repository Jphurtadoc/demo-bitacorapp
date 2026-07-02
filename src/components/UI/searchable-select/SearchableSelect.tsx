import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { pushOverlayEscape } from '@/hooks/useOverlayEscape';
import type { SearchableSelectProps } from './types';

export default function SearchableSelect({
  id,
  value = '',
  options,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  emptyOptionLabel = 'Todos',
  onChange,
  className = '',
  disabled = false,
}: SearchableSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const allOptions = useMemo(
    () => [{ label: emptyOptionLabel, value: '' }, ...options],
    [emptyOptionLabel, options],
  );

  const selectedOption = useMemo(
    () => allOptions.find((option) => option.value === value),
    [allOptions, value],
  );

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allOptions;

    return allOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [allOptions, search]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    const removeEscape = pushOverlayEscape(() => {
      setOpen(false);
      setSearch('');
    });

    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      removeEscape();
      window.clearTimeout(timer);
    };
  }, [open]);

  const handleSelect = (nextValue: string) => {
    onChange?.(nextValue);
    setOpen(false);
    setSearch('');
  };

  const triggerClassName =
    'flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-muted px-3 py-2.5 text-left text-sm text-foreground outline-none transition-colors focus:border-gray-300 focus:bg-surface focus:ring-2 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
          if (open) setSearch('');
        }}
        className={triggerClassName}
      >
        <span className={selectedOption?.value ? 'text-foreground' : 'text-subtle'}>
          {selectedOption?.value ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-subtle transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                placeholder={searchPlaceholder}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-gray-300 focus:bg-surface focus:ring-2 focus:ring-brand/10"
              />
            </div>
          </div>

          <ul
            role="listbox"
            className="max-h-56 overflow-y-auto py-1"
            aria-labelledby={id}
          >
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;

                return (
                  <li key={option.value || '__empty__'} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-brand/5 font-medium text-brand'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected ? <Check size={14} className="shrink-0" /> : null}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-3 text-center text-sm text-subtle">Sin resultados</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
