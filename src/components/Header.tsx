'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);

  // Cerrar con ESC y al cambiar de tamaño (por si pasa a desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <span className="inline-block w-2 h-6 bg-brand rounded-sm" />
          <span className="font-semibold">MT Store</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-brand transition">Inicio</Link>
          <Link href="/juegos" className="hover:text-brand transition">Juegos</Link>
          <Link href="/pago" className="hover:text-brand transition">Pago</Link>
        </nav>

        {/* CTA / Login (desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/iniciar-sesion"
            className="bg-brand hover:bg-brand-dark text-white text-sm px-3 py-2 rounded"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Hamburguesa (mobile) */}
        <button
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded border border-white/10 hover:bg-white/5"
        >
          {/* Icono hamburguesa / close */}
          {open ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-surface">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 text-sm">
            <Link href="/" onClick={close} className="py-2 hover:text-brand transition">Inicio</Link>
            <Link href="/juegos" onClick={close} className="py-2 hover:text-brand transition">Juegos</Link>
            <Link href="/pago" onClick={close} className="py-2 hover:text-brand transition">Pago</Link>
            <Link
              href="/iniciar-sesion"
              onClick={close}
              className="mt-2 inline-flex justify-center bg-brand hover:bg-brand-dark text-white text-sm px-3 py-2 rounded"
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
