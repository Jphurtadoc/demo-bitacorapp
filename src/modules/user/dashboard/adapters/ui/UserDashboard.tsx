import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getStoredUser } from '@/modules/auth/login/infrastructure/AuthRepository';
import { getVigilanteWorkPosts } from '@/data/vigilanteWorkPosts';
import {
  getActiveShift,
  setActiveShift,
} from '@/modules/user/dashboard/infrastructure/activeShiftStorage';
import {
  getVigilanteClienteInicioPath,
  VIGILANTE_PUESTOS_PATH,
} from '@/modules/user/dashboard/infrastructure/vigilanteRoutes';
import { WorkPostCard } from './WorkPostCard';
import { createActiveShiftDraft, type ActiveShift, type WorkPost } from '@/types/workPost';

const HOME_PREVIEW_LIMIT = 3;

/** Subtle dotted field using theme text-muted. */
const DOT_PATTERN_STYLE: React.CSSProperties = {
  backgroundImage:
    'radial-gradient(circle, color-mix(in oklab, var(--color-text-muted) 30%, transparent) 1.1px, transparent 1.1px)',
  backgroundSize: '18px 18px',
};

/**
 * Vigilante landing: welcome, search, and shift-start preview list.
 */
const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const workPosts = useMemo(
    () => (currentUser ? getVigilanteWorkPosts(currentUser.id) : []),
    [currentUser],
  );
  const [query, setQuery] = useState('');
  const [activeShift, setActiveShiftState] = useState<ActiveShift | null>(() =>
    getActiveShift(),
  );

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

  const previewPosts = filteredPosts.slice(0, HOME_PREVIEW_LIMIT);

  const handleSearch = () => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
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

  const firstName = currentUser?.name?.split(' ')[0] ?? 'vigilante';

  return (
    <DashboardLayout>
      <div className="page-shell relative flex min-h-[calc(100vh-92px)] items-center justify-center overflow-hidden rounded-2xl bg-muted/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-35"
          style={DOT_PATTERN_STYLE}
        />

        <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8 py-6 text-center">
          <header className="mx-auto max-w-xl space-y-2" aria-label="Bienvenida">
            <p className="text-base font-medium capitalize text-subtle">{today}</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              ¡Hola, {firstName}!
            </h1>
            <p className="text-base text-subtle sm:text-lg">
              {activeShift
                ? `Turno activo en ${activeShift.workPostNombre}.`
                : 'Selecciona el puesto de trabajo donde iniciarás tu turno hoy.'}
            </p>
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

          <section className="space-y-4 text-left" aria-label="Puestos de trabajo asignados">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Tus puestos de trabajo</h2>
              <p className="text-sm text-subtle">
                {filteredPosts.length} puesto
                {filteredPosts.length === 1 ? '' : 's'} asignado
                {filteredPosts.length === 1 ? '' : 's'}
              </p>
            </div>

            {previewPosts.length === 0 ? (
              <p className="py-8 text-center text-sm text-subtle">
                No hay puestos que coincidan con tu búsqueda.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {previewPosts.map((post) => (
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

            <div className="pt-1 text-center">
              <Link
                to={VIGILANTE_PUESTOS_PATH}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Ver todos
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
