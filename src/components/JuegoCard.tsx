import { Juego } from '../data/juegos';
import Link from 'next/link';

export default function JuegoCard({ juego }: { juego: Juego }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src={juego.imagen}
        alt={juego.nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-xl font-semibold">{juego.nombre}</h3>
        <Link
          href={`/producto/${juego.id}`}
          className="text-white bg-blue-600 hover:bg-blue-700 text-sm py-2 px-4 rounded text-center"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
}
