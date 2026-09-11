import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Surface } from '@/components/UI/surface';
import { SearchableSelect } from '@/components/UI/searchable-select';
import { getWorkPostById } from '@/data/vigilanteWorkPosts';
import {
  clearActiveShift,
  getActiveShift,
  setActiveShift,
} from '@/modules/user/dashboard/infrastructure/activeShiftStorage';
import {
  getVigilanteClienteOverviewPath,
  VIGILANTE_TURNO_PATH,
} from '@/modules/user/dashboard/infrastructure/vigilanteRoutes';
import {
  canAbandonActiveShift,
  isShiftSetupComplete,
  type ActiveShift,
  type ShiftConsignasForm,
  type ShiftInicioForm,
} from '@/types/workPost';

const STEPS = [
  { id: 0, title: 'Inicio de turno' },
  { id: 1, title: 'Consignas del turno' },
] as const;

const ESTADO_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Con novedad', value: 'novedad' },
];

const fieldClassName =
  'w-full rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-border focus:bg-surface focus:ring-2 focus:ring-primary/20';

/**
 * Two-step shift setup: inicio de turno + consignas.
 */
const VigilanteShiftInicioPage: React.FC = () => {
  const { workPostId = '' } = useParams<{ workPostId: string }>();
  const navigate = useNavigate();
  const storedShift = getActiveShift();
  const workPost = useMemo(
    () => (workPostId ? getWorkPostById(workPostId) : null),
    [workPostId],
  );

  const [shift, setShift] = useState<ActiveShift | null>(() => {
    const current = getActiveShift();
    if (!current || current.workPostId !== workPostId) {
      return null;
    }
    return current;
  });
  const [step, setStep] = useState(() => {
    const current = getActiveShift();
    if (!current || current.workPostId !== workPostId) {
      return 0;
    }
    if (current.inicioCompleted && !current.consignasCompleted) {
      return 1;
    }
    return 0;
  });
  const [feedback, setFeedback] = useState('');

  if (!storedShift || storedShift.workPostId !== workPostId || !workPost || !shift) {
    return <Navigate to={VIGILANTE_TURNO_PATH} replace />;
  }

  if (isShiftSetupComplete(shift)) {
    return <Navigate to={getVigilanteClienteOverviewPath(workPostId)} replace />;
  }

  const canAbandon = canAbandonActiveShift(shift);

  const persistShift = (next: ActiveShift) => {
    setActiveShift(next);
    setShift(next);
  };

  const handleInicioChange = <K extends keyof ShiftInicioForm>(
    key: K,
    value: ShiftInicioForm[K],
  ) => {
    persistShift({
      ...shift,
      inicio: { ...shift.inicio, [key]: value },
    });
  };

  const handleConsignasChange = <K extends keyof ShiftConsignasForm>(
    key: K,
    value: ShiftConsignasForm[K],
  ) => {
    persistShift({
      ...shift,
      consignas: { ...shift.consignas, [key]: value },
    });
  };

  const handleCancel = () => {
    if (!canAbandon) {
      setFeedback('Ya completaste el inicio de turno; no puedes abandonar este turno.');
      return;
    }
    clearActiveShift();
    navigate(VIGILANTE_TURNO_PATH);
  };

  const handleSave = () => {
    persistShift(shift);
    setFeedback('Borrador guardado. Puedes continuar más tarde.');
  };

  const isInicioValid = () => {
    return Boolean(
      shift.inicio.horaLlegada.trim() &&
        shift.inicio.estadoPuesto &&
        shift.inicio.equipoRecibido.trim(),
    );
  };

  const isConsignasValid = () => {
    return shift.consignas.consignasLeidas && shift.consignas.confirmacion;
  };

  const handleComplete = () => {
    if (step === 0) {
      if (!isInicioValid()) {
        setFeedback('Completa hora de llegada, estado del puesto y equipo recibido.');
        return;
      }
      const next: ActiveShift = {
        ...shift,
        inicioCompleted: true,
      };
      persistShift(next);
      setFeedback('Inicio de turno completado. Ya no puedes abandonar este turno.');
      setStep(1);
      return;
    }

    if (!isConsignasValid()) {
      setFeedback('Marca consignas leídas y la confirmación para completar.');
      return;
    }
    const next: ActiveShift = {
      ...shift,
      consignasCompleted: true,
    };
    persistShift(next);
    navigate(getVigilanteClienteOverviewPath(workPostId));
  };

  return (
    <DashboardLayout>
      <div className="page-shell flex min-h-[calc(100vh-92px)] items-center justify-center">
        <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
        <header className="space-y-1 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-subtle">
            Inicio de turno
          </p>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{workPost.nombre}</h1>
          <p className="text-sm text-subtle">{workPost.direccion}</p>
        </header>

        <nav aria-label="Pasos del turno" className="flex items-center gap-2">
          {STEPS.map((item, index) => {
            const isActive = step === item.id;
            const isDone =
              (item.id === 0 && shift.inicioCompleted) ||
              (item.id === 1 && shift.consignasCompleted);
            return (
              <React.Fragment key={item.id}>
                <button
                  type="button"
                  className={`flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'border-primary/40 bg-primary/10 text-foreground'
                      : isDone
                        ? 'border-border bg-surface text-foreground'
                        : 'border-border bg-muted text-subtle'
                  }`}
                  onClick={() => {
                    if (item.id === 1 && !shift.inicioCompleted) {
                      setFeedback('Completa primero el formulario de inicio de turno.');
                      return;
                    }
                    setStep(item.id);
                    setFeedback('');
                  }}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isDone || isActive
                        ? 'bg-primary text-white'
                        : 'bg-muted text-subtle'
                    }`}
                  >
                    {isDone ? <Check size={14} aria-hidden /> : index + 1}
                  </span>
                  <span className="text-sm font-semibold">{item.title}</span>
                </button>
                {index < STEPS.length - 1 ? (
                  <div className="hidden h-px w-4 shrink-0 bg-border sm:block" aria-hidden />
                ) : null}
              </React.Fragment>
            );
          })}
        </nav>

        <Surface as="section" variant="default" padding="lg" radius="2xl" className="space-y-4">
          {step === 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Formulario de inicio de turno</h2>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">Hora de llegada</span>
                <input
                  type="time"
                  value={shift.inicio.horaLlegada}
                  onChange={(event) => handleInicioChange('horaLlegada', event.target.value)}
                  className={fieldClassName}
                  aria-label="Hora de llegada"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">Estado del puesto</span>
                <SearchableSelect
                  value={shift.inicio.estadoPuesto}
                  options={ESTADO_OPTIONS}
                  placeholder="Seleccionar estado"
                  searchPlaceholder="Buscar estado..."
                  emptyOptionLabel="Seleccionar..."
                  onChange={(value) =>
                    handleInicioChange(
                      'estadoPuesto',
                      (value === 'normal' || value === 'novedad' ? value : '') as ShiftInicioForm['estadoPuesto'],
                    )
                  }
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">Equipo recibido</span>
                <input
                  type="text"
                  value={shift.inicio.equipoRecibido}
                  onChange={(event) => handleInicioChange('equipoRecibido', event.target.value)}
                  placeholder="Ej. radios, llaves, bitácora"
                  className={fieldClassName}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">Observaciones iniciales</span>
                <textarea
                  value={shift.inicio.observaciones}
                  onChange={(event) => handleInicioChange('observaciones', event.target.value)}
                  rows={4}
                  placeholder="Describe el estado inicial del puesto..."
                  className={fieldClassName}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Consignas del turno</h2>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-muted px-3 py-3">
                <input
                  type="checkbox"
                  checked={shift.consignas.consignasLeidas}
                  onChange={(event) =>
                    handleConsignasChange('consignasLeidas', event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-sm text-foreground">
                  Confirmo que leí las consignas vigentes del puesto.
                </span>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">Novedades pendientes</span>
                <textarea
                  value={shift.consignas.novedadesPendientes}
                  onChange={(event) =>
                    handleConsignasChange('novedadesPendientes', event.target.value)
                  }
                  rows={3}
                  placeholder="Novedades heredadas del turno anterior..."
                  className={fieldClassName}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">Instrucciones especiales</span>
                <textarea
                  value={shift.consignas.instrucciones}
                  onChange={(event) =>
                    handleConsignasChange('instrucciones', event.target.value)
                  }
                  rows={3}
                  placeholder="Instrucciones del supervisor o del cliente..."
                  className={fieldClassName}
                />
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-muted px-3 py-3">
                <input
                  type="checkbox"
                  checked={shift.consignas.confirmacion}
                  onChange={(event) =>
                    handleConsignasChange('confirmacion', event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-sm text-foreground">
                  Confirmo consignas y asumo el turno en este puesto.
                </span>
              </label>
            </div>
          )}

          {feedback ? (
            <p className="rounded-xl bg-muted px-3 py-2 text-sm text-subtle" role="status">
              {feedback}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!canAbandon}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-muted px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Completar
              </button>
            </div>
          </div>
        </Surface>

        {!canAbandon ? (
          <p className="text-center text-sm text-subtle">
            El inicio de turno ya quedó registrado. Completa las consignas para continuar.
            Ya no puedes cancelar ni abandonar este turno.
          </p>
        ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VigilanteShiftInicioPage;
