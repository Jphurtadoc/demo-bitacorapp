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
  accentColor = '#ff761c',
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
                <div
                  key={i}
                  className="bg-white animate-slide-in shadow-sm border border-gray-100/60"
                  style={{
                    borderRadius: "20px",
                    animationDelay: `${i * 100}ms`,
                    padding: "24px",
                  }}
                >
                  <div
                    className="flex items-center justify-center "
                    style={{
                      marginBottom: "1rem",
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px"
                    }}
                  >
                    {stat.icon}
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#272b60",
                      margin: 0,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Varios Elementos (Custom Dynamic Panel) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 animate-slide-in" style={{ gap: "24px", animationDelay: "300ms" }}>
              
              {/* Resumen Card */}
              <div
                className="col-span-1 lg:col-span-2 bg-white border border-gray-100 shadow-sm flex flex-col"
                style={{ borderRadius: "24px", padding: "32px" }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '10px', color: '#272b60' }}>
                    <LayoutDashboard size={20} />
                  </div>
                  <h2 className="page-section-title m-0 text-lg">
                    Seguimiento General
                  </h2>
                </div>
                <div style={{ flex: 1, minHeight: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0', gap: '12px' }}>
                  <Database size={32} style={{ color: '#cbd5e1' }} />
                  <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Gráfica de seguimiento para {moduleName} en construcción...</p>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div
                className="col-span-1 bg-white border border-gray-100 shadow-sm"
                style={{ borderRadius: "24px", padding: "32px", display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ padding: '8px', backgroundColor: '#fff7ed', borderRadius: '10px', color: '#ea580c' }}>
                    <TrendingUp size={20} />
                  </div>
                  <h2 className="page-section-title m-0 text-lg">
                    Accesos Rápidos
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {[1, 2, 3].map(n => (
                    <button key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid transparent', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:border-orange-200 hover:bg-white group cursor-pointer text-left">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} className="group-hover:bg-orange-500 transition-colors"></div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }} className="group-hover:text-[#272b60]">Acción Recomendada {n}</span>
                      </div>
                      <ArrowRight size={16} style={{ color: '#cbd5e1' }} className="group-hover:text-orange-500 transition-colors" />
                    </button>
                  ))}
                </div>
                <button
                  className="w-full bg-[#272b60] text-white font-semibold flex items-center justify-center hover:shadow-lg transition-all active:scale-95"
                  style={{ padding: "14px", borderRadius: "12px", marginTop: "24px", fontSize: "14.5px" }}
                >
                  Continuar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ModuleDashboard;
