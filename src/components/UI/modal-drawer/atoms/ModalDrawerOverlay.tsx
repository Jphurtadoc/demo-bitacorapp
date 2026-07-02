interface ModalDrawerOverlayProps {
  open: boolean;
  onClose: () => void;
  closeOnClick?: boolean;
}

export default function ModalDrawerOverlay({
  open,
  onClose,
  closeOnClick = true,
}: ModalDrawerOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-[75] bg-[var(--color-overlay)] backdrop-blur-[2px] transition-opacity duration-300 ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      onClick={closeOnClick ? onClose : undefined}
      aria-hidden="true"
    />
  );
}
