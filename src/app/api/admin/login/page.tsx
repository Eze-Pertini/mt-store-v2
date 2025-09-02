// Server Component (NO "use client" en el archivo)
import { cookies } from 'next/headers';

export default function AdminLoginPage() {
  async function login(formData: FormData) {
    'use server';
    const token = (formData.get('token') || '').toString().trim();
    if (token !== process.env.ADMIN_TOKEN) {
      return { ok: false, error: 'Token inválido' };
    }

    const jar = await cookies();            // 👈 AWAIT
    jar.set('admin_auth', 'ok', {
      httpOnly: false,                      // MVP
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return { ok: true };
  }

  async function logout() {
    'use server';
    const jar = await cookies();            // 👈 AWAIT
    jar.delete('admin_auth');
    return { ok: true };
  }

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Acceso admin</h1>

      {/* @ts-expect-error Server Action */}
      <form action={login} className="grid gap-3">
        <input
          type="password"
          name="token"
          placeholder="Admin token"
          className="w-full rounded border border-white/10 bg-surface px-3 py-2"
          required
        />
        <button className="bg-brand text-black rounded px-4 py-2">Ingresar</button>
      </form>

      {/* @ts-expect-error Server Action */}
      <form action={logout} className="mt-4">
        <button className="text-sm underline">Cerrar sesión</button>
      </form>
    </main>
  );
}
