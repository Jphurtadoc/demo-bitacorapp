import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Surface } from "@/components/UI/surface";
import { EmphasisIcon } from "@/components/UI/emphasis";
import { ThemeModeMenuItem } from "@/components/UI/theme";
import NotificationCenter from "@/components/shared/NotificationCenter";
import { useTheme } from "@/context/ThemeContext";
import type { UserRole } from "@/core/domain/entities/User";
import {
  clearStoredUser,
  getStoredUser,
} from "@/modules/auth/login/infrastructure/AuthRepository";
import { getVigilanteLogoPath } from "@/modules/user/dashboard/infrastructure/vigilanteRoutes";

interface HeaderProps {
  sidebarOffset?: string;
  isMobileNavOpen?: boolean;
  onMobileMenuToggle?: () => void;
  /** When true, hides search/org chrome and shows brand favicon instead. */
  hideChrome?: boolean;
}

const ROLE_LABELS: Record<UserRole, string> = {
  root: "Root",
  admin: "Administrador",
  supervisor: "Supervisor",
  vigilante: "Vigilante",
};

const Header: React.FC<HeaderProps> = ({
  sidebarOffset = "72px",
  isMobileNavOpen = false,
  onMobileMenuToggle,
  hideChrome = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const currentUser = getStoredUser();
  const isRoot = currentUser?.role === "root";
  const nameWords =
    currentUser?.name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const avatarInitials =
    nameWords
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "U";
  const displayName =
    nameWords.length >= 2
      ? `${nameWords[0]} ${nameWords[1]}`
      : currentUser?.name?.trim() || "Usuario";
  const roleLabel =
    (currentUser?.role && ROLE_LABELS[currentUser.role]) || "—";
  const sessionEmail = currentUser?.email?.trim() || "—";
  const orgLabel = currentUser?.tenant?.trim() || "Sistema";
  const brandFaviconSrc = isDark ? "/favicon_secondary.svg" : "/favicon.svg";

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
    clearStoredUser();
    navigate("/login");
  };

  const handleBrandClick = () => {
    if (hideChrome || currentUser?.role === "vigilante") {
      navigate(getVigilanteLogoPath());
      return;
    }
    navigate("/dashboard");
  };

  return (
    <header
      className="fixed top-0 z-50 flex h-16 bg-background transition-all duration-300 ease-in-out"
      style={{ left: sidebarOffset, width: `calc(100% - ${sidebarOffset})` }}
    >
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 pr-4 md:pr-6 pl-3 md:pl-4">
        <div className="flex min-w-0 items-center">
          {hideChrome ? (
            <button
              type="button"
              className="rounded-lg p-1 transition-colors hover:bg-muted"
              aria-label="Ir al inicio"
              onClick={handleBrandClick}
            >
              <img
                src={brandFaviconSrc}
                alt="Bitacorapp"
                className="h-14 w-14 object-contain"
              />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="rounded-lg p-1 transition-colors hover:bg-muted md:hidden"
                aria-label="Ir al dashboard"
                onClick={handleBrandClick}
              >
                <img
                  src={brandFaviconSrc}
                  alt="Bitacorapp"
                  className="h-14 w-14 object-contain"
                />
              </button>
              {!isRoot && (
                <div className="hidden md:block">
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
                        {orgLabel}
                      </span>
                      <ChevronDown size={13} className="text-subtle" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!hideChrome && (
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
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-0.5 md:gap-1">
            <NotificationCenter />
            <button
              type="button"
              className="hidden rounded-full p-1.5 text-subtle transition-colors hover:bg-muted sm:block"
              aria-label="Ayuda"
            >
              <HelpCircle size={18} />
            </button>
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" />

          {!hideChrome && onMobileMenuToggle && (
            <button
              type="button"
              className="rounded-full p-1.5 text-subtle transition-colors hover:bg-muted md:hidden"
              aria-label={isMobileNavOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileNavOpen}
              onClick={onMobileMenuToggle}
            >
              {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="group flex cursor-pointer items-center gap-2.5 rounded-full p-1 pr-2 transition-colors hover:bg-muted md:gap-3"
              aria-label={`Menú de usuario: ${displayName}, ${roleLabel}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary text-sm font-semibold text-[#ffffff] shadow-sm"
                aria-hidden
              >
                {avatarInitials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold leading-tight text-foreground">
                  {displayName}
                </p>
                <p className="text-[11px] font-medium text-subtle">
                  {roleLabel}
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
                    {sessionEmail}
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
                    <EmphasisIcon tone="primary" size="sm" className="!rounded-md">
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
