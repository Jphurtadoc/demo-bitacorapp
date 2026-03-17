import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const activities = [
  { user: 'Juan Pérez', initial: 'J', action: 'Nuevo Registro creado', module: 'Operación', date: 'Hace 5 min', status: 'success' },
  { user: 'Maria García', initial: 'M', action: 'Turno cerrado', module: 'Logística', date: 'Hace 12 min', status: 'neutral' },
  { user: 'Carlos Ruiz', initial: 'C', action: 'Reporte generado', module: 'Administración', date: 'Hace 25 min', status: 'info' },
  { user: 'Ana López', initial: 'A', action: 'Alerta registrada', module: 'Vigilancia', date: 'Hace 38 min', status: 'warning' },
];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  success: { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  neutral: { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' },
  info:    { bg: '#eff6ff', text: '#2563eb', dot: '#60a5fa' },
  warning: { bg: '#fff7ed', text: '#ea580c', dot: '#f97316' },
};

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 
            style={{ 
              fontSize: '30px',
              fontWeight: '700',
              color: '#272b60',
              letterSpacing: '-0.02em',
              marginBottom: '6px',
              lineHeight: '1.2',
              margin: '0 0 6px 0'
            }}
          >
            Panel de Administración
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '400', margin: 0 }}>
            Bienvenido al centro de control de Bitacorapp.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: '32px' }}>
          {[
            { title: 'Bitácoras Hoy', value: '24', sub: '+3 desde ayer', color: '#ff761c', bg: 'rgba(255, 118, 28, 0.07)' },
            { title: 'Usuarios Activos', value: '156', sub: '12 en línea ahora', color: '#272b60', bg: 'rgba(39, 43, 96, 0.07)' },
            { title: 'Alertas Sistema', value: '03', sub: '1 crítica', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.07)' },
          ].map((stat, i) => (
            <div 
              key={i}
              className="bg-white animate-slide-in"
              style={{ 
                borderRadius: '20px', 
                padding: '28px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                animationDelay: `${i * 80}ms` 
              }}
            >
              <div 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '14px', 
                  backgroundColor: stat.bg, 
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                {i === 0 && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>}
                {i === 1 && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                {i === 2 && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              </div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 0' }}>
                {stat.title}
              </p>
              <p style={{ fontSize: '34px', fontWeight: '700', color: stat.color, margin: '0 0 6px 0', lineHeight: '1' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Activity Table — Modern Design */}
        <div 
          className="bg-white animate-fade-in"
          style={{ 
            borderRadius: '20px', 
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}
        >
          {/* Table header bar */}
          <div 
            style={{ 
              padding: '20px 28px', 
              borderBottom: '1px solid #f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#272b60', margin: '0 0 2px 0' }}>
                Actividad Reciente
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                Últimas acciones en el sistema
              </p>
            </div>
            <button 
              style={{ 
                color: '#ff761c', 
                fontSize: '13px', 
                fontWeight: '600', 
                background: 'none', 
                border: '1px solid rgba(255,118,28,0.2)', 
                cursor: 'pointer',
                padding: '7px 16px',
                borderRadius: '10px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,118,28,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Ver todo
            </button>
          </div>

          {/* Rows */}
          <div>
            {activities.map((row, i) => {
              const sc = statusColors[row.status];
              return (
                <div 
                  key={i}
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 140px 100px',
                    alignItems: 'center',
                    padding: '16px 28px',
                    borderBottom: i < activities.length - 1 ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* User */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '10px', 
                        backgroundColor: 'rgba(255,118,28,0.1)', 
                        color: '#ff761c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        flexShrink: 0
                      }}
                    >
                      {row.initial}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#272b60' }}>
                      {row.user}
                    </span>
                  </div>

                  {/* Action */}
                  <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '400' }}>
                    {row.action}
                  </span>

                  {/* Module badge */}
                  <div>
                    <span 
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11.5px', 
                        fontWeight: '600',
                        color: sc.text,
                        backgroundColor: sc.bg,
                        padding: '4px 10px',
                        borderRadius: '8px',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block', flexShrink: 0 }}></span>
                      {row.module}
                    </span>
                  </div>

                  {/* Date */}
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '400', textAlign: 'right' }}>
                    {row.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
