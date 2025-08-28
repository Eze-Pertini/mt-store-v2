import OrdenLive from './OrdenLive';

export default async function OrdenPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Estado de tu orden</h1>
      <OrdenLive id={id} />
    </main>
  );
}
