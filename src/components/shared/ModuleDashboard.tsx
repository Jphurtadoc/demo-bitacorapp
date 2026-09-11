import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from '@/components/shared/PageHeader';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon, getAccentEmphasisStyle } from '@/components/UI/emphasis';
import { TrendingUp, Lock, ArrowRight, LayoutDashboard, Database } from "lucide-react";

interface ModuleDashboardProps {
  moduleName: string;
  description: string;
  stats?: {
    label: string;
    value: string;
    color: string;
    icon: React.ReactNode;
  }[];
  isDemoBlocked?: boolean;
  accentColor?: string;
}

const ModuleDashboard: React.FC<ModuleDashboardProps> = ({
  moduleName,
  description,
  stats = [],
  isDemoBlocked = false,
  accentColor = '#ff8f47',
}) => {
  const accentStyle = getAccentEmphasisStyle(accentColor);
  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <PageHeader
          className="animate-fade-in mb-10 pb-2.5"
          title={isDemoBlocked ? 'Acceso Restringido' : `Dashboard de ${moduleName}`}
          subtitle={
            isDemoBlocked
              ? 'Funcionalidad reservada para el entorno completo.'
              : description
          }
        />

        {isDemoBlocked ? (
          <Surface
            padding="xl"
            radius="3xl"
            className="relative mt-8 animate-fade-in overflow-hidden px-8 py-16 text-center"
            style={accentStyle}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to bottom right, color-mix(in srgb, ${accentColor} 12%, transparent), transparent 55%, color-mix(in srgb, ${accentColor} 8%, transparent))`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, color-mix(in srgb, ${accentColor} 50%, transparent), transparent)`,
              }}
            />

            <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center">
              <EmphasisIcon accentColor={accentColor} size="lg" className="mb-6 h-20! w-20! rounded-[20px]!">
                <Lock size={40} />
              </EmphasisIcon>

              <h2 className="module-accent-text mb-4 text-2xl font-bold" style={accentStyle}>
                Funcionalidad no disponible en el Demo
              </h2>

              <p className="page-header-subtitle mb-8 max-w-[500px] text-base leading-relaxed">
                Estás interactuando con la versión de demostración. El submódulo de{' '}
                <strong className="module-accent-text font-semibold" style={accentStyle}>
                  {moduleName}
                </strong>{' '}
                aún no está habilitado para pruebas públicas. Solicita una prueba guiada para explorar
                todas las características.
              </p>

              <button
                type="button"
                className="rounded-xl px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: accentColor }}
                onClick={() => window.history.back()}
              >
                Regresar
              </button>
            </div>
          </Surface>
        ) : (
          <>
            {/* Stats Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 animate-fade-in"
              style={{ animationDelay: "200ms", gap: "24px", marginBottom: "32px" }}
            >
              {stats.map((stat, i) => (
                <Surface
                  key={i}
                  padding="lg"
                  radius="xl"
                  className="animate-slide-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <EmphasisIcon accentColor={stat.color} size="md" className="mb-4">
                    {stat.icon}
                  </EmphasisIcon>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-subtle">
                    {stat.label}
                  </p>
                  <p className="m-0 text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </Surface>
              ))}
            </div>

            {/* Varios Elementos (Custom Dynamic Panel) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 animate-slide-in" style={{ gap: "24px", animationDelay: "300ms" }}>
              
              {/* Resumen Card */}
              <Surface padding="xl" radius="xl" className="col-span-1 flex flex-col lg:col-span-2">
                <div className="mb-6 flex items-center gap-3">
                  <EmphasisIcon tone="brand" size="sm">
                    <LayoutDashboard size={20} />
                  </EmphasisIcon>
                  <h2 className="page-section-title m-0 text-lg">
                    Seguimiento General
                  </h2>
                </div>
                <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted">
                  <Database size={32} className="text-subtle" />
                  <p className="text-sm font-medium text-subtle">Gráfica de seguimiento para {moduleName} en construcción...</p>
                </div>
              </Surface>

              {/* Acciones Rápidas */}
              <Surface padding="xl" radius="xl" className="col-span-1 flex flex-col">
                <div className="mb-6 flex items-center gap-3">
                  <EmphasisIcon tone="primary" size="sm">
                    <TrendingUp size={20} />
                  </EmphasisIcon>
                  <h2 className="page-section-title m-0 text-lg">
                    Accesos Rápidos
                  </h2>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  {[1, 2, 3].map(n => (
                    <button
                      key={n}
                      type="button"
                      className="group flex items-center justify-between rounded-lg border border-transparent bg-muted p-4 text-left transition-all hover:border-border hover:bg-surface"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-primary" />
                        <span className="text-sm font-semibold text-subtle transition-colors group-hover:text-foreground">
                          Acción Recomendada {n}
                        </span>
                      </div>
                      <ArrowRight size={16} className="text-subtle transition-colors group-hover:text-primary" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand py-3.5 text-[14.5px] font-semibold text-[#ffffff] transition-all hover:bg-brand-hover hover:shadow-lg active:scale-95 dark:bg-primary dark:hover:bg-primary-hover"
                >
                  Continuar
                </button>
              </Surface>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ModuleDashboard;
