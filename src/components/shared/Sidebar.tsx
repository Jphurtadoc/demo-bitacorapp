import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Settings2,
  LayoutDashboard, 
  BarChart3, 
  FilePieChart, 
  TrendingUp,
  Truck,
  Package,
  MapPin,
  Eye,
  ShieldAlert,
  Radio,
  MessageSquare,
  HelpCircle,
  Inbox,
  Award,
  CheckCircle2,
  FileText,
  LifeBuoy,
  Wrench,
  MessageCircle,
  Megaphone,
  Mail,
  Phone,
  UserCircle,
  Heart,
  GraduationCap,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart4,
  PieChart,
  LineChart,
  UserCheck,
  ClipboardCheck,
  ThumbsUp,
  FileSearch,
  Box,
  Layers,
  ListTodo,
  Shield,
  UserRound,
  Globe
} from 'lucide-react';
import logo from '@/assets/bitacorapp-logo.png';
import favicon from '@/assets/favicon.png';

const modules = [
  { id: 'administracion', label: 'Administración', icon: <Shield size={18} /> },
  { id: 'operacion', label: 'Operación', icon: <Settings2 size={18} /> },
  { id: 'tareas', label: 'Tareas', icon: <ListTodo size={18} /> },
  { id: 'reportes', label: 'Reportes', icon: <BarChart3 size={18} /> },
  { id: 'logistica', label: 'Logística', icon: <Truck size={18} /> },
  { id: 'vigilancia', label: 'Vigilancia', icon: <Eye size={18} /> },
  { id: 'pqrs', label: 'PQRS', icon: <MessageSquare size={18} /> },
  { id: 'calidad', label: 'Calidad', icon: <Award size={18} /> },
  { id: 'soporte', label: 'Soporte', icon: <LifeBuoy size={18} /> },
  { id: 'comunicaciones', label: 'Comunicaciones', icon: <Globe size={18} /> },
  { id: 'gestion_humana', label: 'Gestión Humana', icon: <UserRound size={18} /> },
];

