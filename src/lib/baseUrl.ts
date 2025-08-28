// src/lib/baseUrl.ts
import { headers } from 'next/headers';

export function getBaseUrl(): string {
  // 1) Env explícito
  const env = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (env) return env.replace(/\/+$/, '');

  // 2) Vercel
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  // 3) Headers (Next.js App Router)
  try {
    const h = headers(); // ✅ objeto HeadersSync
    const host = (h as any).get?.('x-forwarded-host') ?? (h as any).get?.('host');
    const proto = (h as any).get?.('x-forwarded-proto') ?? 'http';
    if (host) return `${proto}://${host}`;
  } catch {
    // si headers() no está disponible en este contexto
  }

  // 4) Fallback local
  return 'http://localhost:3000';
}
