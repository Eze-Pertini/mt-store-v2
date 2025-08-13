'use client';

import { useMemo, useState } from 'react';
import { Juego } from '@/data/juegos';
import { crearOrden } from '@/actions/crearOrden';
import { TRANSFER_DISCOUNT } from '@/data/juegos';
import PaymentMethodsBar from './PaymentMethodsBar';

type Props = {
  juego: Juego;
};

export default function ProductoForm({ juego }: Props) {
  const [denId, setDenId] = useState<string>('');
  const [payByTransfer, setPayByTransfer] = useState(false);
  const [qty, setQty] = useState(1);

  const denominacionesActivas = useMemo(
    () => juego.denominaciones.filter((d) => d.activo),
    [juego.denominaciones]
  );

  const selected = useMemo(
    () => denominacionesActivas.find((d) => d.id === denId) ?? null,
    [denId, denominacionesActivas]
  );

  const unitPrice = selected?.precioARS ?? 0;
  const subtotal = unitPrice * qty;
  const transferDiscount = payByTransfer ? Math.round(subtotal * TRANSFER_DISCOUNT) : 0;
  const total = subtotal - transferDiscount;

  return (
    <form action={crearOrden} className="grid gap-5">
      {/* Hidden fields */}
      <input type="hidden" name="juegoId" value={juego.id} />
      <input type="hidden" name="aplicaTransfer" value={payByTransfer ? '1' : '0'} />
      <input type="hidden" name="cantidad" value={qty} />

      {/* Campos pre-pago */}
      <div className="grid gap-3">
        {juego.camposPrePago.map((campo) => (
          <div key={campo.name}>
            <label className="block text-sm mb-1">{campo.label}</label>
            <input
              type={campo.type}
              name={campo.name}
              required={campo.required}
              className="w-full rounded border border-white/10 bg-surface px-3 py-2"
            />
            {campo.help && <p className="text-xs text-muted mt-1">{campo.help}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded border border-white/10 bg-surface px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            required
            placeholder="+54 9 ..."
            className="w-full rounded border border-white/10 bg-surface px-3 py-2"
          />
        </div>
      </div>

      {/* Denominaciones como botones */}
      <div className="grid gap-2">
        <span className="text-sm text-muted">Elegí el pack</span>

        <fieldset className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {denominacionesActivas.map((d) => {
            const active = d.id === denId;

            const base =
              'relative text-left rounded px-4 py-3 transition outline-none select-none';
            const state = active
              ? 'bg-brand text-black border border-brand shadow-[0_0_0_3px_rgba(0,174,239,0.25)]'
              : 'border border-brand/40 hover:border-brand hover:bg-white/5 text-white';

            return (
              <button
                type="button"
                key={d.id}
                role="radio"
                aria-pressed={active}
                aria-checked={active}
                onClick={() => setDenId(d.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setDenId(d.id)}
                className={`${base} ${state}`}
              >
                {/* Badge descuento si está activo y con transferencia */}
                {active && payByTransfer && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow whitespace-nowrap">
                    -15%{' '}
                    {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
                      d.precioARS * (1 - TRANSFER_DISCOUNT)
                    )}
                  </span>
                )}

                <div className="text-sm font-semibold">{d.etiqueta}</div>
                <div className={`text-xs mt-1 ${active ? 'text-black/80' : 'text-muted'}`}>
                  {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
                    d.precioARS
                  )}
                </div>
              </button>
            );
          })}
        </fieldset>

        {/* Denominación elegida al enviar */}
        <input type="hidden" name="denominacionId" value={denId} />
      </div>

      {/* Cantidad */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Cantidad</span>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-8 w-8 rounded border border-white/10 hover:bg-white/5"
            aria-label="Menos"
          >
            –
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="h-8 w-8 rounded border border-white/10 hover:bg-white/5"
            aria-label="Más"
          >
            +
          </button>
        </div>
      </div>

      {/* Descuento por transferencia */}
      <div className="rounded border border-white/10 p-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={payByTransfer}
            onChange={(e) => setPayByTransfer(e.target.checked)}
            className="accent-brand"
          />
          <span>
            <strong>{Math.round(TRANSFER_DISCOUNT * 100)}% OFF</strong> pagando por transferencia
          </span>
        </label>

        <div className="mt-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-green-400">
            <span>Descuento transferencia</span>
            <span>
              –
              {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
                transferDiscount
              )}
            </span>
          </div>
          <div className="flex justify-between mt-1 font-semibold">
            <span>Total</span>
            <span>
              {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={!denId}
        className="w-full bg-brand hover:bg-brand-dark text-black py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Comprar ahora
      </button>

      {/* Métodos de pago */}
      <PaymentMethodsBar />

      {/* Instrucciones */}
      {juego.instrucciones && (
        <div className="mt-2 rounded border border-white/10 p-4 bg-surface">
          <h4 className="font-semibold mb-1">Instrucciones</h4>
          <p className="text-sm text-muted">{juego.instrucciones}</p>
        </div>
      )}
    </form>
  );
}
