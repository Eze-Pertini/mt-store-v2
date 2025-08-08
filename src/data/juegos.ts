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
  camposPrePago: Campo[];
  requierePostPago: boolean;
  camposPostPago?: Campo[];
  denominaciones: Denominacion[];
};

export const juegos: Juego[] = [
  {
    id: 'free-fire',
    slug: 'free-fire',
    nombre: 'Free Fire',
    imagen: '/img/free-fire.jpg',
    activo: true,
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
    imagen: '/img/roblox.jpg',
    activo: true,
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
