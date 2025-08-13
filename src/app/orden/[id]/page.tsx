import { ordenes } from '@/data/ordenes';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default function OrdenPage({ params }: Props) {
  const orden = ordenes.find((o) => o.id === params.id);
  if (!orden) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">¡Orden creada!</h1>
      <p className="mb-2">ID de orden: {orden.id}</p>
      <p className="mb-6">Estado: {orden.estado}</p>
      <p>En breve recibirás un email con los pasos para continuar el pago.</p>
    </div>
  );
}