const menuData: Record<string, { label: string; icon: React.ReactNode; path: string }[]> = {
  administracion: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { label: 'Ind. Gerenciales', icon: <BarChart4 size={20} />, path: '/admin/ind-gerenciales' },
    { label: 'Ind. PQRS', icon: <PieChart size={20} />, path: '/admin/ind-pqrs' },
    { label: 'Ind. de Uso', icon: <LineChart size={20} />, path: '/admin/ind-uso' },
    { label: 'Gestión Clientes', icon: <UserCheck size={20} />, path: '/admin/gestion-clientes' },
    { label: 'Reporte Gestión', icon: <FilePieChart size={20} />, path: '/admin/reporte-gestion' },
    { label: 'Chequeo Supervisión', icon: <ClipboardCheck size={20} />, path: '/admin/supervision' },
    { label: 'Recomendaciones', icon: <MessageSquare size={20} />, path: '/admin/recom' },
    { label: 'Satisfacción', icon: <ThumbsUp size={20} />, path: '/admin/satisfaccion' },
    { label: 'Documentación', icon: <FileText size={20} />, path: '/admin/docs' },
  ],
  operacion: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/oper/dashboard' },
    { label: 'Items', icon: <Layers size={20} />, path: '/oper/items' },
    { label: 'Cotizaciones', icon: <FilePieChart size={20} />, path: '/oper/cotizaciones' },
    { label: 'Kits', icon: <Box size={20} />, path: '/oper/kits' },
    { label: 'Configuraciones', icon: <Settings size={20} />, path: '/oper/config' },
    { label: 'Documentación', icon: <FileSearch size={20} />, path: '/oper/docs' },
  ],
  tareas: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/tasks/dashboard' },
    { label: 'Tareas', icon: <ListTodo size={20} />, path: '/tasks/list' },
    { label: 'Documentación', icon: <FileText size={20} />, path: '/tasks/docs' },
  ],
  logistica: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/logistics/dashboard' },
    { label: 'Flotas', icon: <Truck size={20} />, path: '/logistics/fleet' },
    { label: 'Inventario', icon: <Package size={20} />, path: '/logistics/inventory' },
    { label: 'Rutas', icon: <MapPin size={20} />, path: '/logistics/routes' },
  ],
  vigilancia: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/security/dashboard' },
    { label: 'Monitoreo', icon: <Eye size={20} />, path: '/security/monitor' },
    { label: 'Alertas', icon: <ShieldAlert size={20} />, path: '/security/alerts' },
    { label: 'Radio', icon: <Radio size={20} />, path: '/security/radio' },
  ],
  pqrs: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/pqrs/dashboard' },
    { label: 'Recibidos', icon: <Inbox size={20} />, path: '/pqrs/inbox' },
    { label: 'Chat', icon: <MessageSquare size={20} />, path: '/pqrs/chat' },
    { label: 'FAQs', icon: <HelpCircle size={20} />, path: '/pqrs/faqs' },
  ],
  calidad: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/quality/dashboard' },
    { label: 'Certificaciones', icon: <Award size={20} />, path: '/quality/certs' },
    { label: 'Auditoría', icon: <CheckCircle2 size={20} />, path: '/quality/audit' },
    { label: 'Documentos', icon: <FileText size={20} />, path: '/quality/docs' },
  ],
  soporte: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/support/dashboard' },
    { label: 'Soporte IT', icon: <LifeBuoy size={20} />, path: '/support/it' },
    { label: 'Mantenimiento', icon: <Wrench size={20} />, path: '/support/mt' },
    { label: 'Ticket', icon: <MessageCircle size={20} />, path: '/support/tickets' },
  ],
  comunicaciones: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/comms/dashboard' },
    { label: 'Anuncios', icon: <Megaphone size={20} />, path: '/comms/announcements' },
    { label: 'Email', icon: <Mail size={20} />, path: '/comms/email' },
    { label: 'Directorio', icon: <Phone size={20} />, path: '/comms/directory' },
  ],
  gestion_humana: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/hr/dashboard' },
    { label: 'Empleados', icon: <UserCircle size={20} />, path: '/hr/employees' },
    { label: 'Beneficios', icon: <Heart size={20} />, path: '/hr/benefits' },
    { label: 'Formación', icon: <GraduationCap size={20} />, path: '/hr/training' },
  ],
  reportes: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/reports/dashboard' },
    { label: 'Resumen', icon: <BarChart3 size={20} />, path: '/reports/summary' },
    { label: 'Exportar', icon: <FilePieChart size={20} />, path: '/reports/export' },
    { label: 'Métricas', icon: <TrendingUp size={20} />, path: '/reports/metrics' },
  ],
};

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedModule, setSelectedModule] = useState('administracion');

  const activeMenu = menuData[selectedModule] || [];
  const activeModule = modules.find(m => m.id === selectedModule);

  return (
    <aside 
      className="fixed left-0 top-0 h-screen bg-white shadow-xl flex flex-col z-50 border-r border-gray-100 transition-all duration-300 ease-in-out"
      style={{ 
        width: isCollapsed ? '80px' : '260px', 
        boxSizing: 'border-box' 
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-gray-100 rounded-full p-1.5 shadow-md hover:text-orange-500 transition-all z-[60]"
        style={{ cursor: 'pointer' }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div 
        className={`flex items-center border-b border-gray-50 bg-white transition-all duration-300`}
        style={{ padding: isCollapsed ? '20px 10px' : '24px 20px', marginBottom: '16px', minHeight: '97px' }}
      >
        {isCollapsed ? (
          <img 
            src={favicon} 
            alt="Bitacorapp" 
            className="object-contain transition-all duration-300"
            style={{ width: '44px', height: '44px' }}
          />
        ) : (
          <img src={logo} alt="Bitacorapp Logo" className="h-12 w-auto object-contain animate-fade-in" />
        )}
      </div>

      {/* Module Selector */}
      <div 
        style={{ 
          padding: isCollapsed ? '0 10px' : '0 16px', 
          marginBottom: '24px' 
        }}
      >
        {!isCollapsed && (
          <p 
            className="animate-fade-in"
            style={{ 
              fontSize: '10px', 
              fontWeight: '700', 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              marginBottom: '10px',
              paddingLeft: '4px',
              display: 'block'
            }}
          >
            Módulo Activo
          </p>
        )}
        {isCollapsed ? (
          /* Collapsed: show only icon in a pill */
          <div 
            className="group cursor-pointer hover:bg-orange-50 transition-all"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              color: '#ff761c',
              position: 'relative'
            }}
            title={activeModule?.label}
          >
            {activeModule?.icon}
            {/* Hidden select for interaction */}
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                const firstPath = menuData[e.target.value]?.[0]?.path;
                if (firstPath) navigate(firstPath);
              }}
              style={{ 
                position: 'absolute', 
                inset: 0, 
                opacity: 0, 
                cursor: 'pointer',
                width: '100%',
                height: '100%'
              }}
            >
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* Expanded: full labeled selector with icon */
          <div style={{ position: 'relative' }}>
            {/* Icon overlay */}
            <div 
              style={{ 
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#ff761c',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {activeModule?.icon}
            </div>
            {/* ChevronDown overlay */}
            <div 
              style={{ 
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronDown size={14} />
            </div>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                const firstPath = menuData[e.target.value]?.[0]?.path;
                if (firstPath) navigate(firstPath);
              }}
              className="w-full bg-[#f8fafc] border border-gray-100 text-[#272b60] hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer"
              style={{ 
                borderRadius: '12px', 
                fontWeight: '600', 
                appearance: 'none',
                fontSize: '13.5px',
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '42px',
                paddingRight: '36px',
                width: '100%',
                display: 'block'
              }}
            >
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar" 
        style={{ padding: isCollapsed ? '0 10px' : '0 16px' }}
      >
        {!isCollapsed && (
          <p className="animate-fade-in text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 pl-3">
            Navegación
          </p>
        )}
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {activeMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center transition-all duration-200 group ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 shadow-sm border-l-4 border-orange-500' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`}
                style={{ 
                  padding: isCollapsed ? '12px' : '10px 14px', 
                  borderRadius: '10px',
                  gap: isCollapsed ? '0' : '12px',
                  borderTop: 'none',
                  borderBottom: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  justifyContent: isCollapsed ? 'center' : 'flex-start'
                }}
              >
                <div 
                  className={`${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="animate-fade-in font-semibold" style={{ fontSize: '13.5px' }}>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && isActive && (
                  <div className="ml-auto flex items-center">
                    <div className="w-1 h-1 rounded-full bg-orange-500" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div 
        className="mt-auto border-t border-gray-50 bg-[#f9fafb]/50" 
        style={{ padding: isCollapsed ? '15px 10px' : '18px 20px' }}
      >
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center text-gray-500 hover:text-red-500 hover:bg-red-50/50 transition-all font-semibold"
          style={{ 
            padding: isCollapsed ? '12px' : '12px 14px', 
            borderRadius: '10px',
            gap: isCollapsed ? '0' : '12px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <LogOut size={18} />
          {!isCollapsed && <span style={{ fontSize: '13px' }}>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
