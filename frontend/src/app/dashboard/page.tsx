'use client';

import { RouteGuard } from '@/shared/components/RouteGuard';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMySongs } from '@/shared/hooks/useSongs';
import { useSoldLicenses } from '@/shared/hooks/useLicenses';
import { useChats } from '@/shared/hooks/useChats';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Funciones helper para reducir complejidad
const getStatusBadge = (status: string) => {
  if (status === 'available') return 'bg-green-100 text-green-800';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
  if (status === 'available') return 'Disponible';
  if (status === 'pending') return 'Pendiente';
  return status;
};

const renderSongsSection = (songs: any[], loadingSongs: boolean) => {
  if (loadingSongs) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No tienes canciones aún. ¡Sube tu primera canción!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {songs.slice(0, 3).map((song) => (
        <div key={song.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {song.title}
            </p>
            <p className="text-sm text-gray-500">
              {song.genre} • ${song.price}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(song.status)}`}>
            {getStatusText(song.status)}
          </span>
        </div>
      ))}
    </div>
  );
};

const renderLicensesSection = (licenses: any[], loadingLicenses: boolean) => {
  if (loadingLicenses) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    );
  }

  if (!licenses || licenses.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No tienes ventas aún. ¡Promociona tus canciones!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {licenses.slice(0, 3).map((license) => (
        <div key={license.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {license.song?.title || 'Canción sin título'}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(license.purchasedAt).toLocaleDateString('es-ES')}
            </p>
          </div>
          <span className="font-semibold text-green-600">
            ${license.price}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { songs, loading: loadingSongs } = useMySongs();
  const { licenses, loading: loadingLicenses } = useSoldLicenses();
  const { chats, loading: loadingChats } = useChats();
  
  // Estados para estadísticas calculadas
  const [stats, setStats] = useState({
    totalSongs: 0,
    activeSongs: 0,
    reviewingSongs: 0,
    monthlyIncome: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Calcular estadísticas basadas en datos reales
  useEffect(() => {
    if (songs && licenses) {
      const activeSongs = songs.filter(song => song.status === 'available').length;
      const reviewingSongs = songs.filter(song => song.status === 'pending').length;
      
      // Calcular ingresos del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyIncome = licenses
        .filter(license => {
          const licenseDate = new Date(license.purchasedAt);
          return licenseDate.getMonth() === currentMonth && 
                 licenseDate.getFullYear() === currentYear;
        })
        .reduce((total, license) => total + (license.price || 0), 0);

      setStats({
        totalSongs: songs.length,
        activeSongs,
        reviewingSongs,
        monthlyIncome,
      });
    }
  }, [songs, licenses]);

  // Generar actividad reciente basada en datos reales
  useEffect(() => {
    const activities = [];
    
    // Últimas canciones aprobadas
    if (songs) {
      const recentApproved = songs
        .filter(song => song.status === 'available')
        .slice(0, 2)
        .map(song => ({
          type: 'approved',
          message: `Tu canción "${song.title}" fue aprobada y está ahora disponible`,
          time: 'hace 2 horas',
          color: 'bg-green-500',
        }));
      activities.push(...recentApproved);
    }

    // Últimas ventas
    if (licenses) {
      const recentSales = licenses
        .slice(0, 2)
        .map(license => ({
          type: 'sale',
          message: `Nueva venta de "${license.song?.title}" - $${license.price}`,
          time: 'hace 5 horas',
          color: 'bg-blue-500',
        }));
      activities.push(...recentSales);
    }

    // Canciones en revisión
    if (songs) {
      const reviewing = songs
        .filter(song => song.status === 'pending')
        .slice(0, 1)
        .map(song => ({
          type: 'reviewing',
          message: `"${song.title}" está en revisión`,
          time: 'hace 1 día',
          color: 'bg-yellow-500',
        }));
      activities.push(...reviewing);
    }

    setRecentActivity(activities.slice(0, 5));
  }, [songs, licenses]);

  const artistStats = [
    { 
      label: 'Total de Canciones', 
      value: loadingSongs ? '...' : stats.totalSongs.toString(), 
      icon: '🎵' 
    },
    { 
      label: 'Canciones Activas', 
      value: loadingSongs ? '...' : stats.activeSongs.toString(), 
      icon: '✅' 
    },
    { 
      label: 'En Revisión', 
      value: loadingSongs ? '...' : stats.reviewingSongs.toString(), 
      icon: '⏳' 
    },
    { 
      label: 'Ingresos del Mes', 
      value: loadingLicenses ? '...' : `$${stats.monthlyIncome.toFixed(2)}`, 
      icon: '💰' 
    },
  ];

  const quickActions = [
    {
      title: 'Subir Nueva Canción',
      description: 'Sube tu nueva creación musical',
      href: '/dashboard/artist/songs/new',
      icon: '📤',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Ver Mis Canciones',
      description: 'Gestiona tu catálogo musical',
      href: '/dashboard/artist/songs',
      icon: '🎵',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Explorar Canciones',
      description: 'Descubre nueva música para comprar',
      href: '/dashboard/buyer/explore',
      icon: '�',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Mis Chats',
      description: 'Revisa conversaciones activas',
      href: '/dashboard/artist/chats',
      icon: '💬',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      badge: loadingChats ? '' : chats.filter(chat => chat.unreadCount > 0).length.toString(),
    },
  ];

  return (
    <RouteGuard>
      <div className="space-y-8">
        {/* Bienvenida */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido de vuelta, {user?.name || user?.email}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Este es tu panel de control donde puedes gestionar tus canciones y ver tus estadísticas.
          </p>
        </div>

        {/* Estadísticas del Artista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artistStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`${action.color} text-white rounded-lg p-4 transition-colors group relative`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                  {action.badge && parseInt(action.badge) > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {action.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.message.slice(0, 20)}`} className="flex items-center space-x-3">
                  <span className={`flex-shrink-0 w-2 h-2 ${activity.color} rounded-full`}></span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                    {activity.message}
                  </p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📊</span>
                <p className="text-gray-500 dark:text-gray-400">
                  {loadingSongs || loadingLicenses ? 
                    'Cargando actividad reciente...' : 
                    'No hay actividad reciente'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen de Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Canciones Destacadas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Canciones Más Populares
            </h3>
            {renderSongsSection(songs, loadingSongs)}
          </div>

          {/* Ventas Recientes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ventas Recientes
            </h3>
            {renderLicensesSection(licenses, loadingLicenses)}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
