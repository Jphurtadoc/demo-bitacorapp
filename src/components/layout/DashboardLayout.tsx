import React, { useState } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sidebar widths
  const sidebarWidth = isCollapsed ? '80px' : '260px';

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth})` }}
      >
        <Header sidebarWidth={sidebarWidth} />
        
        <main 
          className="min-h-screen"
          style={{ 
            boxSizing: 'border-box',
            paddingTop: '70px',
            paddingLeft: '32px',
            paddingRight: '32px',
            paddingBottom: '40px'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
