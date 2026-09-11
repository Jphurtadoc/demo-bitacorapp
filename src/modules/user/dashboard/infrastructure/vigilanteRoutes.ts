import { getActiveShift } from '@/modules/user/dashboard/infrastructure/activeShiftStorage';
import { isShiftSetupComplete } from '@/types/workPost';

/** Select work post / start shift (vigilancia module). */
export const VIGILANTE_TURNO_PATH = '/vigilancia/turno';

/** Full list of assigned work posts. */
export const VIGILANTE_PUESTOS_PATH = '/vigilancia/turno/puestos';

/**
 * Builds the client overview path for an active shift.
 */
export function getVigilanteClienteOverviewPath(workPostId: string): string {
  return `/vigilancia/turno/cliente/${workPostId}/overview`;
}

/**
 * Builds the shift-start stepper path (inicio + consignas).
 */
export function getVigilanteClienteInicioPath(workPostId: string): string {
  return `/vigilancia/turno/cliente/${workPostId}/inicio`;
}

/**
 * Returns the vigilante logo/home route based on active shift progress.
 */
export function getVigilanteLogoPath(): string {
  const activeShift = getActiveShift();
  if (!activeShift) {
    return VIGILANTE_TURNO_PATH;
  }
  if (!isShiftSetupComplete(activeShift)) {
    return getVigilanteClienteInicioPath(activeShift.workPostId);
  }
  return getVigilanteClienteOverviewPath(activeShift.workPostId);
}
