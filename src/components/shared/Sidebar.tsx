import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import logo from '@/assets/bitacorapp-logo.png';
import favicon from '@/assets/favicon.png';

import { modules, menuData } from '@/config/menuData';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedModule, setSelectedModule] = useState('administracion');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync selected module with current route
  React.useEffect(() => {
    const currentPath = location.pathname;
    const foundModule = Object.entries(menuData).find(entry => 
      entry[1].some(item => currentPath.startsWith(item.path.split('/')[1] ? `/${item.path.split('/')[1]}` : item.path))
    );
    if (foundModule) {
      setSelectedModule(foundModule[0]);
    }
  }, [location.pathname]);

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
        className="absolute bg-white border border-gray-100 shadow-md hover:text-orange-500 transition-all z-[60]"
        style={{ 
          cursor: 'pointer', 
          right: '-12px', 
          top: '80px', 
          borderRadius: '9999px',
          padding: '6px'
        }}
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
                const moduleId = e.target.value;
                setSelectedModule(moduleId);
                const dashboardItem = menuData[moduleId]?.find(m => m.label.toLowerCase() === 'dashboard') || menuData[moduleId]?.[0];
                if (dashboardItem?.path) navigate(dashboardItem.path);
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
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#f8fafc] border border-gray-100 text-[#272b60] hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer flex items-center justify-between"
              style={{ 
                borderRadius: '12px', 
                fontWeight: '600', 
                fontSize: '13.5px',
                padding: '12px 14px',
                width: '100%',
                display: 'flex'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#ff761c', display: 'flex' }}>{activeModule?.icon}</span>
                <span>{activeModule?.label}</span>
              </div>
              <ChevronDown size={14} style={{ color: '#94a3b8' }} />
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 50 }} 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div
                  className="absolute w-full bg-white animate-fade-in custom-scrollbar"
                  style={{
                    top: '100%',
                    marginTop: '6px',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    padding: '6px',
                    zIndex: 60
                  }}
                >
                  {modules.map((mod) => {
                    const isSelected = mod.id === selectedModule;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          setSelectedModule(mod.id);
                          setIsDropdownOpen(false);
                          const dashboardItem = menuData[mod.id]?.find(m => m.label.toLowerCase() === 'dashboard') || menuData[mod.id]?.[0];
                          if (dashboardItem?.path) navigate(dashboardItem.path);
                        }}
                        className="flex items-center cursor-pointer transition-colors"
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          gap: '12px',
                          color: isSelected ? '#ea580c' : '#475569',
                          backgroundColor: isSelected ? '#fff7ed' : 'transparent',
                          fontWeight: isSelected ? '600' : '500',
                          fontSize: '13.5px',
                          marginBottom: '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <span style={{ color: isSelected ? '#ea580c' : '#94a3b8', display: 'flex' }}>
                          {mod.icon}
                        </span>
                        <span>{mod.label}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar" 
        style={{ padding: isCollapsed ? '0 10px' : '0 16px' }}
      >
        {!isCollapsed && (
          <p 
            className="animate-fade-in text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider"
            style={{ marginBottom: '12px', paddingLeft: '12px' }}
          >
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
                  display: 'flex',
                  alignItems: 'center',
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
