export const dynamic = 'force-dynamic';

export default async function ErrorPagoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const orderId = sp.orden ?? sp.external_reference ?? '';
  const hasOrder = Boolean(orderId);

  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-3">No pudimos procesar tu pago</h1>
      <p className="text-muted mb-4">
        Orden: <strong className="font-mono">{hasOrder ? orderId : '-'}</strong>
      </p>
      <p className="mb-6">
        Puede deberse a un error de la tarjeta o de la plataforma. Probá nuevamente o elegí otro medio de pago.
      </p>

      <details className="rounded border border-white/10 p-3 bg-surface text-left">
        <summary className="cursor-pointer">Ver detalles técnicos</summary>
        <div className="mt-2 text-sm">
          <div><b>Estado MP</b>: {sp.collection_status ?? sp.status ?? 'error'}</div>
          <div><b>Payment ID</b>: {sp.payment_id ?? sp['data.id'] ?? '-'}</div>
          <div><b>Preference</b>: {sp.preference_id ?? '-'}</div>
          <div><b>Orden (ref)</b>: {sp.external_reference ?? sp.orden ?? '-'}</div>
        </div>
      </details>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/"
          className="inline-block bg-brand text-black rounded px-4 py-2"
        >
          Volver al inicio
        </a>

        {hasOrder ? (
          <a
            href={`/orden/${orderId}`}
            className="inline-block rounded px-4 py-2 border border-brand/70 text-brand hover:bg-brand/10"
          >
            Ver estado de mi orden
          </a>
        ) : (
          <span className="text-xs text-muted">
            (No recibimos el ID de la orden. Si necesitás ayuda, escribinos.)
          </span>
        )}
      </div>
    </main>
  );
}
