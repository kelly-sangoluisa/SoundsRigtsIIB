import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191414] via-[#191414] to-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                🎵 <span className="text-[#1db954]">SongRights</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-white hover:text-[#1db954] transition-colors font-medium"
              >
                Iniciar sesión
              </Link>
              <Link 
                href="/auth/register" 
                className="spotify-button"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              Descubre artistas
              <span className="block text-[#1db954]">emergentes</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Encuentra y adquiere derechos exclusivos de canciones de artistas emergentes. 
              Sé el primero en descubrir el próximo gran éxito musical.
            </p>
          </div>

          {/* Features */}
          <div className="py-20">
            <h2 className="text-4xl font-bold text-white text-center mb-16">
              ¿Por qué elegir SongRights?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Artistas emergentes</h3>
                <p className="text-gray-300">
                  Descubre talentos únicos antes que se vuelvan mainstream.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Derechos exclusivos</h3>
                <p className="text-gray-300">
                  Adquiere derechos exclusivos y asegura tu inversión musical.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Inversión inteligente</h3>
                <p className="text-gray-300">
                  Invierte en el futuro de la música con artistas prometedores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🎵 <span className="text-[#1db954]">SongRights</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Plataforma de descubrimiento y adquisición de derechos musicales
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contacto
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-8">
              © 2025 SongRights. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
