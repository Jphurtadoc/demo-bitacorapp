import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Radio, 
  Shield, 
  HardDrive, 
  Cctv,
  Bell,
  Eye,
  ChevronDown,
  Download,
  Package,
  X,
  CreditCard
} from 'lucide-react';

interface Item {
  id: string;
  icon: 'Cctv' | 'Radio' | 'Shield' | 'HardDrive' | 'Bell' | 'Eye';
  name: string;
  reference: string;
  category: string;
  unitPrice: number;
  unitType: string;
  currency: string;
  status: 'Activo' | 'Inactivo' | 'Agotado';
}

const initialItems: Item[] = [
  {
    id: '1',
    icon: 'Cctv',
    name: 'Cámara Domo IP 4K',
    reference: 'CAM-DM-4K-01',
    category: 'Vigilancia',
    unitPrice: 485000,
    unitType: 'Unidad',
    currency: 'COP',
    status: 'Activo'
  },
  {
    id: '2',
    icon: 'Radio',
    name: 'Radio Walkie Talkie Pro',
    reference: 'RAD-WT-PRO-02',
    category: 'Comunicación',
    unitPrice: 320000,
    unitType: 'Par',
    currency: 'COP',
    status: 'Activo'
  },
  {
    id: '3',
    icon: 'Shield',
    name: 'Sensor Movimiento PIR',
    reference: 'SNS-PIR-X5',
    category: 'Sensores',
    unitPrice: 145000,
    unitType: 'Unidad',
    currency: 'COP',
    status: 'Activo'
  },
  {
    id: '4',
    icon: 'HardDrive',
    name: 'Disco Duro 4TB Purple',
    reference: 'HDD-SEA-4TB',
    category: 'Almacenamiento',
    unitPrice: 590000,
    unitType: 'Unidad',
    currency: 'COP',
    status: 'Agotado'
  },
  {
    id: '5',
    icon: 'Bell',
    name: 'Sirena Exterior 120dB',
    reference: 'ALM-SIR-OUT',
    category: 'Alarmas',
    unitPrice: 115000,
    unitType: 'Unidad',
    currency: 'COP',
    status: 'Inactivo'
  },
  {
    id: '6',
    icon: 'Eye',
    name: 'Lente Varifocal 2.8-12mm',
    reference: 'LNS-VF-12',
    category: 'Accesorios',
    unitPrice: 85000,
    unitType: 'Unidad',
    currency: 'COP',
    status: 'Activo'
  }
];

const IconRenderer = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'Cctv': return <Cctv style={{ color: '#3b82f6' }} size={24} />;
    case 'Radio': return <Radio style={{ color: '#f97316' }} size={24} />;
    case 'Shield': return <Shield style={{ color: '#10b981' }} size={24} />;
    case 'HardDrive': return <HardDrive style={{ color: '#a855f7' }} size={24} />;
    case 'Bell': return <Bell style={{ color: '#ef4444' }} size={24} />;
    case 'Eye': return <Eye style={{ color: '#06b6d4' }} size={24} />;
    default: return <Package size={24} />;
  }
};

