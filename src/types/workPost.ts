/**
 * Site category used to pick the work-post icon.
 */
export type WorkPostTipo = 'industrial' | 'comercial' | 'residencial';

/**
 * Work post (puesto) a vigilante can start a shift at.
 */
export interface WorkPost {
  readonly id: string;
  readonly nombre: string;
  readonly direccion: string;
  readonly tipo: WorkPostTipo;
}

/**
 * Step 1 form: inicio de turno.
 */
export interface ShiftInicioForm {
  horaLlegada: string;
  estadoPuesto: '' | 'normal' | 'novedad';
  observaciones: string;
  equipoRecibido: string;
}

/**
 * Step 2 form: consignas del turno.
 */
export interface ShiftConsignasForm {
  consignasLeidas: boolean;
  novedadesPendientes: string;
  instrucciones: string;
  confirmacion: boolean;
}

/**
 * Active shift selected by the vigilante for the current session.
 */
export interface ActiveShift {
  readonly workPostId: string;
  readonly workPostNombre: string;
  readonly startedAt: string;
  readonly inicioCompleted: boolean;
  readonly consignasCompleted: boolean;
  readonly inicio: ShiftInicioForm;
  readonly consignas: ShiftConsignasForm;
}

/**
 * Creates empty draft forms for a newly started shift.
 */
export function createEmptyInicioForm(): ShiftInicioForm {
  return {
    horaLlegada: '',
    estadoPuesto: '',
    observaciones: '',
    equipoRecibido: '',
  };
}

/**
 * Creates empty consignas form draft.
 */
export function createEmptyConsignasForm(): ShiftConsignasForm {
  return {
    consignasLeidas: false,
    novedadesPendientes: '',
    instrucciones: '',
    confirmacion: false,
  };
}

/**
 * Builds a new active shift draft for a work post.
 */
export function createActiveShiftDraft(post: WorkPost): ActiveShift {
  return {
    workPostId: post.id,
    workPostNombre: post.nombre,
    startedAt: new Date().toISOString(),
    inicioCompleted: false,
    consignasCompleted: false,
    inicio: createEmptyInicioForm(),
    consignas: createEmptyConsignasForm(),
  };
}

/**
 * Once the first form is completed, the vigilante cannot abandon the shift.
 */
export function canAbandonActiveShift(shift: ActiveShift): boolean {
  return !shift.inicioCompleted;
}

/**
 * Both stepper forms are completed and the shift is ready for overview.
 */
export function isShiftSetupComplete(shift: ActiveShift): boolean {
  return shift.inicioCompleted && shift.consignasCompleted;
}
