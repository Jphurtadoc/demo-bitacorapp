import { MapPin, Play } from 'lucide-react';
import { Surface } from '@/components/UI/surface';
import { getWorkPostTypeMeta } from './workPostTypeMeta';
import type { WorkPost } from '@/types/workPost';

interface WorkPostCardProps {
  post: WorkPost;
  isActive: boolean;
  onStartShift: (post: WorkPost) => void;
}

/**
 * Single assigned work-post row with type icon and start-shift action.
 */
export function WorkPostCard({ post, isActive, onStartShift }: WorkPostCardProps) {
  const { Icon, label, toneClass } = getWorkPostTypeMeta(post.tipo);

  return (
    <Surface
      variant={isActive ? 'elevated' : 'default'}
      padding="md"
      radius="xl"
      className={`flex items-center gap-4 ${isActive ? 'border-primary/40 ring-primary/20' : ''}`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
        title={label}
        aria-label={label}
      >
        <Icon size={20} aria-hidden />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="truncate text-base font-bold text-foreground">{post.nombre}</h3>
        <p className="flex items-start gap-1.5 text-sm text-subtle">
          <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden />
          <span className="line-clamp-2">{post.direccion}</span>
        </p>
      </div>

      <button
        type="button"
        className={`inline-flex shrink-0 min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-muted text-foreground'
            : 'bg-primary text-white hover:bg-primary-hover'
        }`}
        aria-label={`Iniciar turno en ${post.nombre}`}
        disabled={isActive}
        onClick={() => onStartShift(post)}
      >
        <Play size={16} className={isActive ? undefined : 'text-white'} aria-hidden />
        <span className="hidden sm:inline">{isActive ? 'Turno en curso' : 'Iniciar turno'}</span>
        <span className="sm:hidden">{isActive ? 'Activo' : 'Iniciar'}</span>
      </button>
    </Surface>
  );
}
