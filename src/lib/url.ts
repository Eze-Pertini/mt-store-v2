// src/lib/url.ts
import { headers } from 'next/headers';

export function getPublicBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (env) return env.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return '';
}

// ✅ versión async (Next 15 exige await)
export async function getServerBaseUrl(): Promise<string> {
  try {
    const h = await headers(); // 👈 await
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';
    if (host) return `${proto}://${host}`;
  } catch {}
  return '';
}
