'use client';

import { useEffect, useMemo, useState } from 'react';

type OrdenDTO = {
  id: string;
  estado: 'CREADA'|'EN_PROCESO'|'PAGADA'|'ENTREGADA'|'CANCELADA';
  createdAt: string;
  updatedAt: string;
  juego?: { nombre: string };
  denominacion?: { etiqueta: string };
  mpPaymentId?: string | null;
};

function badgeColor(estado: OrdenDTO['estado']) {
  switch (estado) {
    case 'CREADA': return 'bg-gray-700';
    case 'EN_PROCESO': return 'bg-yellow-600';
    case 'PAGADA': return 'bg-green-600';
    case 'ENTREGADA': return 'bg-blue-600';
    case 'CANCELADA': return 'bg-red-600';
  }
}

export default function OrdenLive({ id }: { id: string }) {
  const [orden, setOrden] = useState<OrdenDTO | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(signal?: AbortSignal) {
    try {
      const r = await fetch(`/api/orden/${id}`, { cache: 'no-store', signal });
      if (!r.ok) throw new Error('not ok');
      const j = await r.json();
      setOrden(j.orden);
    } catch {
      if (!signal?.aborted) setOrden(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    const t = setInterval(() => load(ac.signal), 4000); // auto-refresh
    return () => {
      ac.abort();
      clearInterval(t);
    };
  }, [id]);

  const steps = useMemo(() => ([
    { key: 'CREADA',    label: 'Creada' },
    { key: 'PAGADA',    label: 'Pagada' },
    { key: 'ENTREGADA', label: 'Entregada' },
  ]), []);

  if (loading) return <div>Cargando…</div>;
  if (!orden) return <div className="text-red-400">Orden no encontrada.</div>;

  const isActive = (step: string) =>
    step === 'CREADA' ? true :
    step === 'PAGADA' ? ['PAGADA','ENTREGADA'].includes(orden.estado) :
    step === 'ENTREGADA' ? orden.estado === 'ENTREGADA' : false;

  return (
    <div className="grid gap-4">
      {/* Resumen */}
      <div className="rounded border border-white/10 p-4 bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted">Orden</div>
            <div className="font-mono text-sm">{orden.id}</div>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${badgeColor(orden.estado)}`}>
            {orden.estado}
          </span>
        </div>

        <div className="mt-3 text-sm">
          <div><b>Producto:</b> {orden.juego?.nombre ?? '-'} · {orden.denominacion?.etiqueta ?? '-'}</div>
          <div><b>Creada:</b> {new Date(orden.createdAt).toLocaleString()}</div>
          <div><b>Actualizada:</b> {new Date(orden.updatedAt).toLocaleString()}</div>
          <div><b>Pago MP:</b> {orden.mpPaymentId ?? '-'}</div>
        </div>
      </div>

      {/* Timeline simple */}
      <div className="rounded border border-white/10 p-4 bg-surface">
        <div className="mb-2 font-semibold">Progreso</div>
        <ol className="relative border-s border-white/10 ms-3 ps-4">
          {steps.map((s) => (
            <li key={s.key} className="mb-6">
              <span
                className={`absolute -start-1 top-1.5 h-2.5 w-2.5 rounded-full ${isActive(s.key) ? 'bg-brand' : 'bg-white/20'}`}
                aria-hidden
              />
              <div className={`text-sm ${isActive(s.key) ? '' : 'text-muted'}`}>{s.label}</div>
            </li>
          ))}
        </ol>
      </div>

      <a href="/" className="inline-block bg-brand text-black rounded px-4 py-2 text-sm">
        Volver al inicio
      </a>
    </div>
  );
}
