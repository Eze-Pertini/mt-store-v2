'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getPublicBaseUrl, getServerBaseUrl } from '@/lib/url';
import { Prisma } from '@prisma/client';

const CrearOrdenSchema = z.object({
  juegoId: z.string().min(1),
  denominacionId: z.string().min(1),
  cantidad: z.coerce.number().int().min(1).default(1),
  aplicaTransfer: z.enum(['0', '1']).default('0'),
  email: z.string().email(),
  whatsapp: z.string().min(5),
}).passthrough();

export async function crearOrden(formData: FormData) {
  // 1) Validaciones & datos BD
  const raw = Object.fromEntries(formData.entries());
  const parsed = CrearOrdenSchema.parse(raw);

  const den = await prisma.denominacion.findFirst({
    where: { id: parsed.denominacionId, activo: true, juegoId: parsed.juegoId },
    include: { juego: true, precios: { where: { pais: 'AR', activo: true } } },
  });
  if (!den) throw new Error('Denominación no disponible');

  const unitCents = den.precios[0]?.precioFinalCents ?? 0;
  const qty = Math.max(1, Math.floor(parsed.cantidad));
  const subtotalCents = unitCents * qty;

  const TRANSFER_DISCOUNT = 0.15;
  const applyTransfer = parsed.aplicaTransfer === '1';
  const discountCents = applyTransfer ? Math.round(subtotalCents * TRANSFER_DISCOUNT) : 0;
  const totalCents = Math.max(0, subtotalCents - discountCents);

  if (totalCents <= 0) {
    throw new Error('El total debe ser mayor a $0. Verificá el precio de la denominación.');
  }

  // 2) Crear orden CREADA
  const extras: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!['juegoId', 'denominacionId', 'cantidad', 'aplicaTransfer', 'email', 'whatsapp'].includes(k)) {
      extras[k] = v;
    }
  }

  const orden = await prisma.orden.create({
    data: {
      pais: 'AR',
      juegoId: parsed.juegoId,
      denominacionId: parsed.denominacionId,
      email: parsed.email,
      whatsapp: parsed.whatsapp,
      camposPrePago: (Object.keys(extras).length ? extras : undefined) as Prisma.InputJsonValue,
      estado: 'CREADA',
    },
  });

  // 3) Base URL robusta (prioriza env; luego host del request)
  const serverBase = await getServerBaseUrl(); // 👈 await (Next 15)
  const base =
    getPublicBaseUrl() ||            // NGROK/DOMINIO si está en .env
    serverBase ||                    // si no, host de la request
    'http://localhost:3000';

  if (!/^https?:\/\//i.test(base)) {
    throw new Error(`Base URL inválida: "${base}".`);
  }

  // util para URLs absolutas
  const url = (path: string) => new URL(path, base).toString();

  // detectar si la base es localhost
  const isLocal = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/i.test(base);

  if (process.env.NODE_ENV === 'development') {
    console.log('[MP] base:', base);
  }

  // 4) LAZY import SDK v2 y crear preferencia
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error('Config: MP_ACCESS_TOKEN no definido');

  const { MercadoPagoConfig, Preference } = await import('mercadopago');
  const mp = new MercadoPagoConfig({ accessToken });
  const preferenceClient = new Preference(mp);

  const body: any = {
    external_reference: orden.id,
    items: [
      {
        id: den.id,
        title: `${den.juego.nombre} - ${den.etiqueta}`,
        quantity: qty,
        currency_id: 'ARS',
        unit_price: Number((totalCents / 100).toFixed(2)),
      },
    ],
    back_urls: {
      success: url(`/pago/exito?orden=${orden.id}`),
      failure: url(`/pago/error?orden=${orden.id}`),
      pending: url(`/pago/pending?orden=${orden.id}`),
    },
    notification_url: url('/api/mp/webhook'),
    metadata: {
      ordenId: orden.id,
      juegoId: parsed.juegoId,
      denominacionId: parsed.denominacionId,
      qty,
      applyTransfer,
      unitCents,
      subtotalCents,
      discountCents,
      totalCents,
    },
  };

  // 👉 Evitamos 'auto_return' en local (MP a veces rechaza localhost);
  // en ngrok/domino sí lo mandamos.
  if (!isLocal) {
    body.auto_return = 'approved';
  }

  let prefRes: any;
  try {
    prefRes = await preferenceClient.create({ body });
  } catch (e: any) {
    console.error('MP preference error:', e);
    const msg = e?.message || 'Error creando la preferencia';
    const cause = Array.isArray(e?.cause) ? ` (${e.cause.map((c: any) => c.description).join(', ')})` : '';
    throw new Error(`${msg}${cause}`);
  }

  const initPoint: string | undefined = prefRes?.init_point ?? prefRes?.sandbox_init_point;
  const preferenceId: string | undefined = prefRes?.id;

  if (!initPoint) {
    console.error('Preferencia sin init_point:', prefRes);
    throw new Error('No se pudo iniciar el checkout de pago (init_point vacío).');
  }

  if (preferenceId) {
    await prisma.orden.update({
      where: { id: orden.id },
      data: { mpPreferenceId: preferenceId },
    });
  }

  // 5) Redirigir al checkout
  redirect(initPoint);
}
