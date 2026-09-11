import { Building2, Factory, Home } from 'lucide-react';
import type { WorkPostTipo } from '@/types/workPost';

const TYPE_META: Record<
  WorkPostTipo,
  { label: string; Icon: typeof Factory; toneClass: string }
> = {
  industrial: {
    label: 'Industrial',
    Icon: Factory,
    toneClass: 'bg-muted text-foreground',
  },
  comercial: {
    label: 'Comercial',
    Icon: Building2,
    toneClass: 'bg-muted text-foreground',
  },
  residencial: {
    label: 'Residencial',
    Icon: Home,
    toneClass: 'bg-muted text-foreground',
  },
};

/**
 * Returns display metadata for a work-post site type.
 */
export function getWorkPostTypeMeta(tipo: WorkPostTipo) {
  return TYPE_META[tipo];
}
