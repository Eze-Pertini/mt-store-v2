'use server';

import { ordenes } from '@/data/ordenes';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';

export async function crearOrden(formData: FormData) {
  const juegoId = formData.get('juegoId') as string;
  const email = formData.get('email') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const denominacionId = formData.get('denominacionId') as string;

  // Guardar todos los campos enviados
  const datos: Record<string, any> = {};
  formData.forEach((value, key) => {
    datos[key] = value;
  });

  const nuevaOrden = {
    id: randomUUID(),
    juegoId,
    datos,
    estado: 'CREADA' as const,
    creadaEn: new Date().toISOString(),
  };

  ordenes.push(nuevaOrden);

  console.log('🆕 Orden creada:', nuevaOrden);

  // MVP: redirigir a una página de "gracias"
  redirect(`/orden/${nuevaOrden.id}`);
}
