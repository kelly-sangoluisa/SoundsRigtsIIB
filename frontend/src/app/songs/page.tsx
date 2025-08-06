'use client';

import { useSongsDashboard } from '@/features/songs/hooks/useSongs';
import { apiClient } from '@/lib/api-client';
import { useEffect } from 'react';

export default function SongsPage() {
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

  // Configurar usuario por defecto
  useEffect(() => {
    apiClient.setUserId('1');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando canciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={refetchAll}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎵 SoundsRights - Marketplace Musical
          </h1>
          <p className="text-gray-600">
            Gestiona tus canciones y licencias musicales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Canciones Disponibles</div>
            <div className="text-2xl font-bold text-blue-600">{availableSongs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Mis Canciones</div>
            <div className="text-2xl font-bold text-green-600">{mySongs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Licencias Compradas</div>
            <div className="text-2xl font-bold text-purple-600">{purchasedLicenses.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Licencias Vendidas</div>
            <div className="text-2xl font-bold text-orange-600">{soldLicenses.length}</div>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Canciones Disponibles */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                🛒 Canciones Disponibles para Comprar
              </h2>
            </div>
            <div className="p-6">
              {availableSongs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay canciones disponibles
                </p>
              ) : (
                <div className="space-y-4">
                  {availableSongs.map((song) => (
                    <div key={song.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{song.name}</h3>
                          <p className="text-sm text-gray-600">Por: {song.artist}</p>
                          <p className="text-sm text-gray-500">Género: {song.genre}</p>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          ${song.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {song.status}
                        </span>
                        <button
                          onClick={() => purchaseLicense(song.id.toString())}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Comprar Licencia
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mis Canciones */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                🎤 Mis Canciones
              </h2>
            </div>
            <div className="p-6">
              {mySongs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tienes canciones publicadas
                </p>
              ) : (
                <div className="space-y-4">
                  {mySongs.map((song) => (
                    <div key={song.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{song.name}</h3>
                          <p className="text-sm text-gray-600">Género: {song.genre}</p>
                          <p className="text-sm text-gray-500">
                            Duración: {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          ${song.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          song.status === 'for_sale' ? 'bg-green-100 text-green-800' :
                          song.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {song.status}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => updateSongStatus(
                              song.id.toString(), 
                              song.status === 'for_sale' ? 'pending' : 'for_sale'
                            )}
                            className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                          >
                            Cambiar Estado
                          </button>
                          <button
                            onClick={() => deleteSong(song.id.toString())}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Licencias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Licencias Compradas */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                💳 Licencias Compradas
              </h2>
            </div>
            <div className="p-6">
              {purchasedLicenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No has comprado licencias aún
                </p>
              ) : (
                <div className="space-y-4">
                  {purchasedLicenses.map((license) => (
                    <div key={license.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{license.songName}</h3>
                      <p className="text-sm text-gray-600">Artista: {license.artistName}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          Comprada: {new Date(license.purchaseDate).toLocaleDateString()}
                        </span>
                        <span className="text-lg font-bold text-purple-600">
                          ${license.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Licencias Vendidas */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                💰 Licencias Vendidas
              </h2>
            </div>
            <div className="p-6">
              {soldLicenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No has vendido licencias aún
                </p>
              ) : (
                <div className="space-y-4">
                  {soldLicenses.map((license) => (
                    <div key={license.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{license.songName}</h3>
                      <p className="text-sm text-gray-600">Comprador ID: {license.buyerId}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          Vendida: {new Date(license.purchaseDate).toLocaleDateString()}
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          +${license.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={refetchAll}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            🔄 Actualizar Datos
          </button>
        </div>
      </div>
    </div>
  );
}
