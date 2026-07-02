import { Inbox } from 'lucide-react';

interface TableEmptyStateProps {
  message?: string;
}

export default function TableEmptyState({
  message = 'No se encontraron registros.',
}: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-subtle">
        <Inbox size={22} />
      </div>
      <p className="text-sm font-semibold text-subtle">{message}</p>
    </div>
  );
}
