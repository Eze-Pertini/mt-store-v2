export const dynamic = 'force-dynamic';

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const orderId = sp.orden ?? sp.external_reference ?? '';
  const hasOrder = Boolean(orderId);

  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-3">Tu pago quedó pendiente</h1>
      <p className="text-muted mb-4">
        Orden: <strong className="font-mono">{hasOrder ? orderId : '-'}</strong>
      </p>
      <p className="mb-6">
        Si pagaste en efectivo (Rapipago/Pago Fácil) o transferencia, puede demorar en acreditarse.
        Te avisaremos por email/WhatsApp apenas se confirme.
      </p>

      <div className="grid gap-2 text-sm text-left rounded border border-white/10 p-3 bg-surface">
        <div><b>Estado MP</b>: {sp.collection_status ?? sp.status ?? 'pending'}</div>
        <div><b>Payment ID</b>: {sp.payment_id ?? sp['data.id'] ?? '-'}</div>
        <div><b>Preference</b>: {sp.preference_id ?? '-'}</div>
        <div><b>Orden (ref)</b>: {sp.external_reference ?? sp.orden ?? '-'}</div>
      </div>

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
