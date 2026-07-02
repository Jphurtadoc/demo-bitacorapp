import TableLabel from '../atoms/TableLabel';
import { SearchableSelect } from '@/components/UI/searchable-select';
import type { TableFilterField } from '../types';

interface TableFilterFieldProps extends TableFilterField {}

export default function TableFilterFieldComponent({
  id,
  label,
  type = 'text',
  placeholder,
  value = '',
  options = [],
  onChange,
}: TableFilterFieldProps) {
  const inputClassName =
    'w-full rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gray-300 focus:bg-surface focus:ring-2 focus:ring-brand/10';

  return (
    <div className="min-w-[160px] flex-1">
      <TableLabel htmlFor={id}>{label}</TableLabel>
      {type === 'select' ? (
        <SearchableSelect
          id={id}
          value={value}
          options={options}
          placeholder="Todos"
          searchPlaceholder={`Buscar ${label.toLowerCase()}...`}
          onChange={onChange}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
          className={inputClassName}
        />
      )}
    </div>
  );
}
