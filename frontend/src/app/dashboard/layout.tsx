'use client';

import { useAuth } from '@/shared/hooks/useAuth';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserProfileHeader } from '@/features/user';
import { RoleSwitchButton } from '@/shared/components/RoleSwitchButton';

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  // Estado para el cambio de rol
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('artist');

  const handleModeChange = (newMode: 'artist' | 'buyer') => {
    console.log('🔄 [DashboardLayout] Cambiando modo:', { from: currentMode, to: newMode });
    setCurrentMode(newMode);
    // Aquí podrías persistir la preferencia en localStorage o en el backend
    localStorage.setItem('userMode', newMode);
  };

  // Cargar el modo preferido del usuario al montar el componente
  useEffect(() => {
    const savedMode = localStorage.getItem('userMode') as 'artist' | 'buyer';
    if (savedMode && (savedMode === 'artist' || savedMode === 'buyer')) {
      setCurrentMode(savedMode);
    }
  }, []);

  console.log('🏠 [DashboardLayout] Estado actual:', {
    pathname,
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    userId: user?.id,
    username: user?.username,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    console.log('🔄 [DashboardLayout] useEffect ejecutado:', {
      isLoading,
      isAuthenticated,
      shouldRedirect: !isLoading && !isAuthenticated
    });
    
    if (!isLoading && !isAuthenticated) {
      console.log('🚨 [DashboardLayout] Usuario no autenticado, redirigiendo a /login...');
      router.push('/login');
    } else if (!isLoading && isAuthenticated && user) {
      console.log('✅ [DashboardLayout] Usuario autenticado correctamente:', {
        userId: user.id,
        username: user.username,
        email: user.email
      });
    }
  }, [isLoading, isAuthenticated, router, user]);

  if (isLoading) {
    console.log('⏳ [DashboardLayout] Mostrando spinner de carga...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ [DashboardLayout] Mostrando mensaje de redirección...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  console.log('🎯 [DashboardLayout] Renderizando dashboard completo para usuario:', user);

  // Navegación dinámica según el modo
  const artistNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Mis Canciones', href: '/dashboard/artist/songs', icon: '🎵' },
    { name: 'Licencias Vendidas', href: '/dashboard/artist/licenses', icon: '💰' },
    { name: 'Chat', href: '/dashboard/artist/chats', icon: '💬' },
    { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' },
  ];

  const buyerNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Explorar Música', href: '/dashboard/buyer/explore', icon: '🔍' },
    { name: 'Mis Licencias', href: '/dashboard/buyer/licenses', icon: '📋' },
    { name: 'Chat', href: '/dashboard/buyer/chats', icon: '💬' },
    { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' },
  ];

  const navigation = currentMode === 'artist' ? artistNavigation : buyerNavigation;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del Dashboard */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard {currentMode === 'artist' ? '🎤' : '🛒'}
              </h1>
            </div>
            
            {/* Centro - RoleSwitchButton */}
            <div className="hidden md:flex items-center">
              <RoleSwitchButton
                currentMode={currentMode}
                onModeChange={handleModeChange}
                size="md"
              />
            </div>
            
            {/* Usuario y logout */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username || user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentMode === 'artist' ? '🎤 Artista' : '🛒 Comprador'}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm">
                        {currentMode === 'artist' ? '🎤' : '🛒'}
                      </span>
                    </div>
                  </div>
                  <UserProfileHeader userId={user.id.toString()} />
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RoleSwitchButton para móvil */}
          <div className="md:hidden pb-3 px-4">
            <RoleSwitchButton
              currentMode={currentMode}
              onModeChange={handleModeChange}
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Navegación secundaria */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 pb-4 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
