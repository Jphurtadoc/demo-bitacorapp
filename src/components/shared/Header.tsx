import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Bell,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Surface } from "@/components/UI/surface";
import { EmphasisIcon } from "@/components/UI/emphasis";
import { ThemeModeMenuItem } from "@/components/UI/theme";
import logo from "@/assets/bitacorapp-logo.png";

interface HeaderProps {
  logoColumnWidth?: string;
}

const UNREAD_NOTIFICATIONS = 3;

const Header: React.FC<HeaderProps> = ({ logoColumnWidth = "100px" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full border-b border-border bg-surface shadow-sm">
      <div
        className="flex h-16 shrink-0 border-r border-border bg-[#ffffff]"
        style={{ width: logoColumnWidth }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Ir al dashboard"
          className="flex h-full w-full items-center justify-center p-1.5 transition-opacity hover:opacity-90"
        >
          <img
            src={logo}
            alt="Bitacorapp Logo"
            className="h-full w-full object-contain object-center"
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 pr-4 md:pr-6 pl-3 md:pl-4">
        <div className="flex flex-row items-center gap-4">
          <div>
            <span className="mb-0.5 ml-1 block text-[10px] font-semibold uppercase tracking-wider text-subtle">
              Organización
            </span>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 transition-colors hover:border-border hover:bg-muted"
            >
              <Building2 size={14} className="text-subtle" />
              <span className="text-sm font-semibold text-foreground">
                Seguridad Shatter
              </span>
              <ChevronDown size={13} className="text-subtle" />
            </button>
          </div>
        </div>

        <div className="mx-6 hidden max-w-xl flex-1 lg:block">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-subtle">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Buscar módulos, procesos, usuarios, vehículos, rondas..."
              className="block w-full rounded-full border border-border bg-muted py-2 pl-10 pr-12 text-sm text-foreground placeholder:text-subtle transition-all focus:border-primary/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="flex items-center justify-center rounded border border-border bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-subtle shadow-sm">
                ⌘K
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-0.5 md:gap-1">
            <button
              type="button"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full text-subtle transition-colors hover:bg-muted sm:flex"
              aria-label={
                UNREAD_NOTIFICATIONS > 0
                  ? `Notificaciones, ${UNREAD_NOTIFICATIONS} sin leer`
                  : "Notificaciones"
              }
            >
              <Bell size={18} strokeWidth={2.25} />
              {UNREAD_NOTIFICATIONS > 0 ? (
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-0.5 -top-0.5 flex h-[18px] items-center justify-center rounded-full border-2 border-surface bg-primary text-[10px] font-bold leading-none text-[#ffffff] shadow-[0_2px_6px_rgba(255,118,28,0.45)] tabular-nums ${
                    UNREAD_NOTIFICATIONS > 9 ? "min-w-[22px] px-1" : "w-[18px]"
                  }`}
                >
                  {UNREAD_NOTIFICATIONS > 99 ? "99+" : UNREAD_NOTIFICATIONS}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="hidden rounded-full p-1.5 text-subtle transition-colors hover:bg-muted sm:block"
              aria-label="Ayuda"
            >
              <HelpCircle size={18} />
            </button>
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="group flex cursor-pointer items-center gap-2.5 rounded-full p-1 pr-2 transition-colors hover:bg-muted md:gap-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary text-sm font-semibold text-[#ffffff] shadow-sm"
                aria-hidden
              >
                JP
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold leading-tight text-foreground">
                  Juan Pablo
                </p>
                <p className="text-[11px] font-medium text-subtle">
                  Administrador
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`ml-0.5 text-subtle transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMenuOpen && (
              <Surface radius="xl" padding="sm" className="absolute right-0 z-50 mt-2 w-72 animate-fade-in overflow-hidden shadow-lg">
                <div className="mb-2 border-b border-border px-4 py-3">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-subtle">
                    Sesión Activa
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    jpablo@bitacorapp.com
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <EmphasisIcon tone="info" size="sm" className="!rounded-md">
                      <User size={16} />
                    </EmphasisIcon>
                    <span className="text-sm font-semibold text-foreground">
                      Mi Perfil
                    </span>
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <EmphasisIcon tone="primary" size="sm" className="!rounded-md">
                      <Settings size={16} />
                    </EmphasisIcon>
                    <span className="text-sm font-semibold text-foreground">
                      Configuración
                    </span>
                  </button>

                  <ThemeModeMenuItem />
                </div>

                <div className="mx-2 my-2 h-px bg-border" />

                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    <EmphasisIcon tone="danger" size="sm" className="!rounded-md">
                      <LogOut size={16} />
                    </EmphasisIcon>
                  </div>
                  <span className="text-sm font-semibold text-red-600 group-hover:text-red-500 dark:text-red-400">
                    Cerrar Sesión
                  </span>
                </button>
              </Surface>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
