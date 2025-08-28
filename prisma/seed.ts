import { PrismaClient } from '@prisma/client';
// ⚠️ IMPORTA tu data actual:
import { juegos } from '../src/data/juegos';

const prisma = new PrismaClient();

async function main() {
  // limpiar (opcional en dev)
  await prisma.precio.deleteMany();
  await prisma.denominacion.deleteMany();
  await prisma.juego.deleteMany();

  for (const j of juegos) {
    const juego = await prisma.juego.create({
      data: {
        slug: j.slug,
        nombre: j.nombre,
        imagen: j.imagen,
        activo: j.activo ?? true,
        instrucciones: j.instrucciones ?? null,
        camposPrePago: j.camposPrePago,
        requierePostPago: j.requierePostPago ?? false,
        camposPostPago: j.camposPostPago ?? null,
      },
    });

    for (const d of j.denominaciones.filter((x) => x.activo)) {
      const den = await prisma.denominacion.create({
        data: {
          juegoId: juego.id,
          etiqueta: d.etiqueta,
          valor: d.valor,
          activo: true,
        },
      });

      // Precio ARS actual desde tu data
      const precioFinalCents = Math.round((d.precioARS ?? 0) * 100);
      await prisma.precio.create({
        data: {
          denominacionId: den.id,
          pais: 'AR',
          moneda: 'ARS',
          precioFinalCents, // número
          activo: true,
        },
      });
    }
  }

  console.log('✅ Seed completo');
}

main().finally(() => prisma.$disconnect());
