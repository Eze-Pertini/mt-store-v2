// src/app/page.tsx
import JuegoCard from '@/components/JuegoCard';
import { getCatalogoFromDB } from '@/lib/catalogo';
import type { Juego as JuegoType } from '@/data/juegos'; // solo para tipado del prop de JuegoCard

export default async function HomePage() {
  const catalogo = await getCatalogoFromDB();

  if (!catalogo.length) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Catálogo</h1>
        <p className="text-muted">No hay productos activos por el momento.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Catálogo</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {catalogo.map((j) => (
          <JuegoCard key={j.id} juego={j as unknown as JuegoType} />
        ))}
      </div>
    </main>
  );
}