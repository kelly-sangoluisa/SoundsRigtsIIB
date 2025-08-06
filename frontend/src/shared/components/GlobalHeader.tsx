import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/shared/hooks/useAuth';
import { UserProfileHeader } from '@/features/user';

interface GlobalHeaderProps {
  title?: string;
  showNavigation?: boolean;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ 
  title = 'SoundsRights', 
  showNavigation = true 
}) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Explorar', href: '/songs', icon: '🎵' },
    { name: 'Chat', href: '/chat', icon: '💬' },
    ...(user?.role === 'artist' 
      ? [
          { name: 'Dashboard', href: '/dashboard', icon: '📊' },
          { name: 'Licencias vendidas', href: '/licenses/sold', icon: '💰' }
        ]
      : [
          { name: 'Mis licencias', href: '/licenses', icon: '📄' }
        ]
    )
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎵</span>
              <h1 className="text-xl font-bold text-gray-900">
                {title}
              </h1>
            </Link>
          </div>
          
          {/* Navegación principal */}
          {showNavigation && user && (
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Usuario y autenticación */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <UserProfileHeader userId={user.id} />
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegación móvil */}
      {showNavigation && user && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
