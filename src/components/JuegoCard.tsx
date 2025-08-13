import { Juego } from '../data/juegos';
import Link from 'next/link';
import ProductoImage from './ProductoImage';

export default function JuegoCard({ juego }: { juego: Juego }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-surface">
      <ProductoImage
        src={juego.imagen}
        alt={juego.nombre}
        maxHeight={192} // equivalente a h-48
        width={600}
        height={600}
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{juego.nombre}</h3>
        <Link
          href={`/producto/${juego.slug ?? juego.id}`}
          className="text-white bg-brand hover:bg-brand-dark text-sm py-2 px-4 rounded text-center"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
}
