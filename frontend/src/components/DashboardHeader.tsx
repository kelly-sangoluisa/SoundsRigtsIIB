import { User } from '@/types/auth';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-spotify-gray/50 backdrop-blur-sm border-b border-spotify-light-gray/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              🎵 <span className="text-spotify-green">SongRights</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <a href="/dashboard" className="text-spotify-light-gray hover:text-white transition-colors">
                Dashboard
              </a>
              <a href="/dashboard/my-songs" className="text-spotify-light-gray hover:text-white transition-colors">
                Mis Canciones
              </a>
              <a href="/dashboard/requests" className="text-spotify-light-gray hover:text-white transition-colors">
                📩 Solicitudes
              </a>
              <a href="/dashboard/purchases" className="text-spotify-light-gray hover:text-white transition-colors">
                Compras
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-spotify-light-gray">{user.email}</p>
                </div>
              )}
              
              {user && (
                <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
                  <span className="text-spotify-black font-bold text-sm">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
              )}
              
              <button
                onClick={onLogout}
                className="text-sm text-spotify-light-gray hover:text-white transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
