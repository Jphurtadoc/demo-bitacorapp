/**
 * Selectable item shown in a transfer list pane.
 */
export interface TransferListItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
}

/**
 * Props for the dual-pane permission transfer control.
 */
export interface TransferListProps {
  readonly items: readonly TransferListItem[];
  readonly selectedIds: readonly string[];
  readonly onChange: (selectedIds: string[]) => void;
  readonly leftTitle?: string;
  readonly rightTitle?: string;
  readonly searchPlaceholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}
