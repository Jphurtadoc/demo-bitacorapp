import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ThemeModeSelector } from '@/components/UI/theme';
import { Surface } from '@/components/UI/surface';
import SecuritySettings from '@/pages/settings/SecuritySettings';
import {
  Settings,
  Globe,
  Shield,
  Database,
  Bell,
  CreditCard,
  Palette,
} from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings size={18} /> },
    { id: 'appearance', label: 'Apariencia', icon: <Palette size={18} /> },
    { id: 'security', label: 'Seguridad', icon: <Shield size={18} /> },
    { id: 'database', label: 'Base de Datos', icon: <Database size={18} /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell size={18} /> },
    { id: 'billing', label: 'Facturación', icon: <CreditCard size={18} /> },
    { id: 'localization', label: 'Regionalización', icon: <Globe size={18} /> },
  ];

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px] pb-10">
        <h1 className="page-header-title page-header-title-md mb-2">
          Configuración del Sistema
        </h1>
        <p className="page-header-subtitle mb-8">
          Ajusta las opciones y parámetros globales de la aplicación
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1">
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-left text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand text-[#ffffff] shadow-sm dark:bg-primary'
                      : 'text-subtle hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <Surface padding="xl" radius="xl" className="min-h-[500px]">
              {activeTab === 'general' && (
                <div className="animate-fade-in">
                  <h3 className="page-section-title mb-6 text-xl">Parámetros Generales</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-subtle">
                        Nombre de la Empresa
                      </label>
                      <input
                        type="text"
                        defaultValue="Demo Corp S.A."
                        className="rounded-lg border border-border bg-surface font-medium text-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-subtle">
                        NIT / Documento
                      </label>
                      <input
                        type="text"
                        defaultValue="900.123.456-7"
                        className="rounded-lg border border-border bg-surface font-medium text-foreground"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-subtle">
                        Logo Corporativo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted">
                          <span className="text-[10px] font-semibold text-subtle">IMG</span>
                        </div>
                        <button
                          type="button"
                          className="rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-border"
                        >
                          Cambiar Logo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <button
                      type="button"
                      className="rounded-lg bg-brand px-7 py-3.5 text-sm font-bold text-[#ffffff] shadow-sm transition-opacity hover:opacity-90 dark:bg-primary dark:hover:bg-primary-hover"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="animate-fade-in">
                  <h3 className="page-section-title mb-2 text-xl">Apariencia</h3>
                  <p className="mb-6 text-sm text-subtle">
                    Personaliza el tema visual. En modo claro el énfasis es azul corporativo (#5B67C7);
                    en modo oscuro predominan superficies sutiles con acento naranja (#FF8F47).
                  </p>
                  <ThemeModeSelector />
                </div>
              )}

              {activeTab === 'security' && <SecuritySettings />}

              {activeTab !== 'general' &&
                activeTab !== 'appearance' &&
                activeTab !== 'security' && (
                <div className="animate-fade-in flex min-h-[300px] flex-col items-center justify-center">
                  <Settings size={48} className="mb-4 text-border" />
                  <h3 className="page-section-title mb-2 text-xl">Sección Bloqueada</h3>
                  <p className="max-w-sm text-center text-subtle">
                    Las preferencias de <strong className="text-foreground">{activeTabLabel}</strong>{' '}
                    están bloqueadas en el entorno de demostración.
                  </p>
                </div>
              )}
            </Surface>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
