import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User, Mail, Shield, Key, Bell, Settings, ChevronRight } from 'lucide-react';

const UserProfile = () => {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#272b60', marginBottom: '8px' }}>Mi Perfil</h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Administra tu información personal y preferencias de cuenta</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '32px' }}>
          {/* Sidebar */}
          <div className="col-span-1">
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                   <User size={36} />
                 </div>
                 <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#272b60', margin: 0 }}>Administrador Demo</h2>
                 <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>Super Administrador</p>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#f8fafc', color: '#272b60', fontWeight: '600', cursor: 'pointer' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Settings size={18} style={{ color: '#64748b' }}/> Información Básica</div>
                   <ChevronRight size={16} />
                 </button>
                 <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer' }} className="hover:bg-gray-50">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Key size={18}/> Seguridad</div>
                 </button>
                 <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer' }} className="hover:bg-gray-50">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Bell size={18}/> Notificaciones</div>
                 </button>
               </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
               <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#272b60', marginBottom: '24px' }}>Detalles de la Cuenta</h3>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                 <div>
                   <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Nombres</label>
                   <input type="text" defaultValue="Administrador" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#272b60', fontWeight: '500', outline: 'none' }} />
                 </div>
                 <div>
                   <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Apellidos</label>
                   <input type="text" defaultValue="Demo" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#272b60', fontWeight: '500', outline: 'none' }} />
                 </div>
                 <div style={{ gridColumn: 'span 2' }}>
                   <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Correo Electrónico</label>
                   <div style={{ position: 'relative' }}>
                     <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                     <input type="email" defaultValue="admin.demo@bitacorapp.com" style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#272b60', fontWeight: '500', outline: 'none', boxSizing: 'border-box' }} />
                   </div>
                 </div>
                 <div style={{ gridColumn: 'span 2' }}>
                   <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Rol Asignado</label>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                     <Shield size={18} style={{ color: '#10b981' }} />
                     <span style={{ fontWeight: '600', color: '#272b60' }}>Super Administrador</span>
                     <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '10px' }}>Solo lectura</span>
                   </div>
                 </div>
               </div>
               
               <div style={{ display: 'flex', justifySelf: 'flex-start', marginTop: '32px' }}>
                 <button style={{ padding: '14px 28px', backgroundColor: '#272b60', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(39,43,96,0.2)' }} className="hover:opacity-90 transition-all">
                   Guardar Cambios
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
