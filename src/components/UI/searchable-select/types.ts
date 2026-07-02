export interface SearchableSelectOption {
  label: string;
  value: string;
}

export interface SearchableSelectProps {
  id?: string;
  value?: string;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyOptionLabel?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}
