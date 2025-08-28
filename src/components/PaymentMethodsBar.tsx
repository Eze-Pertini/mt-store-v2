import Image from 'next/image';

type Method = { src: string; alt: string };

const methods: Method[] = [
  { src: '/icons/mercadopago.svg', alt: 'Mercado Pago' },
  { src: '/icons/transfer.svg', alt: 'Transferencia bancaria' },
  { src: '/icons/visa.svg', alt: 'Visa' },
  { src: '/icons/mastercard.svg', alt: 'Mastercard' },
  { src: '/icons/rapipago.svg', alt: 'Rapipago' },
  { src: '/icons/pagofacil.svg', alt: 'Pago Fácil' },
];

export default function PaymentMethodsBar() {
  return (
    // mismo color que la página (oscuro), sin bordes ni filtros
    <div className="bg-background border border-white/10 rounded px-2 py-2">
      <div className="flex items-center justify-center flex-wrap gap-5">
        {methods.map((m) => (
          <Image
            key={m.alt}
            src={m.src}
            alt={m.alt}
            width={96}
            height={32}
            className="h-8 w-auto"
            priority={false}
          />
        ))}
      </div>
    </div>
  );
}
