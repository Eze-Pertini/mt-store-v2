// src/data/ordenes.ts

export type Orden = {
  id: string;
  juegoId: string;
  datos: Record<string, any>;
  estado: 'CREADA' | 'PAGADA' | 'ENTREGADA';
  creadaEn: string;
};

export const ordenes: Orden[] = [];
