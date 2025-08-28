import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // evita cache en dev

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // 👈 await

  // Paso 1: traigo la orden (sin relaciones)
  const o = await prisma.orden.findUnique({
    where: { id },
    select: {
      id: true,
      estado: true,
      createdAt: true,
      updatedAt: true,
      mpPaymentId: true,
      juegoId: true,
      denominacionId: true,
      email: true,
      whatsapp: true,
    },
  });

  if (!o) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });

  // Paso 2: juego y denominación por separado (evita include mientras arreglamos tipos)
  const [juego, denominacion] = await Promise.all([
    prisma.juego.findUnique({ where: { id: o.juegoId }, select: { nombre: true } }),
    prisma.denominacion.findUnique({ where: { id: o.denominacionId }, select: { etiqueta: true } }),
  ]);

  return NextResponse.json({
    orden: {
      id: o.id,
      estado: o.estado,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      mpPaymentId: o.mpPaymentId,
      juego: juego ?? undefined,
      denominacion: denominacion ?? undefined,
      email: o.email,
      whatsapp: o.whatsapp,
    },
  });
}
