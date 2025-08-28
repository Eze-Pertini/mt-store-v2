// src/lib/catalogo.ts
import { prisma } from './prisma';


export async function getCatalogoFromDB() {
  const juegos = await prisma.juego.findMany({
    where: { activo: true },
    include: {
      denominaciones: {
        where: { activo: true },
        include: { precios: { where: { activo: true, pais: 'AR' } } },
      },
    },
    orderBy: { nombre: 'asc' },
  });

  return juegos.map((j) => ({
    ...j,
    denominaciones: j.denominaciones.map((d) => ({
      id: d.id,
      etiqueta: d.etiqueta,
      valor: d.valor,
      activo: d.activo,
      // Convertimos centavos → ARS
      precioARS: d.precios[0] ? d.precios[0].precioFinalCents / 100 : 0,
    })),
  }));
}





export async function getJuegoBySlugFromDB(slug: string) {
  const j = await prisma.juego.findFirst({
    where: { slug, activo: true },
    include: {
      denominaciones: {
        where: { activo: true },
        include: { precios: { where: { activo: true, pais: 'AR' } } },
      },
    },
  });
  if (!j) return null;

  return {
    ...j,
    denominaciones: j.denominaciones.map((d) => ({
      id: d.id,
      etiqueta: d.etiqueta,
      valor: d.valor,
      activo: d.activo,
      precioARS: d.precios[0] ? d.precios[0].precioFinalCents / 100 : 0,
    })),
  };
}
