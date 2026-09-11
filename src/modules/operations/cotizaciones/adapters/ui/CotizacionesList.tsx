import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus, Search, X, Edit2, Trash2, FilePieChart, Filter } from 'lucide-react';

interface Cotizacion {
  id: string;
  code: string;
  title: string;
  status: 'Borrador' | 'Enviada' | 'Aprobada' | 'Rechazada';
  client: string;
  user: string;
  total: number;
  date: string;
  disabled: boolean;
}

const MOCK_DATA: Cotizacion[] = [
  { id: '1', code: 'COT-2041', title: 'Servicio de Mantenimiento Anual', status: 'Aprobada', client: 'Empresa Alpha S.A.', user: 'Juan Pérez', total: 4500000, date: '2026-03-20', disabled: false },
  { id: '2', code: 'COT-2042', title: 'Renovación de Licencias', status: 'Enviada', client: 'Tech Solutions Ltda', user: 'Ana Gómez', total: 1200000, date: '2026-03-21', disabled: false },
  { id: '3', code: 'COT-2043', title: 'Implementación Sistema CCTV', status: 'Borrador', client: 'Condominio El Bosque', user: 'Carlos Ruiz', total: 8500000, date: '2026-03-22', disabled: false },
  { id: '4', code: 'COT-2044', title: 'Consultoría Especializada', status: 'Rechazada', client: 'Industrias Omega', user: 'Laura Díaz', total: 3200000, date: '2026-03-23', disabled: true },
];

