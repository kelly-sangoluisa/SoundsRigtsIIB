'use client';

import { useEffect } from 'react';
import { useSongsDashboard } from '@/features/songs/hooks/useSongs';
import { SongsList } from '@/features/songs/components/SongsListNew';
import { apiClient } from '@/lib/api-client';

export default function TestSongsDashboard() {
  const {
    availableSongs,
    mySongs,
    purchasedLicenses,
    soldLicenses,
    loading,
    error,
    refetchAll,
    createSong,
    updateSong,
    deleteSong,
    updateSongStatus,
    purchaseLicense,
  } = useSongsDashboard();

  // Configurar el cliente API con un user-id de prueba
  useEffect(() => {
    apiClient.setUserId('1'); // ID de usuario de prueba
  }, []);

  const handleRefresh = () => {
    refetchAll();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error de conexión</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SoundsRights</h1>
              <p className="text-gray-600">Marketplace de Licencias Musicales - Test Dashboard</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* API Status */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado de la API</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-600">
                Conexión: {error ? 'Error' : 'Conectado'}
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-600">
                Estado: {loading ? 'Cargando...' : 'Listo'}
              </span>
            </div>
          </div>
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Canciones Disponibles</p>
                <p className="text-2xl font-semibold text-gray-900">{availableSongs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mis Canciones</p>
                <p className="text-2xl font-semibold text-gray-900">{mySongs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Licencias Compradas</p>
                <p className="text-2xl font-semibold text-gray-900">{purchasedLicenses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Licencias Vendidas</p>
                <p className="text-2xl font-semibold text-gray-900">{soldLicenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Canciones Disponibles */}
        <div className="mb-12">
          <SongsList
            songs={availableSongs}
            title="Canciones Disponibles"
            showPurchaseButton={true}
            onPurchase={purchaseLicense}
            loading={loading}
            emptyMessage="No hay canciones disponibles para comprar"
          />
        </div>

        {/* Mis Canciones */}
        <div className="mb-12">
          <SongsList
            songs={mySongs}
            title="Mis Canciones"
            showActions={true}
            onDelete={deleteSong}
            onUpdateStatus={updateSongStatus}
            loading={loading}
            emptyMessage="No tienes canciones subidas. ¡Sube tu primera canción!"
          />
        </div>

        {/* Licencias */}
        {(purchasedLicenses.length > 0 || soldLicenses.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Licencias Compradas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Licencias Compradas</h3>
              {purchasedLicenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No has comprado licencias aún</p>
              ) : (
                <div className="space-y-4">
                  {purchasedLicenses.map((license) => (
                    <div key={license.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{license.songName}</h4>
                          <p className="text-gray-600 text-sm">{license.artistName}</p>
                        </div>
                        <span className="text-lg font-semibold text-green-600">${license.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Comprado el {new Date(license.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Licencias Vendidas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Licencias Vendidas</h3>
              {soldLicenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No has vendido licencias aún</p>
              ) : (
                <div className="space-y-4">
                  {soldLicenses.map((license) => (
                    <div key={license.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{license.songName}</h4>
                          <p className="text-gray-600 text-sm">{license.artistName}</p>
                        </div>
                        <span className="text-lg font-semibold text-blue-600">${license.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Vendido el {new Date(license.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
