import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { TableSortDirection } from '../types';

interface TableSortIconProps {
  direction?: TableSortDirection;
  active?: boolean;
}

export default function TableSortIcon({ direction = null, active = false }: TableSortIconProps) {
  if (!active || !direction) {
    return <ArrowUpDown size={14} className="text-gray-300" />;
  }

  return direction === 'asc' ? (
    <ArrowUp size={14} className="text-brand" />
  ) : (
    <ArrowDown size={14} className="text-brand" />
  );
}
