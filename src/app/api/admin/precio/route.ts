import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidateTag } from 'next/cache';

// Prisma singleton (importante en dev para evitar múltiples conexiones)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// --- Helpers ---
function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
function badRequest(msg = 'Bad Request') {
  return NextResponse.json({ error: msg }, { status: 400 });
}
function ok<T extends Record<string, unknown>>(payload?: T) {
  try { revalidateTag('catalogo'); } catch {}
  return NextResponse.json(payload ? { ok: true, ...payload } : { ok: true }, { status: 200 });
}

function assertAuth(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return ADMIN_TOKEN && token === ADMIN_TOKEN;
}

// --- Types (opcionales para claridad) ---
type AdminPrecioBody = {
  precioId?: string;
  denominacionId?: string;
  pais?: string;    // ej. "AR"
  moneda?: string;  // ej. "ARS"
  precioFinal?: number; // en pesos
  activo?: boolean;
};

export async function POST(req: NextRequest) {
  if (!assertAuth(req)) return unauthorized();

  let body: AdminPrecioBody;
  try {
    body = (await req.json()) as AdminPrecioBody;
  } catch {
    return badRequest('JSON inválido');
  }

  // Normalizamos y validamos precio
  const hasPrecio = body.precioFinal !== undefined && body.precioFinal !== null;
  const precioEnPesos = Number(body.precioFinal);
  const isValidPrecio = hasPrecio && Number.isFinite(precioEnPesos);

  // --- Caso A: update por precioId ---
  if (body.precioId) {
    if (!isValidPrecio && body.activo === undefined) {
      return badRequest('Falta precioFinal o activo para actualizar');
    }
    const data: { precioFinalCents?: number; activo?: boolean } = {};
    if (isValidPrecio) data.precioFinalCents = Math.round(precioEnPesos * 100);
    if (body.activo !== undefined) data.activo = body.activo;

    try {
      const update = await prisma.precio.update({
        where: { id: body.precioId },
        data,
      });
      return ok({ update });
    } catch (e) {
      return badRequest('No se pudo actualizar el precioId especificado');
    }
  }

  // --- Caso B: upsert por denominacionId + pais + moneda ---
  if (body.denominacionId && body.pais && body.moneda) {
    if (!isValidPrecio) return badRequest('precioFinal requerido (en pesos)');
    const precioFinalCents = Math.round(precioEnPesos * 100);

    // ¿Existe ya un precio para esa combinación?
    const exist = await prisma.precio.findFirst({
      where: {
        denominacionId: body.denominacionId,
        pais: body.pais,
        moneda: body.moneda,
      },
    });

    if (exist) {
      const update = await prisma.precio.update({
        where: { id: exist.id },
        data: { precioFinalCents, activo: body.activo ?? true },
      });
      return ok({ update });
    } else {
      const create = await prisma.precio.create({
        data: {
          denominacionId: body.denominacionId,
          pais: body.pais,
          moneda: body.moneda,
          precioFinalCents,
          activo: body.activo ?? true,
        },
      });
      return ok({ create });
    }
  }

  return badRequest('Debes enviar precioId o (denominacionId + pais + moneda)');
}
