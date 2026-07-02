interface ModalDrawerHandleProps {
  onClose?: () => void;
}

export default function ModalDrawerHandle({ onClose }: ModalDrawerHandleProps) {
  return (
    <div className="flex shrink-0 justify-center border-b border-border px-4 pb-3 pt-3 md:hidden">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar panel"
        className="h-1.5 w-12 rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
      />
    </div>
  );
}
