export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="border-b border-white/10 px-6 py-3 bg-surface">
        <h1 className="text-lg font-bold">Panel de Administración</h1>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
