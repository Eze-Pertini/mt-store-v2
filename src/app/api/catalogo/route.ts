import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DenominacionDTO = {
  id: string;
  etiqueta: string;
  valor: number;
  activo: boolean;
  precioARS: number;
};

type JuegoDTO = {
  id: string;
  slug: string;
  nombre: string;
  imagen: string;
  instrucciones?: string | null;
  camposPrePago: unknown;
  requierePostPago: boolean;
  camposPostPago?: unknown;
  denominaciones: DenominacionDTO[];
};

export async function GET() {
  const juegos = await prisma.juego.findMany({
    where: { activo: true },
    include: {
      denominaciones: {
        where: { activo: true },
        include: {
          precios: { where: { activo: true, pais: 'AR' } },
        },
      },
    },
    orderBy: { nombre: 'asc' },
  });

  // 👇 Tipos derivados del valor real (no dependen de Prisma.*GetPayload)
  type JuegoRow = (typeof juegos)[number];
  type DenRow = JuegoRow['denominaciones'][number];

  const data: JuegoDTO[] = (juegos as JuegoRow[]).map((j: JuegoRow) => ({
    id: j.id,
    slug: j.slug,
    nombre: j.nombre,
    imagen: j.imagen,
    instrucciones: j.instrucciones,
    camposPrePago: j.camposPrePago,
    requierePostPago: j.requierePostPago,
    camposPostPago: j.camposPostPago,
    denominaciones: (j.denominaciones as DenRow[]).map(
      (d: DenRow): DenominacionDTO => ({
        id: d.id,
        etiqueta: d.etiqueta,
        valor: d.valor,
        activo: d.activo,
        // recordá que guardamos centavos en la BD
        precioARS: d.precios[0] ? d.precios[0].precioFinalCents / 100 : 0,
      })
    ),
  }));

  return NextResponse.json({ juegos: data }, { status: 200 });
}