const ItemsList: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    reference: '',
    category: 'Vigilancia',
    unitPrice: 0,
    unitType: 'Unidad',
    currency: 'COP',
    status: 'Activo',
    icon: 'Cctv'
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        reference: '',
        category: 'Vigilancia',
        unitPrice: 0,
        unitType: 'Unidad',
        currency: 'COP',
        status: 'Activo',
        icon: 'Cctv'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData } as Item : i));
    } else {
      const newItem: Item = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Item;
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: Item['status']) => {
    switch (status) {
      case 'Activo': return { bg: '#def7ec', text: '#03543f', border: '#bcf0da' };
      case 'Inactivo': return { bg: '#fde8e8', text: '#9b1c1c', border: '#fbd5d5' };
      case 'Agotado': return { bg: '#fef3c7', text: '#92400e', border: '#fce96c' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div 
        className="animate-fade-in relative"
        style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#272b60', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Catálogo de Equipos
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500', margin: 0 }}>
              Gestión administrativa de activos y suministros de seguridad en moneda local (COP).
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
                color: '#272b60', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <Download size={18} />
              <span>Exportar</span>
            </button>
            <button 
              onClick={() => handleOpenModal()}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', 
                backgroundColor: '#272b60', border: 'none', borderRadius: '12px',
                color: '#ffffff', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(39,43,96,0.2)', transition: 'all 0.2s'
              }}
            >
              <Plus size={18} />
              <span>Nuevo Item</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div 
          style={{ 
            backgroundColor: '#ffffff', padding: '16px', borderRadius: '20px', 
            border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <div style={{ position: 'absolute', inset: '0 auto 0 0', paddingLeft: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: '#94a3b8' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o referencia..."
              style={{ 
                width: '100%', padding: '12px 16px 12px 44px', backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px',
                outline: 'none', transition: 'all 0.2s'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                color: '#475569', fontWeight: '600', fontSize: '13px', cursor: 'pointer'
              }}
            >
              <Filter size={16} />
              <span>Filtros</span>
              <ChevronDown size={14} />
            </button>
            <div style={{ height: '20px', width: '1px', backgroundColor: '#e2e8f0' }}></div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', margin: 0 }}>
              Total: <span style={{ color: '#272b60' }}>{filteredItems.length}</span> items
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div 
          style={{ 
            backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #f1f5f9', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Imagen</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Referencia</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoría</th>
                  <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precio (COP)</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>U. Medida</th>
                  <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
                  <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #f1f5f9' }}>
                {filteredItems.map((item) => {
                  const statusStyles = getStatusColor(item.status);
                  return (
                    <tr 
                      key={item.id} 
                      style={{ borderBottom: '1px solid #f8f8f8', transition: 'background-color 0.2s' }}
                      className="hover:bg-gray-50/30"
                    >
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ 
                          width: '48px', height: '48px', backgroundColor: '#f8fafc', 
                          borderRadius: '14px', display: 'flex', alignItems: 'center', 
                          justifyContent: 'center', border: '1px solid #f1f5f9'
                        }}>
                          <IconRenderer icon={item.icon} />
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <p style={{ fontWeight: '700', color: '#272b60', fontSize: '15px', margin: 0 }}>{item.name}</p>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '6px', 
                          fontSize: '12px', fontWeight: '600', color: '#64748b', fontFamily: 'monospace' 
                        }}>
                          {item.reference}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ color: '#64748b', fontWeight: '600', fontSize: '13px' }}>{item.category}</span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                          <span style={{ fontWeight: '800', color: '#272b60', fontSize: '15px' }}>
                            $ {item.unitPrice.toLocaleString('es-CO')}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>COP</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ color: '#64748b', fontWeight: '600', fontSize: '13px' }}>{item.unitType}</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span 
                            style={{ 
                              backgroundColor: statusStyles.bg, 
                              color: statusStyles.text,
                              border: `1px solid ${statusStyles.border}`,
                              padding: '6px 14px',
                              borderRadius: '99px',
                              fontSize: '11px',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: '0.02em'
                            }}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            onClick={() => handleOpenModal(item)}
                            style={{ 
                              padding: '8px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', 
                              borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            className="hover:bg-orange-50 hover:text-orange-500 hover:border-orange-100"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            style={{ 
                              padding: '8px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', 
                              borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            className="hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredItems.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Package style={{ margin: '0 auto 16px', color: '#f1f5f9' }} size={64} />
              <p style={{ color: '#94a3b8', fontWeight: '600', fontSize: '15px' }}>No se encontraron items en el catálogo.</p>
            </div>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {isModalOpen && createPortal(
          <div style={{ 
            position: 'fixed', inset: 0, zIndex: 1000, 
            backgroundColor: 'rgba(39, 43, 96, 0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
          }}>
            <div style={{ 
              backgroundColor: '#fff', width: '100%', maxWidth: '560px', borderRadius: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#272b60' }}>
                    {editingItem ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#272b60', margin: 0 }}>
                    {editingItem ? 'Editar Item' : 'Agregar Nuevo Item'}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px', backgroundColor: '#f8fafc', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '4px' }}>Nombre del Equipo</label>
                    <input 
                      required
                      type="text" 
                      style={{ width: '100%', padding: '14px 18px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#272b60', outline: 'none' }}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '4px' }}>Referencia</label>
                    <input 
                      required
                      type="text" 
                      style={{ width: '100%', padding: '14px 18px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#272b60', outline: 'none' }}
                      value={formData.reference}
                      onChange={e => setFormData({...formData, reference: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '4px' }}>Categoría</label>
                    <select 
                      style={{ width: '100%', padding: '14px 18px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#272b60', outline: 'none', cursor: 'pointer' }}
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Vigilancia</option>
                      <option>Comunicación</option>
                      <option>Sensores</option>
                      <option>Almacenamiento</option>
                      <option>Alarmas</option>
                      <option>Accesorios</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '4px' }}>Precio Unitario (COP)</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: '0 auto 0 0', paddingLeft: '14px', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: '#94a3b8' }}>
                        <CreditCard size={16} />
                      </div>
                      <input 
                        required
                        type="number" 
                        step="1"
                        style={{ width: '100%', padding: '14px 18px 14px 40px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', fontWeight: '700', color: '#272b60', outline: 'none' }}
                        value={formData.unitPrice}
                        onChange={e => setFormData({...formData, unitPrice: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '4px' }}>Estado Operativo</label>
                    <select 
                      style={{ width: '100%', padding: '14px 18px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#272b60', outline: 'none', cursor: 'pointer' }}
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as Item['status']})}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Agotado">Agotado</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '14px', color: '#64748b', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                    className="hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    style={{ flex: 1, padding: '14px', backgroundColor: '#272b60', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(39,43,96,0.3)', transition: 'all 0.2s' }}
                    className="hover:opacity-90 active:scale-95"
                  >
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

export default ItemsList;
