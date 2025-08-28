import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN!;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (auth.replace('Bearer ', '') !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ordenes = await prisma.orden.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true, estado: true, createdAt: true, updatedAt: true,
      juegoId: true, denominacionId: true, email: true, whatsapp: true,
      mpPaymentId: true, mpPreferenceId: true, camposPrePago: true,
    }
  });
  return NextResponse.json({ ordenes });
}
