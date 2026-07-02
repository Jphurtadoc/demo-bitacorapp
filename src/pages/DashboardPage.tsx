import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon, getAccentEmphasisStyle } from '@/components/UI/emphasis';
import {
  Shield, FilePieChart, ListTodo, BarChart3, Truck, Eye,
  MessageSquare, Award, LifeBuoy, Globe, UserRound,
  TrendingUp, TrendingDown, CheckCircle2, AlertTriangle,
  Users, Map, Bell, ArrowRight, Calendar, RefreshCw
} from 'lucide-react';

const stats = [
  { label: 'Rondas Programadas', value: '48', trend: '+12%', trendUp: true, icon: <Map size={20} />, color: '#2563eb', bg: '#eff6ff' },
  { label: 'Rondas Completadas', value: '36', sub: '75% del total', icon: <CheckCircle2 size={20} />, color: '#16a34a', bg: '#f0fdf4' },
  { label: 'Novedades Registradas', value: '7', trend: '-22%', trendUp: false, icon: <Bell size={20} />, color: '#dc2626', bg: '#fef2f2' },
  { label: 'Incidentes Abiertos', value: '3', trend: '-14%', trendUp: false, icon: <AlertTriangle size={20} />, color: '#ea580c', bg: '#fff7ed' },
  { label: 'Guardias Activos', value: '112', sub: 'En este momento', icon: <Users size={20} />, color: '#7c3aed', bg: '#f5f3ff' },
];

