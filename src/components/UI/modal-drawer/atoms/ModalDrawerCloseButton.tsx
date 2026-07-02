import { X } from 'lucide-react';

interface ModalDrawerCloseButtonProps {
  onClose: () => void;
  className?: string;
}

export default function ModalDrawerCloseButton({
  onClose,
  className = '',
}: ModalDrawerCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Cerrar"
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-muted hover:text-subtle ${className}`}
    >
      <X size={18} />
    </button>
  );
}
