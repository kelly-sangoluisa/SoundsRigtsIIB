'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile, useUserProfile } from '@/features/user';
import { GlobalHeader } from '@/shared/components/GlobalHeader';

// Simulamos el ID del usuario logueado
const CURRENT_USER_ID = 'user_artist_1'; // Esto vendría del contexto de autenticación

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile(CURRENT_USER_ID);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Error al cargar el perfil
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Perfil no encontrado
              </h2>
              <p className="text-gray-600">
                No se pudo encontrar la información del perfil.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalHeader />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con navegación */}
        <div className="mb-8">
          <nav className="flex items-center space-x-4 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Mi perfil</span>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Perfil principal */}
          <UserProfile profile={profile} isOwnProfile={true} />

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones rápidas
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/profile/edit"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">✏️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Editar perfil
                  </h3>
                  <p className="text-sm text-gray-500">
                    Actualiza tu información
                  </p>
                </div>
              </Link>

              <Link
                href="/profile/settings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Configuración
                  </h3>
                  <p className="text-sm text-gray-500">
                    Preferencias y privacidad
                  </p>
                </div>
              </Link>

              {profile.role === 'artist' && (
                <Link
                  href="/dashboard"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Dashboard
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ver estadísticas
                    </p>
                  </div>
                </Link>
              )}

              {profile.role === 'buyer' && (
                <Link
                  href="/licenses"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Mis licencias
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ver compras
                    </p>
                  </div>
                </Link>
              )}

              <Link
                href="/chat"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Mensajes
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ver conversaciones
                  </p>
                </div>
              </Link>

              <Link
                href="/songs"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">🎵</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Explorar música
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ver catálogo
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Información adicional según el rol */}
          {profile.role === 'artist' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Panel de artista
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile.stats?.songsPublished || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Canciones publicadas
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {profile.stats?.licensesSold || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Licencias vendidas
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    €{(profile.stats?.totalEarnings || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Ganancias totales
                  </div>
                </div>
              </div>
            </div>
          )}

          {profile.role === 'buyer' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de compras
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.stats?.licensesPurchased || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Licencias compradas
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    €{(profile.stats?.totalSpent || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total invertido
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
