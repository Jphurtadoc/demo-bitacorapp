import { Search } from 'lucide-react';

interface TableSearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function TableSearchInput({
  value = '',
  placeholder = 'Buscar...',
  onChange,
  className = '',
}: TableSearchInputProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
      />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-gray-300 focus:bg-surface focus:ring-2 focus:ring-brand/10"
      />
    </div>
  );
}
