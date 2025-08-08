// src/app/producto/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { juegos } from '@/data/juegos';

type Props = {
  params: { slug: string };
};

export default function ProductoPage({ params }: Props) {
  const juego = juegos.find((j) => j.slug === params.slug);

  if (!juego) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{juego.nombre}</h1>
      <img
        src={juego.imagen}
        alt={juego.nombre}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <form
        action="/pago" // temporal, después lo cambiamos a server action
        method="POST"
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        {/* Campos pre-pago */}
        {juego.camposPrePago.map((campo) => (
          <div key={campo.name}>
            <label className="block text-sm font-medium mb-1">
              {campo.label}
            </label>
            <input
              type={campo.type}
              name={campo.name}
              required={campo.required}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {campo.help && (
              <p className="text-xs text-gray-500 mt-1">{campo.help}</p>
            )}
          </div>
        ))}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            required
            placeholder="+54 9 ..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Denominaciones */}
        <div>
          <label className="block text-sm font-medium mb-1">Pack</label>
          <select
            name="denominacionId"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccionar</option>
            {juego.denominaciones
              .filter((d) => d.activo)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.etiqueta} – ${d.precioARS}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark"
        >
          Continuar al pago
        </button>
      </form>
    </div>
  );
}
