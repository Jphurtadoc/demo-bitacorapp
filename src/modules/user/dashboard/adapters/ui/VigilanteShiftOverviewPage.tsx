import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Surface } from '@/components/UI/surface';
import { getWorkPostById } from '@/data/vigilanteWorkPosts';
import { getActiveShift } from '@/modules/user/dashboard/infrastructure/activeShiftStorage';
import {
  getVigilanteClienteInicioPath,
  getVigilanteClienteOverviewPath,
  VIGILANTE_TURNO_PATH,
} from '@/modules/user/dashboard/infrastructure/vigilanteRoutes';
import { canAbandonActiveShift, isShiftSetupComplete } from '@/types/workPost';
import { getWorkPostTypeMeta } from './workPostTypeMeta';

const DOT_PATTERN_STYLE: React.CSSProperties = {
  backgroundImage:
    'radial-gradient(circle, color-mix(in oklab, var(--color-text-muted) 30%, transparent) 1.1px, transparent 1.1px)',
  backgroundSize: '18px 18px',
};

/**
 * Client overview home for an active shift:
 * `/vigilancia/turno/cliente/:workPostId/overview`
 */
const VigilanteShiftOverviewPage: React.FC = () => {
  const { workPostId = '' } = useParams<{ workPostId: string }>();
  const activeShift = getActiveShift();
  const workPost = useMemo(
    () => (activeShift ? getWorkPostById(activeShift.workPostId) : null),
    [activeShift],
  );

  if (!activeShift) {
    return <Navigate to={VIGILANTE_TURNO_PATH} replace />;
  }

  if (activeShift.workPostId !== workPostId) {
    return (
      <Navigate
        to={getVigilanteClienteOverviewPath(activeShift.workPostId)}
        replace
      />
    );
  }

  if (!isShiftSetupComplete(activeShift)) {
    return (
      <Navigate to={getVigilanteClienteInicioPath(activeShift.workPostId)} replace />
    );
  }

  if (!workPost) {
    return <Navigate to={VIGILANTE_TURNO_PATH} replace />;
  }

  const canAbandon = canAbandonActiveShift(activeShift);
  const { Icon, label } = getWorkPostTypeMeta(workPost.tipo);
  const startedAtLabel = new Date(activeShift.startedAt).toLocaleString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <DashboardLayout>
      <div className="page-shell relative flex min-h-[calc(100vh-92px)] items-center justify-center overflow-hidden rounded-2xl bg-muted/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-35"
          style={DOT_PATTERN_STYLE}
        />

        <div className="relative z-10 mx-auto w-full max-w-2xl space-y-6 px-2 py-6 text-center">
          <header className="mx-auto max-w-xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-subtle">
              Turno en curso
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {workPost.nombre}
            </h1>
            <p className="text-base text-subtle sm:text-lg">
              Overview del cliente asignado a tu turno de hoy.
            </p>
          </header>

          <Surface
            as="section"
            variant="default"
            padding="xl"
            radius="2xl"
            className="mx-auto max-w-xl space-y-5 text-left"
            aria-label="Detalle del puesto"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground"
                title={label}
                aria-label={label}
              >
                <Icon size={22} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                  {label}
                </p>
                <p className="truncate text-lg font-bold text-foreground">{workPost.nombre}</p>
              </div>
            </div>

            <p className="flex items-start gap-2 text-sm text-subtle">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>{workPost.direccion}</span>
            </p>

            <p className="flex items-start gap-2 text-sm text-subtle">
              <Clock size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span className="capitalize">Inicio: {startedAtLabel}</span>
            </p>
          </Surface>

          {!canAbandon ? (
            <p className="text-sm text-subtle">
              Turno en curso. No puedes abandonar este puesto desde aquí.
            </p>
          ) : (
            <p className="text-sm text-subtle">
              ¿Necesitas cambiar de puesto?{' '}
              <Link
                to={VIGILANTE_TURNO_PATH}
                className="font-semibold text-primary hover:underline"
              >
                Volver a seleccionar
              </Link>
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VigilanteShiftOverviewPage;
