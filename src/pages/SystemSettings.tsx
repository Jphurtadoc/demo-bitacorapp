import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings, Globe, Shield, Database, Bell, CreditCard } from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings size={18} /> },
    { id: 'security', label: 'Seguridad y Roles', icon: <Shield size={18} /> },
    { id: 'database', label: 'Base de Datos', icon: <Database size={18} /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell size={18} /> },
    { id: 'billing', label: 'Facturación', icon: <CreditCard size={18} /> },
    { id: 'localization', label: 'Regionalización', icon: <Globe size={18} /> },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#272b60', marginBottom: '8px' }}>Configuración del Sistema</h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Ajusta las opciones y parámetros globales de la aplicación</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '32px' }}>
          {/* Sidebar Nav */}
          <div className="col-span-1">
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   style={{ 
                     display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', 
                     border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s',
                     backgroundColor: activeTab === tab.id ? '#272b60' : 'transparent',
                     color: activeTab === tab.id ? '#fff' : '#64748b'
                   }}
                   className={activeTab !== tab.id ? "hover:bg-gray-100" : ""}
                 >
                   {tab.icon}
                   {tab.label}
                 </button>
               ))}
             </div>
          </div>
          
          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-3">
             <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', minHeight: '500px' }}>
               
               {activeTab === 'general' && (
                 <div className="animate-fade-in">
                   <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#272b60', marginBottom: '24px' }}>Parámetros Generales</h3>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                     <div>
                       <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Nombre de la Empresa</label>
                       <input type="text" defaultValue="Demo Corp S.A." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#272b60', fontWeight: '500', outline: 'none' }} />
                     </div>
                     <div>
                       <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>NIT / Documento</label>
                       <input type="text" defaultValue="900.123.456-7" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#272b60', fontWeight: '500', outline: 'none' }} />
                     </div>
                     <div style={{ gridColumn: 'span 2' }}>
                       <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Logo Corporativo</label>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                         <div style={{ width: '64px', height: '64px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>IMG</span>
                         </div>
                         <button style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: 'none', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cambiar Logo</button>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab !== 'general' && (
                 <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
                    <Settings size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#272b60', marginBottom: '8px' }}>Sección Bloqueada</h3>
                    <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '300px' }}>Las preferencias de <strong>{tabs.find(t => t.id === activeTab)?.label}</strong> están bloqueadas en el entorno de demostración.</p>
                 </div>
               )}

               {activeTab === 'general' && (
                 <div style={{ display: 'flex', marginTop: '40px', gap: '12px' }}>
                   <button style={{ padding: '14px 28px', backgroundColor: '#272b60', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(39,43,96,0.2)' }} className="hover:opacity-90 transition-all">
                     Guardar Cambios
                   </button>
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
