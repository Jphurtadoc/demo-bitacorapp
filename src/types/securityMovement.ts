export type SecuritySubjectType = 'persona' | 'vehiculo';
export type SecurityMovementKind = 'ingreso' | 'salida';

export interface SecurityMovement {
  id: string;
  subjectType: SecuritySubjectType;
  movement: SecurityMovementKind;
  subjectId: string;
  subjectName: string;
  subjectDetail: string;
  photo: string;
  documento: string;
  cliente: string;
  observacion: string;
  registeredAt: string;
}
