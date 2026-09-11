import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getStoredUser } from "@/modules/auth/login/infrastructure/AuthRepository";
import { getVigilanteWorkPosts } from "@/data/vigilanteWorkPosts";
import {
  getActiveShift,
  setActiveShift,
} from "@/modules/user/dashboard/infrastructure/activeShiftStorage";
import {
  getVigilanteClienteInicioPath,
  VIGILANTE_TURNO_PATH,
} from "@/modules/user/dashboard/infrastructure/vigilanteRoutes";
import { WorkPostCard } from "./WorkPostCard";
import { createActiveShiftDraft, type ActiveShift, type WorkPost } from "@/types/workPost";

const DOT_PATTERN_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, color-mix(in oklab, var(--color-text-muted) 30%, transparent) 1.1px, transparent 1.1px)",
  backgroundSize: "18px 18px",
};

/**
 * Full list of work posts assigned to the signed-in vigilante.
 */
const VigilanteWorkPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const workPosts = useMemo(
    () => (currentUser ? getVigilanteWorkPosts(currentUser.id) : []),
    [currentUser],
  );
  const [query, setQuery] = useState("");
  const [activeShift, setActiveShiftState] = useState<ActiveShift | null>(() =>
    getActiveShift(),
  );

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return workPosts;
    }
    return workPosts.filter(
      (post) =>
        post.nombre.toLowerCase().includes(normalized) ||
        post.direccion.toLowerCase().includes(normalized),
    );
  }, [query, workPosts]);

  const handleSearch = () => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleStartShift = (post: WorkPost) => {
    const nextShift = createActiveShiftDraft(post);
    setActiveShift(nextShift);
    setActiveShiftState(nextShift);
    navigate(getVigilanteClienteInicioPath(post.id));
  };

  return (
    <DashboardLayout>
      <div className="page-shell relative flex min-h-[calc(100vh-92px)] items-center justify-center overflow-hidden rounded-2xl bg-muted/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-35"
          style={DOT_PATTERN_STYLE}
        />

        <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8 py-6 text-center">
          <header className="space-y-3">
            <Link
              to={VIGILANTE_TURNO_PATH}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-subtle hover:text-foreground"
            >
              <ArrowLeft size={16} aria-hidden />
              Volver
            </Link>
            <div className="mx-auto max-w-xl">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Puestos asignados
              </h1>
              <p className="mt-1 text-base text-subtle">
                Todos los puestos de trabajo disponibles para iniciar turno.
              </p>
            </div>
          </header>

          <div className="mx-auto flex max-w-xl gap-2 text-left">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Buscar puesto de trabajo..."
                aria-label="Buscar puesto de trabajo"
                className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-border focus:bg-surface focus:ring-2 focus:ring-brand/10"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              <Search size={16} aria-hidden />
              Buscar
            </button>
          </div>

          <section
            className="space-y-4 text-left"
            aria-label="Lista completa de puestos"
          >
            <p className="text-center text-sm text-subtle">
              {filteredPosts.length} puesto
              {filteredPosts.length === 1 ? "" : "s"}
            </p>

            {filteredPosts.length === 0 ? (
              <p className="py-8 text-center text-sm text-subtle">
                No hay puestos que coincidan con tu búsqueda.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {filteredPosts.map((post) => (
                  <li key={post.id}>
                    <WorkPostCard
                      post={post}
                      isActive={activeShift?.workPostId === post.id}
                      onStartShift={handleStartShift}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VigilanteWorkPostsPage;
