import React, { useState } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const sidebarWidth = isCollapsed ? '72px' : '260px';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth})` }}
      >
        <main
          className="flex min-h-screen flex-col"
          style={{
            boxSizing: 'border-box',
            paddingTop: '88px',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: '10px',
          }}
        >
          <div className="flex-1">{children}</div>

          <div className="mt-10 pb-2.5 text-center">
            <p className="m-0 text-[13.5px] font-medium text-subtle">
              Demo App © {new Date().getFullYear()}{' '}
              <a
                href="https://answertic.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary no-underline hover:underline"
              >
                answertic.com
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
