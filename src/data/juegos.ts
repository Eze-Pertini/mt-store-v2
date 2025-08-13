// src/data/juegos.ts

export type Campo = {
  name: string;
  label: string;
  type: 'text' | 'password';
  required: boolean;
  help?: string;
};

export type Denominacion = {
  id: string;
  etiqueta: string;
  valor: number;
  activo: boolean;
  precioARS: number;
};

export type Juego = {
  id: string;
  slug: string;
  nombre: string;
  imagen: string;
  activo: boolean;
  instrucciones?: string;
  camposPrePago: Campo[];
  requierePostPago: boolean;
  camposPostPago?: Campo[];
  denominaciones: Denominacion[];
};

export const TRANSFER_DISCOUNT = 0.15; // 15%

export const juegos: Juego[] = [
  {
    id: 'free-fire',
    slug: 'free-fire',
    nombre: 'Free Fire',
    imagen: '/img/free-fire-logo.webp',
    activo: true,
    instrucciones: 'Solo necesitas tu Free Fire User ID. Entrega inmediata.',
    camposPrePago: [
      { name: 'playerId', label: 'ID del jugador', type: 'text', required: true },
    ],
    requierePostPago: false,
    denominaciones: [
      { id: 'ff-100', etiqueta: '100 diamantes', valor: 100, activo: true, precioARS: 4000 },
      { id: 'ff-300', etiqueta: '300 diamantes', valor: 300, activo: true, precioARS: 11000 },
    ],
  },
  {
    id: 'roblox',
    slug: 'roblox',
    nombre: 'Roblox',
    imagen: '/img/roblox-logo.webp',
    activo: true,
    instrucciones:
      'Tras pagar te pediremos la contraseña y posiblemente un código de verificación. Proceso guiado por WhatsApp.',
    camposPrePago: [
      { name: 'username', label: 'Usuario Roblox', type: 'text', required: true },
    ],
    requierePostPago: true,
    camposPostPago: [
      { name: 'password', label: 'Contraseña Roblox', type: 'password', required: true, help: 'Se solicitará post-pago en un enlace seguro.' },
      { name: 'verificationCode', label: 'Código de verificación', type: 'text', required: false },
    ],
    denominaciones: [
      { id: 'rbx-400', etiqueta: '400 Robux', valor: 400, activo: true, precioARS: 6500 },
      { id: 'rbx-800', etiqueta: '800 Robux', valor: 800, activo: true, precioARS: 11500 },
    ],
  },
];
