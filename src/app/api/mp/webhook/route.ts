// src/app/api/mp/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, tplPagoRecibido } from '@/lib/email';

const MP_API = 'https://api.mercadopago.com';
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

async function mpGet(path: string) {
  const r = await fetch(`${MP_API}${path}`, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    cache: 'no-store',
  });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    throw Object.assign(new Error(t || `MP GET ${path} ${r.status}`), {
      status: r.status,
      body: t,
    });
  }
  return r.json();
}

function getIdAndTopic(req: NextRequest) {
  const url = new URL(req.url);
  const topic = url.searchParams.get('topic') || url.searchParams.get('type') || '';
  const id = url.searchParams.get('id') || url.searchParams.get('data.id') || '';
  return { topic, id };
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text().catch(() => '');
    if (raw) {
      console.log('=== MP WEBHOOK RAW ===\n' + raw + '\n======================');
    }

    const { topic, id } = getIdAndTopic(req);

    // A) payment: confirmar estado (con reintentos por indexación)
    if (topic === 'payment') {
      const paymentId = id;
      let data: any = null;
      const retries = [600, 1200, 1800, 2400, 3000]; // ms

      for (let i = 0; i <= retries.length; i++) {
        try {
          data = await mpGet(`/v1/payments/${paymentId}`);
          break;
        } catch (e: any) {
          if (e.status === 404 && i < retries.length) {
            console.log(`[WEBHOOK] payment ${paymentId} aún no indexado, retry en ${retries[i]}ms`);
            await new Promise((r) => setTimeout(r, retries[i]));
            continue;
          }
          console.log('[WEBHOOK] payment fetch soft-fail:', e?.status, e?.message);
          return NextResponse.json({ ok: true });
        }
      }

      if (!data) return NextResponse.json({ ok: true });

      const status = data.status; // approved | rejected | pending ...
      const externalRef = data.external_reference || data.metadata?.ordenId;
      console.log(`[WEBHOOK] payment ${paymentId} status: ${status} external_ref: ${externalRef}`);

      // Idempotente: marcá PAGADA solo si aún no lo está
      if (externalRef && status === 'approved') {
        await prisma.orden.updateMany({
          where: { id: externalRef, estado: { not: 'PAGADA' } },
          data: { estado: 'PAGADA', mpPaymentId: String(paymentId) },
        });
      }

      return NextResponse.json({ ok: true });
    }

    // B) merchant_order: fuente de verdad para cerrar la orden
    if (topic === 'merchant_order') {
      const moId = id;
      const mo = await mpGet(`/merchant_orders/${moId}`);

      const externalRef: string | undefined = mo.external_reference;
      const payments: any[] = mo.payments || [];
      const approved = payments.find((p) => p.status === 'approved');
      const paid = Boolean(approved);

      if (!externalRef) {
        console.log(`[WEBHOOK] merchant_order ${moId} sin external_reference`);
        return NextResponse.json({ ok: true });
      }

      if (!paid) {
        console.log(`[WEBHOOK] merchant_order ${moId} sin pagos aprobados aún`);
        return NextResponse.json({ ok: true });
      }

      // Idempotente: solo cambia a PAGADA si no lo estaba
      const result = await prisma.orden.updateMany({
        where: { id: externalRef, estado: { not: 'PAGADA' } },
        data: {
          estado: 'PAGADA',
          mpPaymentId: String(approved?.id ?? ''),
        },
      });

      if (result.count > 0) {
        console.log(
          `[WEBHOOK] merchant_order ${moId} cerró orden ${externalRef} como PAGADA (primer cambio)`
        );

        // Cargamos datos para el email
        const orden = await prisma.orden.findUnique({ where: { id: externalRef } });
        if (orden) {
          // Enviar email (si falla, no rompemos el webhook)
          try {
            await sendEmail({
              to: orden.email,
              subject: 'MT Store · Pago recibido',
              html: tplPagoRecibido(orden.id, orden.whatsapp),
            });
          } catch (e) {
            console.error('[WEBHOOK] error enviando email pago recibido:', e);
          }
        }
      } else {
        // Ya estaba PAGADA (reintento)
        console.log(
          `[WEBHOOK] merchant_order ${moId} ya estaba PAGADA para orden ${externalRef}, no se reenvía email`
        );
      }

      return NextResponse.json({ ok: true });
    }

    // C) Otros tópicos: OK sin acción
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log('[WEBHOOK] soft error:', e);
    // Siempre 200 para que MP reintente si corresponde
    return NextResponse.json({ ok: true });
  }
}
