import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const UserDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div className="mb-10 animate-fade-in" style={{ paddingBottom: '10px' }}>
          <h1 
            style={{ 
              fontSize: '36px',
              fontWeight: '800',
              color: '#272b60',
              letterSpacing: '-0.025em',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}
          >
            Mi Bitácora
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '500', margin: 0 }}>
            Gestiona tus registros diarios de forma inteligente.
          </p>
        </div>

        {/* Main Card */}
        <div 
          className="bg-white p-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 animate-slide-in"
          style={{ borderRadius: '24px', boxSizing: 'border-box' }}
        >
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#fff7ed', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px auto', 
              color: '#f97316' 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#272b60', marginBottom: '12px' }}>
            ¡Bienvenido de nuevo!
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '448px', margin: '0 auto', lineHeight: '1.6' }}>
            Aquí aparecerán tus actividades recientes y herramientas de registro. Comienza seleccionando un módulo en el menú lateral para ver tus opciones.
          </p>
          
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              style={{ 
                backgroundColor: '#272b60', 
                color: 'white', 
                padding: '12px 32px', 
                borderRadius: '12px', 
                fontWeight: '700', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Nueva Actividad
            </button>
            <button 
              style={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                color: '#272b60', 
                padding: '12px 32px', 
                borderRadius: '12px', 
                fontWeight: '700', 
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Ver Reportes
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            { label: 'Registros Hoy', value: '12', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Pendientes', value: '05', color: '#ea580c', bg: '#fff7ed' },
            { label: 'Completados', value: '28', color: '#16a34a', bg: '#f0fdf4' },
          ].map((stat, i) => (
            <div 
              key={i}
              className="bg-white border border-gray-100 shadow-sm"
              style={{ borderRadius: '20px', padding: '24px' }}
            >
              <p style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>{stat.label}</p>
              <p style={{ fontSize: '30px', fontWeight: '900', color: stat.color, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