const CotizacionesList = () => {
  const [data, setData] = useState<Cotizacion[]>(MOCK_DATA);
  
  // Filtros
  const [filterCode, setFilterCode] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cotizacion | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    status: 'Borrador',
    client: '',
    user: '',
    total: 0
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aprobada': return { bg: 'color-mix(in srgb, #10b981 16%, var(--color-surface))', text: '#059669', border: 'color-mix(in srgb, #10b981 28%, transparent)' };
      case 'Enviada': return { bg: 'color-mix(in srgb, #2563eb 16%, var(--color-surface))', text: '#2563eb', border: 'color-mix(in srgb, #2563eb 28%, transparent)' };
      case 'Rechazada': return { bg: 'color-mix(in srgb, #ef4444 14%, var(--color-surface))', text: '#dc2626', border: 'color-mix(in srgb, #ef4444 28%, transparent)' };
      case 'Borrador': return { bg: 'var(--color-surface-muted)', text: 'var(--color-text-muted)', border: 'var(--color-border)' };
      default: return { bg: 'var(--color-surface-muted)', text: 'var(--color-text-muted)', border: 'var(--color-border)' };
    }
  };

  const filteredData = data.filter(item => {
    if (!showDisabled && item.disabled) return false;
    if (filterCode && !item.code.toLowerCase().includes(filterCode.toLowerCase())) return false;
    if (filterTitle && !item.title.toLowerCase().includes(filterTitle.toLowerCase())) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterClient && item.client !== filterClient) return false;
    if (filterUser && !item.user.toLowerCase().includes(filterUser.toLowerCase())) return false;
    return true;
  });

  const handleOpenModal = (item?: Cotizacion) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        code: item.code,
        title: item.title,
        status: item.status,
        client: item.client,
        user: item.user,
        total: item.total
      });
    } else {
      setEditingItem(null);
      setFormData({ code: `COT-${Math.floor(1000 + Math.random() * 9000)}`, title: '', status: 'Borrador', client: '', user: '', total: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, ...formData } as Cotizacion : d));
    } else {
      const newItem: Cotizacion = {
        id: Date.now().toString(),
        code: formData.code,
        title: formData.title,
        status: formData.status as 'Borrador' | 'Enviada' | 'Aprobada' | 'Rechazada',
        client: formData.client,
        user: formData.user,
        total: formData.total,
        date: new Date().toISOString().split('T')[0],
        disabled: false
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
  };

  const toggleDisable = (id: string) => {
    setData(data.map(d => d.id === id ? { ...d, disabled: !d.disabled } : d));
  };

  // Clientes únicos para el select
  const uniqueClients = Array.from(new Set(data.map(d => d.client)));

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-300">
                <FilePieChart size={28} />
              </div>
              <h1 className="page-header-title page-header-title-lg m-0">Cotizaciones</h1>
            </div>
            <p className="page-header-subtitle ml-16">
              Gestión y aprobación de propuestas comerciales
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', 
              backgroundColor: 'var(--color-brand)', color: '#fff', borderRadius: '16px', 
              fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 16px -8px rgba(91, 103, 199, 0.4)' 
            }}
            className="hover:scale-105 transition-all"
          >
            <Plus size={20} />
            Nueva Cotización
          </button>
        </div>

        {/* Filters Section */}
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-text)' }}>
            <Filter size={18} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Filtros de Búsqueda</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {/* Código */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Código</label>
              <input 
                type="text" 
                placeholder="Buscar por código" 
                value={filterCode}
                onChange={e => setFilterCode(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none' }} 
              />
            </div>
            
            {/* Título */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Título</label>
              <input 
                type="text" 
                placeholder="Buscar por título" 
                value={filterTitle}
                onChange={e => setFilterTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none' }} 
              />
            </div>
            
            {/* Estado */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Estado</label>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none', backgroundColor: 'var(--color-surface)' }}
              >
                <option value="">Seleccionar estado</option>
                <option value="Borrador">Borrador</option>
                <option value="Enviada">Enviada</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>
            
            {/* Cliente */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Cliente</label>
              <select 
                value={filterClient}
                onChange={e => setFilterClient(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none', backgroundColor: 'var(--color-surface)' }}
              >
                <option value="">Seleccionar cliente</option>
                {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            {/* Usuario */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Usuario</label>
              <input 
                type="text" 
                placeholder="Buscar por usuario" 
                value={filterUser}
                onChange={e => setFilterUser(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none' }} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
            <input 
              type="checkbox" 
              id="showDisabled" 
              checked={showDisabled}
              onChange={e => setShowDisabled(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#ff8f47', cursor: 'pointer' }} 
            />
            <label htmlFor="showDisabled" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              Mostrar deshabilitadas
            </label>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Código</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Título / Cliente</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usuario Asignado</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => {
                  const statusColors = getStatusColor(item.status);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)', opacity: item.disabled ? 0.6 : 1 }} className="hover:bg-muted/50 transition-colors">
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>{item.code}</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>{item.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{item.client}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                            {item.user.charAt(0)}
                          </div>
                          <span style={{ fontWeight: '500', color: 'var(--color-text-muted)', fontSize: '13.5px' }}>{item.user}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>{formatCurrency(item.total)}</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', 
                          backgroundColor: statusColors.bg, color: statusColors.text, border: `1px solid ${statusColors.border}`
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'flex-end', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => toggleDisable(item.id)} style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid var(--color-border)', borderRadius: '10px', color: item.disabled ? '#10b981' : '#f59e0b', cursor: 'pointer' }} title={item.disabled ? "Habilitar" : "Deshabilitar"}>
                            <Search size={16} />
                          </button>
                          <button onClick={() => handleOpenModal(item)} style={{ padding: '8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-muted)', cursor: 'pointer' }} className="hover:text-foreground">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setData(data.filter(d => d.id !== item.id))} className="danger-action-btn cursor-pointer rounded-[10px] p-2 transition-colors" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <FilePieChart className="mx-auto mb-4 text-subtle" size={64} />
              <p style={{ color: 'var(--color-text-muted)', fontWeight: '600', fontSize: '15px' }}>No se encontraron cotizaciones.</p>
            </div>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {isModalOpen && createPortal(
          <div style={{ 
            position: 'fixed', inset: 0, zIndex: 1000, 
            backgroundColor: 'var(--color-overlay)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
          }}>
            <div style={{ 
              backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '600px', borderRadius: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="page-drawer-title text-xl">
                  {editingItem ? 'Editar Cotización' : 'Nueva Cotización'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px', backgroundColor: 'var(--color-surface-muted)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Código</label>
                    <input required type="text" style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', outline: 'none' }} value={formData.code} readOnly />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Estado</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', outline: 'none' }}>
                      <option>Borrador</option>
                      <option>Enviada</option>
                      <option>Aprobada</option>
                      <option>Rechazada</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Título</label>
                    <input required type="text" placeholder="Ej. Implementación CCTV" style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', outline: 'none' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Cliente</label>
                    <input required type="text" placeholder="Razón social" style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', outline: 'none' }} value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Usuario Asignado</label>
                    <input required type="text" placeholder="Nombre completo" style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', outline: 'none' }} value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Valor Total (COP)</label>
                    <input required type="number" style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--color-surface-muted)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', outline: 'none' }} value={formData.total} onChange={e => setFormData({...formData, total: parseInt(e.target.value)||0})} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', backgroundColor: 'var(--color-surface-muted)', border: 'none', borderRadius: '14px', color: 'var(--color-text-muted)', fontWeight: '700', cursor: 'pointer' }} className="hover:bg-muted">
                    Cancelar
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '14px', backgroundColor: 'var(--color-brand)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(91,103,199,0.28)' }} className="hover:opacity-90 active:scale-95">
                    {editingItem ? 'Guardar Cambios' : 'Crear Registro'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        , document.body)}

      </div>
    </DashboardLayout>
  );
};

export default CotizacionesList;
