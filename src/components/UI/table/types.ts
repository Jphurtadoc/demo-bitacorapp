import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export type TableAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc' | null;export type TableBadgeTone =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type TableActionVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface TableActionItem {
  id?: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
  to?: string;
  onClick?: () => void;
  variant?: TableActionVariant;
  disabled?: boolean;
  showLabel?: boolean;
}

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: TableAlign;
  render?: (row: T, index: number) => ReactNode;
}

export interface TableTabItem {
  id: string;
  label: string;
  count?: number;
  badgeTone?: TableBadgeTone;
}

export interface TableFilterOption {
  label: string;
  value: string;
}

export interface TableFilterField {
  id: string;
  label: string;
  type?: 'text' | 'select';
  placeholder?: string;
  value?: string;
  options?: TableFilterOption[];
  onChange?: (value: string) => void;
}

export interface TablePaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T extends { id: string }> {
  title?: string;
  subtitle?: string;
  columns: TableColumn<T>[];
  data: T[];
  tabs?: TableTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  filters?: TableFilterField[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  actions?: ReactNode;
  actionItems?: TableActionItem[];
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  sortKey?: string | null;
  sortDirection?: TableSortDirection;
  onSortChange?: (key: string, direction: TableSortDirection) => void;
  emptyMessage?: string;
  metaLabel?: string;
  pagination?: TablePaginationConfig;
  headerSlot?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}
