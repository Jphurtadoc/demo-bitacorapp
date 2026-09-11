import type { ActiveShift, ShiftConsignasForm, ShiftInicioForm } from '@/types/workPost';
import {
  createEmptyConsignasForm,
  createEmptyInicioForm,
} from '@/types/workPost';

const ACTIVE_SHIFT_KEY = 'bitacorapp_active_shift';

/**
 * Normalizes legacy session payloads to the current ActiveShift shape.
 */
function normalizeActiveShift(raw: Partial<ActiveShift>): ActiveShift | null {
  if (!raw.workPostId || !raw.workPostNombre || !raw.startedAt) {
    return null;
  }
  return {
    workPostId: raw.workPostId,
    workPostNombre: raw.workPostNombre,
    startedAt: raw.startedAt,
    inicioCompleted: Boolean(raw.inicioCompleted),
    consignasCompleted: Boolean(raw.consignasCompleted),
    inicio: {
      ...createEmptyInicioForm(),
      ...(raw.inicio as Partial<ShiftInicioForm> | undefined),
    },
    consignas: {
      ...createEmptyConsignasForm(),
      ...(raw.consignas as Partial<ShiftConsignasForm> | undefined),
    },
  };
}

/**
 * Reads the active shift for the current browser session.
 */
export function getActiveShift(): ActiveShift | null {
  const raw = sessionStorage.getItem(ACTIVE_SHIFT_KEY);
  if (!raw) {
    return null;
  }
  try {
    return normalizeActiveShift(JSON.parse(raw) as Partial<ActiveShift>);
  } catch {
    sessionStorage.removeItem(ACTIVE_SHIFT_KEY);
    return null;
  }
}

/**
 * Persists the active shift for the current browser session.
 */
export function setActiveShift(shift: ActiveShift): void {
  sessionStorage.setItem(ACTIVE_SHIFT_KEY, JSON.stringify(shift));
}

/**
 * Clears the active shift from the current browser session.
 */
export function clearActiveShift(): void {
  sessionStorage.removeItem(ACTIVE_SHIFT_KEY);
}
