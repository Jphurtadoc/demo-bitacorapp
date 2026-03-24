import React, { useState, useRef, useEffect } from 'react';
import { User, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  sidebarWidth?: string;
}

const Header: React.FC<HeaderProps> = ({ sidebarWidth = '260px' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <header 
      className="fixed top-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between z-40 transition-all duration-300 ease-in-out"
      style={{ 
        left: sidebarWidth, 
        height: '70px', 
        padding: '0 32px',
        boxSizing: 'border-box'
      }}
    >
      {/* Left side: Search bar */}
      <div className="relative hidden md:block" style={{ width: '360px' }}>
        <div 
          className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
          style={{ paddingLeft: '14px', color: '#cbd5e1' }}
        >
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Buscar en Bitacorapp..."
          className="block w-full border border-gray-200 text-sm text-[#272b60] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
          style={{ 
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            paddingLeft: '42px', 
            paddingRight: '16px', 
            paddingTop: '10px', 
            paddingBottom: '10px',
            borderRadius: '12px',
            fontSize: '13.5px',
          }}
        />
      </div>

      {/* Right side: User info */}
      <div className="flex items-center" style={{ gap: '14px' }}>
        {/* Separator */}
        <div style={{ height: '28px', width: '1px', backgroundColor: '#f1f5f9' }}></div>

        <div className="relative" ref={menuRef}>
          <div 
            className="flex items-center cursor-pointer group" 
            style={{ gap: '12px' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="text-right hidden sm:block">
              <p style={{ 
                margin: 0, 
                fontSize: '13.5px', 
                fontWeight: '600', 
                color: '#272b60', 
                lineHeight: '1.2' 
              }}>
                Admin Demo
              </p>
              <p style={{ 
                margin: '3px 0 0 0', 
                fontSize: '11px', 
                fontWeight: '500', 
                color: '#94a3b8', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em' 
              }}>
                Super Administrador
              </p>
            </div>
            
            <div 
              className={`flex items-center justify-center text-white transition-all duration-200 ${isMenuOpen ? 'ring-4 ring-orange-500/10' : ''}`}
              style={{ 
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#272b60',
                boxShadow: '0 4px 12px rgba(39,43,96,0.18)'
              }}
            >
              <User size={18} />
            </div>
            
            <ChevronDown 
              size={14} 
              className={`text-gray-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} 
            />
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div 
              className="absolute right-0 animate-fade-in z-50 overflow-hidden"
              style={{ 
                top: 'calc(100% + 12px)', 
                width: '240px', 
                backgroundColor: '#ffffff', 
                borderRadius: '20px', 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
                border: '1px solid #f1f5f9',
                padding: '8px'
              }}
            >
              <div style={{ padding: '16px 12px', borderBottom: '1px solid #f8fafc', marginBottom: '8px' }}>
                <p style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px', textTransform: 'uppercase' }}>Sesión Activa</p>
                <p style={{ fontSize: '13.5px', fontWeight: '700', color: '#272b60', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>admin.demo@bitacorapp.com</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button 
                  className="w-full flex items-center transition-colors border-none"
                  style={{ 
                    padding: '10px 12px', 
                    gap: '12px', 
                    borderRadius: '12px', 
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', margin: 'auto' }}><User size={16} /></div>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>Mi Perfil</span>
                </button>

                <button 
                  className="w-full flex items-center transition-colors border-none"
                  style={{ 
                    padding: '10px 12px', 
                    gap: '12px', 
                    borderRadius: '12px', 
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onClick={() => { setIsMenuOpen(false); navigate('/settings'); }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', margin: 'auto' }}><Settings size={16} /></div>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#475569' }}>Configuración</span>
                </button>
              </div>

              <div style={{ margin: '8px 4px', height: '1px', backgroundColor: '#f1f5f9' }}></div>

              <button 
                className="w-full flex items-center transition-colors border-none"
                style={{ 
                  padding: '10px 12px', 
                  gap: '12px', 
                  borderRadius: '12px', 
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onClick={handleLogout}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ display: 'flex', margin: 'auto' }}><LogOut size={16} /></div>
                </div>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#ef4444' }}>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
