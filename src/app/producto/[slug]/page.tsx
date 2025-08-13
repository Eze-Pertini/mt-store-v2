import { notFound } from 'next/navigation';
import { juegos } from '@/data/juegos';
import ProductoForm from '@/components/ProductoForm';
import ProductoImage from '@/components/ProductoImage';

type Props = { params: { slug: string } };

export default function ProductoPage({ params }: Props) {
  const juego = juegos.find((j) => j.slug === params.slug);
  if (!juego) return notFound();

  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-start">
      <ProductoImage
        src={juego.imagen}
        alt={juego.nombre}
        maxHeight={420}     // opcional
        wrapperClassName="mx-auto md:mx-0"
      />

      <div>
        <h1 className="text-2xl font-bold mb-2">{juego.nombre}</h1>
        <p className="text-xs text-muted mb-4">Canjeable solo en Argentina</p>

        <ProductoForm juego={juego} />
      </div>
    </div>
  );
}
