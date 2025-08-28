'use client';

import { useEffect, useState } from 'react';

type Orden = {
  id: string; estado: string; createdAt: string; updatedAt: string;
  juegoId: string; denominacionId: string; email: string; whatsapp: string;
  mpPaymentId?: string | null; mpPreferenceId?: string | null;
  camposPrePago?: any;
};

export default function AdminOrdenesPage() {
  const [rows, setRows] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN || '';

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/ordenes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const j = await r.json();
    setRows(j.ordenes || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function marcarEntregada(id: string) {
    setSaving(id);
    await fetch('/api/admin/orden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, estado: 'ENTREGADA' })
    });
    await load();
    setSaving(null);
  }

  if (loading) return <div className="p-6">Cargando…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Órdenes</h1>
      <div className="grid gap-3">
        {rows.map(o => (
          <div key={o.id} className="border border-white/10 rounded p-3 flex items-center justify-between">
            <div className="text-sm">
              <div className="font-mono">{o.id}</div>
              <div>{o.email} · {o.whatsapp}</div>
              <div>Estado: <b>{o.estado}</b> · Pago: {o.mpPaymentId || '-'}</div>
              <div className="text-xs text-muted">Creada: {new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              {o.estado !== 'ENTREGADA' && (
                <button
                  onClick={() => marcarEntregada(o.id)}
                  disabled={saving === o.id}
                  className="px-3 py-1 rounded bg-brand text-black hover:bg-brand-dark disabled:opacity-50"
                >
                  {saving === o.id ? 'Guardando…' : 'Marcar ENTREGADA'}
                </button>
              )}
              <button onClick={load} className="px-3 py-1 rounded border border-white/10">Actualizar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
