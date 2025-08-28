'use client';

import { useEffect, useState } from 'react';

type Deno = { id: string; etiqueta: string; valor: number; precioARS: number; activo: boolean; nuevoPrecio?: number };
type Juego = {
  id: string; slug: string; nombre: string; imagen: string;
  denominaciones: Deno[];
};

const CLIENT_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? '';

export default function AdminCatalogoPage() {
  const [data, setData] = useState<Juego[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setErr(null);
    fetch('/api/catalogo', { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new Error(`GET /api/catalogo → ${r.status} ${await r.text()}`);
        return r.json();
      })
      .then((res) => setData(res.juegos))
      .catch((e) => setErr(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  async function savePrecio(denominacionId: string, precioARS: number) {
    try {
      setErr(null);
      setSavingId(denominacionId);

      if (!CLIENT_TOKEN) {
        throw new Error('Falta NEXT_PUBLIC_ADMIN_TOKEN en .env.local');
      }

      if (process.env.NODE_ENV === 'development') {
        // Para depurar: confirmar que armamos el header
        // (No imprime el token completo, solo longitud)
        console.debug('POST /api/admin/precio con Authorization Bearer (len):', CLIENT_TOKEN.length);
      }

      const res = await fetch('/api/admin/precio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLIENT_TOKEN}`,
        },
        body: JSON.stringify({
          denominacionId,
          pais: 'AR',
          moneda: 'ARS',
          precioFinal: Number(precioARS),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST /api/admin/precio → ${res.status}: ${text}`);
      }

      alert('Guardado ✔');

      // Refrescar catálogo sin caché para ver el cambio
      const r = await fetch('/api/catalogo', { cache: 'no-store' });
      const j = await r.json();
      setData(j.juegos);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg);
      alert('No se pudo guardar\n' + msg);
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <div className="p-4">Cargando…</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Catálogo · Admin</h1>

      {/* Aviso si falta token en el cliente */}
      {!CLIENT_TOKEN && (
        <div className="mb-4 rounded border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 px-3 py-2 text-sm">
          Falta <code>NEXT_PUBLIC_ADMIN_TOKEN</code> en <code>.env.local</code>. No podrás guardar cambios.
        </div>
      )}

      {/* Error de red/endpoint si lo hay */}
      {err && (
        <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      <div className="space-y-8">
        {data.map((j) => (
          <div key={j.id} className="border border-white/10 rounded p-4">
            <h2 className="font-semibold mb-3">{j.nombre}</h2>
            <div className="grid gap-3">
              {j.denominaciones.map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="min-w-48">{d.etiqueta}</div>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={d.precioARS}
                    onChange={(e) => { d.nuevoPrecio = Number(e.target.value) }}
                    className="w-36 bg-surface border border-white/10 rounded px-2 py-1"
                  />
                  <button
                    onClick={() => savePrecio(d.id, d.nuevoPrecio ?? d.precioARS)}
                    disabled={savingId === d.id}
                    className="px-3 py-1 rounded bg-brand text-black hover:bg-brand-dark disabled:opacity-50"
                  >
                    {savingId === d.id ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
