import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <h4 className="font-semibold mb-2">MT Store</h4>
          <p className="text-muted">
            Recargas digitales al instante. Soporte humano y métodos de pago locales.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Navegación</h4>
          <ul className="space-y-1 text-muted">
            <li><Link href="/" className="hover:text-brand">Inicio</Link></li>
            <li><Link href="/juegos" className="hover:text-brand">Juegos</Link></li>
            <li><Link href="/pago" className="hover:text-brand">Pago</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Soporte</h4>
          <ul className="space-y-1 text-muted">
            <li><a href="mailto:soporte@mt-store.com.ar" className="hover:text-brand">soporte@mt-store.com.ar</a></li>
            <li><a href="https://wa.me/54911XXXXXXXX" target="_blank" className="hover:text-brand">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-3 text-center text-xs text-muted">
        © {new Date().getFullYear()} MT Store · Todos los derechos reservados
      </div>
    </footer>
  );
}
