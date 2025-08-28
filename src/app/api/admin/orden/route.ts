// src/app/api/admin/orden/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, tplOrdenEntregada } from '@/lib/email';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (auth.replace('Bearer ', '') !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  // { id, estado?, nota?, camposPostPago? }
  const { id, estado, nota, camposPostPago } = body as {
    id: string;
    estado?: string;
    nota?: string;
    camposPostPago?: unknown;
  };

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // Traemos el estado previo para decidir el mail
  const prev = await prisma.orden.findUnique({ where: { id } });
  if (!prev) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
  }

  const data: any = {};
  if (typeof estado === 'string') data.estado = estado;
  if (typeof nota === 'string') data.nota = nota;
  if (typeof camposPostPago !== 'undefined') data.camposPostPago = camposPostPago as any;

  const upd = await prisma.orden.update({ where: { id }, data });

  // Enviar mail solo si pasamos a ENTREGADA y antes no lo estaba
  if (estado === 'ENTREGADA' && prev.estado !== 'ENTREGADA') {
    try {
      await sendEmail({
        to: upd.email,
        subject: 'MT Store · Orden entregada',
        html: tplOrdenEntregada(upd.id),
      });
    } catch (e) {
      console.error('[ADMIN/orden] error enviando email ENTREGADA:', e);
    }
  }

  return NextResponse.json({ ok: true, orden: upd });
}
