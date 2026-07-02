import { Surface } from '@/components/UI/surface';
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

export default function TableFilters({
  filters = [],
  searchValue,
  searchPlaceholder,
  onSearchChange,
  metaLabel,
}: TableFiltersProps) {
  if (!filters.length && !onSearchChange && !metaLabel) return null;

  return (
    <Surface padding="md" className="flex flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        {onSearchChange ? (
          <TableSearchInput
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
            className="lg:max-w-xs"
          />
        ) : null}
        {filters.map((filter) => (
          <TableFilterFieldComponent key={filter.id} {...filter} />
        ))}
      </div>
      {metaLabel ? (
        <p className="shrink-0 text-sm font-semibold text-subtle">{metaLabel}</p>
      ) : null}
    </Surface>
  );
}
