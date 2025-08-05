import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/shared/hooks/useAuth';
import { RoleSwitchButton } from './RoleSwitchButton';

interface DashboardLayoutProps {
  children: ReactNode;
  currentMode: 'artist' | 'buyer';
  onModeChange: (mode: 'artist' | 'buyer') => void;
  title?: string;
  showSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentMode,
  onModeChange,
  title = 'Dashboard',
  showSidebar = true
}) => {
  const { user, logout } = useAuth();

  const artistNavigation = [
    { name: 'Resumen', href: '/dashboard', icon: '📊' },
    { name: 'Mis canciones', href: '/dashboard/songs', icon: '🎵' },
    { name: 'Licencias vendidas', href: '/dashboard/licenses', icon: '💰' },
    { name: 'Análisis', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' }
  ];

  const buyerNavigation = [
    { name: 'Explorar', href: '/dashboard', icon: '🔍' },
    { name: 'Mis licencias', href: '/dashboard/licenses', icon: '📄' },
    { name: 'Favoritos', href: '/dashboard/favorites', icon: '❤️' },
    { name: 'Historial', href: '/dashboard/history', icon: '📋' },
    { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' }
  ];

  const navigation = currentMode === 'artist' ? artistNavigation : buyerNavigation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🎵</span>
                <span className="text-xl font-bold text-gray-900">
                  SoundsRights
                </span>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-700">
                {title}
              </h1>
            </div>

            {/* Centro - RoleSwitchButton */}
            <div className="hidden md:flex">
              <RoleSwitchButton
                currentMode={currentMode}
                onModeChange={onModeChange}
                size="md"
              />
            </div>

            {/* Usuario y acciones */}
            <div className="flex items-center space-x-4">
              {/* Info del usuario */}
              {user && (
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentMode === 'artist' ? '🎤 Artista' : '🛒 Comprador'}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">
                      {currentMode === 'artist' ? '🎤' : '🛒'}
                    </span>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex items-center space-x-2">
                {/* Notificaciones */}
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <span className="text-lg">🔔</span>
                </button>

                {/* Perfil */}
                <Link
                  href="/profile"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <span className="text-lg">👤</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>

          {/* RoleSwitchButton para móvil */}
          <div className="md:hidden pb-3">
            <RoleSwitchButton
              currentMode={currentMode}
              onModeChange={onModeChange}
              size="sm"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16">
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Separador */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-1">
                  <Link
                    href="/chat"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                  >
                    <span className="mr-3 text-lg">💬</span>
                    Mensajes
                  </Link>
                  <Link
                    href="/help"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                  >
                    <span className="mr-3 text-lg">❓</span>
                    Ayuda
                  </Link>
                </div>
              </div>

              {/* Stats rápidas */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="px-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {currentMode === 'artist' ? 'Mi música' : 'Mi actividad'}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {currentMode === 'artist' ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Canciones:</span>
                          <span className="font-medium text-gray-900">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Vendidas:</span>
                          <span className="font-medium text-green-600">45</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Ganancias:</span>
                          <span className="font-medium text-green-600">€2,850</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Compradas:</span>
                          <span className="font-medium text-gray-900">23</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Gastado:</span>
                          <span className="font-medium text-blue-600">€1,890</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Este mes:</span>
                          <span className="font-medium text-blue-600">€340</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
