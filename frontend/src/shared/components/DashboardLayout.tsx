'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/shared/hooks/useAuth';
import { RoleSwitchButton } from './RoleSwitchButton';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  const artistNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Mis Canciones', href: '/dashboard/songs', icon: '🎵' },
    { name: 'Ventas', href: '/dashboard/sales', icon: '💰' },
    { name: 'Licencias', href: '/dashboard/licenses', icon: '📄' },
    { name: 'Chat', href: '/dashboard/chat', icon: '💬' },
    { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' }
  ];

  const buyerNavigation = [
    { name: 'Explorar', href: '/dashboard', icon: '🔍' },
    { name: 'Mis Compras', href: '/dashboard/purchases', icon: '🛍️' },
    { name: 'Favoritos', href: '/dashboard/favorites', icon: '❤️' },
    { name: 'Chat', href: '/dashboard/chat', icon: '💬' },
    { name: 'Historial', href: '/dashboard/history', icon: '📋' },
    { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' }
  ];

  const navigation = currentMode === 'artist' ? artistNavigation : buyerNavigation;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con colores temáticos */}
      <header className={`shadow-lg border-b-2 transition-all duration-300 ${
        currentMode === 'artist' 
          ? 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-800' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <span className="text-2xl">🎵</span>
                <span className="text-xl font-bold text-white">SoundsRights</span>
              </Link>
              <div className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                currentMode === 'artist'
                  ? 'bg-purple-800/50 text-purple-100 border border-purple-300/20'
                  : 'bg-blue-800/50 text-blue-100 border border-blue-300/20'
              }`}>
                {currentMode === 'artist' ? '🎤 Modo Artista' : '🛒 Modo Comprador'}
              </div>
            </div>

            {/* Centro - RoleSwitchButton */}
            <div className="flex-1 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <RoleSwitchButton
                  currentMode={currentMode}
                  onModeChange={onModeChange}
                />
              </div>
            </div>

            {/* Usuario y acciones */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white">
                <span className="font-medium">
                  Hola, {user?.name || user?.email}
                </span>
                {user?.role && (
                  <div className="text-xs opacity-75 capitalize">
                    {user.role}
                  </div>
                )}
              </div>
              
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border-2 border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 backdrop-blur-sm"
              >
                🚪 Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex">
        {showSidebar && (
          <aside className={`w-64 min-h-screen shadow-lg border-r-2 transition-all duration-300 ${
            currentMode === 'artist'
              ? 'bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800'
              : 'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800'
          }`}>
            <nav className="p-6">
              <div className={`mb-4 text-xs font-semibold uppercase tracking-wider ${
                currentMode === 'artist' 
                  ? 'text-purple-700 dark:text-purple-300' 
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {currentMode === 'artist' ? '🎤 Panel de Artista' : '🛒 Panel de Comprador'}
              </div>
              
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? currentMode === 'artist'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : currentMode === 'artist'
                            ? 'text-purple-700 dark:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-900/30 hover:text-purple-900 dark:hover:text-purple-100'
                            : 'text-blue-700 dark:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100'
                      }`}
                    >
                      <span className={`mr-3 text-lg transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`}>
                        {item.icon}
                      </span>
                      {item.name}
                      {isActive && (
                        <span className="ml-auto">
                          <div className={`w-2 h-2 rounded-full ${
                            currentMode === 'artist' ? 'bg-purple-200' : 'bg-blue-200'
                          }`}></div>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>
        )}

        {/* Área de contenido principal */}
        <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
