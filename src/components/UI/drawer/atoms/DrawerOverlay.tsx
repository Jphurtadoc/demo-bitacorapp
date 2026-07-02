interface DrawerOverlayProps {
  open: boolean;
  onClose: () => void;
  closeOnClick?: boolean;
}

export default function DrawerOverlay({
  open,
  onClose,
  closeOnClick = true,
}: DrawerOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-[60] bg-[var(--color-overlay)] backdrop-blur-[2px] transition-opacity duration-300 ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      onClick={closeOnClick ? onClose : undefined}
      aria-hidden="true"
    />
  );
}
