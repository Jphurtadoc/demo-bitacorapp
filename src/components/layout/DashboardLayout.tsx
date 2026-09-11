import React, { useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { getStoredUser } from '@/modules/auth/login/infrastructure/AuthRepository';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const MOBILE_QUERY = '(max-width: 767px)';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const currentUser = getStoredUser();
  const isVigilante = currentUser?.role === 'vigilante';

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => {
      const nextIsMobile = mediaQuery.matches;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) {
        setIsMobileNavOpen(false);
      }
    };
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileNavOpen((isOpen) => !isOpen);
  };

  const handleMobileNavClose = () => {
    setIsMobileNavOpen(false);
  };

  const sidebarWidth = isVigilante
    ? '0px'
    : isMobile
      ? '0px'
      : isCollapsed
        ? '72px'
        : '260px';

  return (
    <div className="min-h-screen bg-background">
      <Header
        sidebarOffset={sidebarWidth}
        isMobileNavOpen={isMobileNavOpen}
        onMobileMenuToggle={isVigilante ? undefined : handleMobileMenuToggle}
        hideChrome={isVigilante}
      />
      {!isVigilante && (
        <Sidebar
          isCollapsed={isMobile ? false : isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
          isMobileNavOpen={isMobileNavOpen}
          onMobileNavClose={handleMobileNavClose}
        />
      )}

      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth})` }}
      >
        <main
          className="flex min-h-screen flex-col"
          style={{
            boxSizing: 'border-box',
            paddingTop: isVigilante ? '72px' : '88px',
            paddingLeft: isVigilante ? '20px' : '24px',
            paddingRight: isVigilante ? '20px' : '24px',
            paddingBottom: isVigilante ? '20px' : '10px',
          }}
        >
          <div className="flex-1">{children}</div>

          {!isVigilante && (
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
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