const quickActions = [
  { label: 'Administración', icon: <Shield size={18} />, path: '/admin/dashboard', color: '#6366f1', bg: '#eef2ff' },
  { label: 'Comercial', icon: <FilePieChart size={18} />, path: '/oper/dashboard', color: '#2563eb', bg: '#eff6ff' },
  { label: 'Tareas', icon: <ListTodo size={18} />, path: '/tasks/dashboard', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Logística', icon: <Truck size={18} />, path: '/logistics/dashboard', color: '#16a34a', bg: '#f0fdf4' },
  { label: 'Vigilancia', icon: <Eye size={18} />, path: '/security/dashboard', color: '#dc2626', bg: '#fef2f2' },
  { label: 'PQRS', icon: <MessageSquare size={18} />, path: '/pqrs/dashboard', color: '#ea580c', bg: '#fff7ed' },
  { label: 'Calidad', icon: <Award size={18} />, path: '/quality/dashboard', color: '#ca8a04', bg: '#fefce8' },
  { label: 'Gestión Humana', icon: <UserRound size={18} />, path: '/hr/dashboard', color: '#9333ea', bg: '#faf5ff' },
  { label: 'Reportes', icon: <BarChart3 size={18} />, path: '/reports/dashboard', color: '#0891b2', bg: '#ecfeff' },
  { label: 'Comunicaciones', icon: <Globe size={18} />, path: '/comms/dashboard', color: '#db2777', bg: '#fdf2f8' },
  { label: 'Soporte', icon: <LifeBuoy size={18} />, path: '/support/dashboard', color: '#059669', bg: '#ecfdf5' },
];

const recentActivity = [
  { icon: <CheckCircle2 size={14} />, color: '#16a34a', bg: '#f0fdf4', title: 'Ronda Complejo Industrial', sub: 'Completada por Carlos Mendoza', time: '08:45' },
  { icon: <AlertTriangle size={14} />, color: '#ea580c', bg: '#fff7ed', title: 'Novedad: Puerta forzada', sub: 'Reportada en Bodega Norte', time: '08:25' },
  { icon: <Users size={14} />, color: '#2563eb', bg: '#eff6ff', title: 'Nuevo usuario registrado', sub: 'María González', time: '07:58' },
  { icon: <Truck size={14} />, color: '#16a34a', bg: '#f0fdf4', title: 'Vehículo ABC-123 asignado', sub: 'A la ronda Turno Nocturno', time: '07:30' },
  { icon: <CheckCircle2 size={14} />, color: '#16a34a', bg: '#f0fdf4', title: 'Ronda Condominio Campestre', sub: 'Completada por Luis Ramírez', time: '07:15' },
];

const nextRounds = [
  { time: '09:00', name: 'Ronda Centro Comercial', guard: 'Pedro Torres' },
  { time: '10:00', name: 'Ronda Parque Industrial', guard: 'Ana María López' },
  { time: '11:00', name: 'Ronda Edificio Corporativo', guard: 'Andrés Felipe Ruiz' },
  { time: '12:00', name: 'Ronda Almacén Principal', guard: 'Carlos Ramírez' },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-6">

        {/* Greeting Banner */}
        <div className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-linear-to-br from-[#4a4f8a] via-brand to-[#0f1240] px-8 py-6 shadow-lg dark:from-[#ff8f47] dark:via-primary dark:to-[#7c2d12]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, transparent 28%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,0.75) 72%, black 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, transparent 28%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,0.75) 72%, black 100%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '28px 28px',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_45%,rgba(255,255,255,0.16)_0%,transparent_50%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[62%] bg-linear-to-r from-black/35 via-black/15 to-transparent dark:from-black/40 dark:via-black/20" />
          <div className="welcome-banner-copy relative z-10 max-w-2xl">
            <p className="mb-1 text-sm font-semibold [text-shadow:0_1px_3px_rgb(0_0_0/0.45)]">
              Bienvenido de nuevo 👋
            </p>
            <h1 className="mb-1! text-2xl font-bold [text-shadow:0_2px_10px_rgb(0_0_0/0.4)]">
              ¡Hola, Juan Pablo!
            </h1>
            <p className="text-sm font-medium [text-shadow:0_1px_3px_rgb(0_0_0/0.4)]">
              Aquí tienes un resumen de la operación de hoy.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 [&_button]:text-[#ffffff]">
            <div className="flex items-center gap-2 rounded-xl border border-white/35 bg-black/20 px-4 py-2.5 text-sm font-semibold text-[#ffffff] shadow-sm backdrop-blur-sm dark:bg-black/25">
              <Calendar size={16} className="text-[#ffffff]" />
              {today}
            </div>
            <button
              type="button"
              className="rounded-xl border border-white/35 bg-black/20 p-2.5 text-[#ffffff] shadow-sm transition-colors hover:bg-black/30 backdrop-blur-sm dark:bg-black/25 dark:hover:bg-black/35"
              title="Actualizar"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Surface key={stat.label} padding="md" radius="xl" interactive className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <EmphasisIcon accentColor={stat.color} size="md">
                  {stat.icon}
                </EmphasisIcon>
                {stat.trend && (
                  <span className={`flex items-center gap-0.5 text-[11px] font-bold ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-subtle font-medium leading-tight mt-0.5">{stat.sub || stat.label}</p>
                {stat.sub && <p className="text-[11px] text-subtle leading-tight">{stat.label}</p>}
              </div>
            </Surface>
          ))}
        </div>

        {/* Quick Actions + Activity + Next Rounds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Quick Actions */}
          <Surface padding="lg" radius="xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dashboard-section-title">Acceso Rápido a Módulos</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => navigate(action.path)}
                  style={getAccentEmphasisStyle(action.color)}
                  className="emphasis-accent flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all duration-200 hover:scale-105"
                >
                  <EmphasisIcon accentColor={action.color} size="sm" className="!border-0 !bg-transparent !shadow-none">
                    {action.icon}
                  </EmphasisIcon>
                  <span className="text-center text-[10.5px] font-semibold leading-tight">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </Surface>

          {/* Recent Activity */}
          <Surface padding="lg" radius="xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dashboard-section-title">Actividad Reciente</h2>
              <button className="dashboard-section-link flex items-center gap-1 text-[11px] font-semibold">
                Ver toda <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <EmphasisIcon accentColor={item.color} size="sm" className="!rounded-full mt-0.5">
                    {item.icon}
                  </EmphasisIcon>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-foreground leading-tight truncate">{item.title}</p>
                    <p className="text-[11px] text-subtle mt-0.5 truncate">{item.sub}</p>
                  </div>
                  <span className="text-[11px] text-subtle font-medium flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </Surface>

          {/* Next Rounds */}
          <Surface padding="lg" radius="xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dashboard-section-title">Próximas Rondas</h2>
              <button className="dashboard-section-link flex items-center gap-1 text-[11px] font-semibold">
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {nextRounds.map((round, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="emphasis-accent shrink-0 rounded-lg border px-2 py-1.5 text-center text-[11px] font-bold min-w-[46px]"
                    style={getAccentEmphasisStyle('#2563eb')}
                  >
                    {round.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-foreground leading-tight truncate">{round.name}</p>
                    <p className="text-[11px] text-subtle truncate">Guardia: {round.guard}</p>
                  </div>
                  <span className="emphasis-accent shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold" style={getAccentEmphasisStyle('#16a34a')}>
                    Programada
                  </span>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        {/* Progress Bar Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Surface padding="lg" radius="xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dashboard-section-title">Rondas por Estado</h2>
              <span className="text-[11px] font-semibold text-subtle">48 Total</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Completadas', value: 36, total: 48, color: '#16a34a' },
                { label: 'En progreso', value: 8, total: 48, color: '#2563eb' },
                { label: 'Pendientes', value: 3, total: 48, color: '#ea580c' },
                { label: 'Canceladas', value: 1, total: 48, color: '#6b7280' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] font-medium text-subtle">{item.label}</span>
                    <span className="text-[12px] font-bold text-foreground">{item.value} ({Math.round(item.value / item.total * 100)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.value / item.total * 100}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface padding="lg" radius="xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="dashboard-section-title">Novedades por Tipo</h2>
              <button className="dashboard-section-link flex items-center gap-1 text-[11px] font-semibold">
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Incidente', value: 18, color: '#dc2626', bg: '#fef2f2' },
                { label: 'Observación', value: 9, color: '#ea580c', bg: '#fff7ed' },
                { label: 'Falla', value: 6, color: '#ca8a04', bg: '#fefce8' },
                { label: 'Solicitud', value: 4, color: '#2563eb', bg: '#eff6ff' },
                { label: 'Otro', value: 2, color: '#6b7280', bg: '#f9fafb' },
                { label: 'Urgente', value: 1, color: '#7c3aed', bg: '#f5f3ff' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="emphasis-accent flex items-center gap-3 rounded-xl border p-3"
                  style={getAccentEmphasisStyle(item.color)}
                >
                  <div className="text-xl font-bold">{item.value}</div>
                  <div>
                    <p className="text-[11.5px] font-semibold">{item.label}</p>
                    <div className="h-1 w-16 rounded-full mt-1" style={{ backgroundColor: `${item.color}30` }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(item.value / 18 * 100, 100)}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
