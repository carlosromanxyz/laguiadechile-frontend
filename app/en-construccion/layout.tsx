export default function EnConstruccionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 flex flex-col bg-neutral-900">
      {/* Header - Caution stripe */}
      <header className="h-4 shrink-0 bg-[repeating-linear-gradient(45deg,#000_0px,#000_20px,#ffbe0b_20px,#ffbe0b_40px)]" />

      {/* Main - Centered content */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      {/* Footer - Copyright */}
      <footer className="shrink-0 py-4 px-6">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-neutral-500">
            © {currentYear} La Guía de Chile - Derechos reservados.
          </p>
          <a
            href="https://carlosroman.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-500 hover:text-white transition-colors"
          >
            Desarrollado por Carlos Román
          </a>
        </div>
      </footer>
    </div>
  );
}
