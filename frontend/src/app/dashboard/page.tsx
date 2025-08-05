'use client';

import { RouteGuard } from '@/shared/components/RouteGuard';
import { useAuth } from '@/shared/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const artistStats = [
    { label: 'Total de Canciones', value: '6', icon: '🎵' },
    { label: 'Canciones Activas', value: '4', icon: '✅' },
    { label: 'En Revisión', value: '1', icon: '⏳' },
    { label: 'Ingresos del Mes', value: '$245', icon: '💰' },
  ];

  const quickActions = [
    {
      title: 'Subir Nueva Canción',
      description: 'Sube tu nueva creación musical',
      href: '/dashboard/artist/songs/upload',
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
      title: 'Estadísticas',
      description: 'Revisa el rendimiento de tus canciones',
      href: '/dashboard/stats',
      icon: '📊',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Configuración',
      description: 'Ajusta tu perfil y preferencias',
      href: '/dashboard/settings',
      icon: '⚙️',
      color: 'bg-gray-600 hover:bg-gray-700',
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
          {artistStats.map((stat, index) => (
            <div
              key={index}
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
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} text-white rounded-lg p-4 transition-colors group`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
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
            <div className="flex items-center space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tu canción "Midnight Dreams" fue aprobada y está ahora disponible
              </p>
              <span className="text-xs text-gray-500">hace 2 horas</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nueva venta de "Summer Vibes" - $4.99
              </p>
              <span className="text-xs text-gray-500">hace 5 horas</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "Ocean Waves" está en revisión
              </p>
              <span className="text-xs text-gray-500">hace 1 día</span>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
