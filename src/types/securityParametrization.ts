export type WeekDay = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

export interface SecurityRoundShift {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
}

export interface SecurityRound {
  id: string;
  nombre: string;
  cliente: string;
  sede: string;
  puntos: string[];
  turnos: SecurityRoundShift[];
  activa: boolean;
}

export interface SecurityAssignment {
  id: string;
  guardaId: string;
  rondaId: string;
  turnoId: string;
  dias: WeekDay[];
  activa: boolean;
}
