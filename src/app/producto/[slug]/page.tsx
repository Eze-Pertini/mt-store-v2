// src/app/producto/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductoForm from '@/components/ProductoForm';
import ProductoImage from '@/components/ProductoImage';
import { getJuegoBySlugFromDB } from '@/lib/catalogo';
import type { Juego as JuegoType } from '@/data/juegos';
type Params = { slug: string };

export default async function ProductoPage({ 
  params, 
}: {
  params: Promise<Params>;
  }){
  const {slug} = await params;
  const j = await getJuegoBySlugFromDB(slug);
  if (!j) return notFound();

  const juego = j as unknown as JuegoType;

  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-start">
      <ProductoImage src={juego.imagen} alt={juego.nombre} maxHeight={420} />
      <div>
        <h1 className="text-2xl font-bold mb-2">{juego.nombre}</h1>
        <p className="text-xs text-muted mb-4">Canjeable en Argentina</p>
        <ProductoForm juego={juego} />
      </div>
    </div>
  );
}