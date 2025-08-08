import { juegos } from '../data/juegos';
import JuegoCard from '../components/JuegoCard';

export default function Home() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Elegí tu juego</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {juegos.map((juego) => (
          <JuegoCard key={juego.id} juego={juego} />
        ))}
      </div>
    </section>
  );
}
