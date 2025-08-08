export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MT Store</h1>
        <nav className="space-x-4">
          <a href="/" className="hover:underline">Inicio</a>
          <a href="/juegos" className="hover:underline">Juegos</a>
          <a href="/pago" className="hover:underline">Pago</a>
        </nav>
      </div>
    </header>
  );
}
