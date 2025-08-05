'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMySongs } from '../hooks/useMySongs';
import { SongsFilters } from './SongsFilters';
import { SongsList } from './SongsList';
import { ReservationsList } from './ReservationsList';
import { Song, ReservationInfo } from '../types';
import { mockSongsAPI } from '@/shared/utils/mockSongsAPI';

export const MySongsView = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    songs, 
    isLoading, 
    error, 
    total, 
    filters,
    applyFilters,
    refreshSongs,
    clearError 
  } = useMySongs();

  const [actionError, setActionError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'songs' | 'reservations'>('songs');
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

  // Cargar reservas cuando se cambia a la pestaña de reservas
  useEffect(() => {
    if (activeTab === 'reservations' && user) {
      loadReservations();
    }
  }, [activeTab, user]);

  const loadReservations = async () => {
    if (!user) return;
    
    try {
      setReservationsLoading(true);
      const reservationsData = await mockSongsAPI.getReservationsByArtist(user.id);
      setReservations(reservationsData);
    } catch (error: any) {
      setActionError(`Error al cargar reservas: ${error.message}`);
    } finally {
      setReservationsLoading(false);
    }
  };

  const handleAcceptSale = async (reservationId: string) => {
    try {
      setActionError('');
      await mockSongsAPI.acceptSale({ reservationId });
      await loadReservations(); // Recargar reservas
      refreshSongs(); // Refrescar canciones para actualizar estados
    } catch (error: any) {
      setActionError(`Error al aceptar venta: ${error.message}`);
    }
  };

  const handleRejectSale = async (reservationId: string) => {
    try {
      setActionError('');
      await mockSongsAPI.rejectSale({ reservationId });
      await loadReservations(); // Recargar reservas
      refreshSongs(); // Refrescar canciones para actualizar estados
    } catch (error: any) {
      setActionError(`Error al rechazar venta: ${error.message}`);
    }
  };

  const handleEdit = (song: Song) => {
    router.push(`/dashboard/artist/songs/edit/${song.id}`);
  };

  const handleDelete = async (songId: string) => {
    try {
      setActionError('');
      await mockSongsAPI.deleteSong(songId, '1');
      // Refrescar la lista después de eliminar
      refreshSongs();
    } catch (error: any) {
      setActionError(error.message);
    }
  };

  const handleRefresh = () => {
    clearError();
    setActionError('');
    refreshSongs();
  };

  const handleNewSong = () => {
    router.push('/dashboard/artist/songs/new');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'songs' ? 'Mis Canciones' : 'Reservas Pendientes'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {activeTab === 'songs' 
              ? 'Gestiona tu biblioteca musical como artista'
              : 'Revisa y gestiona las solicitudes de compra de tus canciones'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={activeTab === 'songs' ? handleRefresh : loadReservations}
            disabled={isLoading || reservationsLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
          
          {activeTab === 'songs' && (
            <button 
              onClick={handleNewSong}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Canción
            </button>
          )}
        </div>
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('songs')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'songs'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Mis Canciones
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                {total}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('reservations')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reservations'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reservas
              {reservations.length > 0 && (
                <span className="ml-2 bg-orange-100 dark:bg-orange-900/20 text-orange-900 dark:text-orange-300 py-0.5 px-2 rounded-full text-xs">
                  {reservations.length}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Estadísticas - Solo para la pestaña de canciones */}
      {activeTab === 'songs' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Publicadas</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {songs.filter(song => song.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reservadas</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {songs.filter(song => song.status === 'reserved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos Est.</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${songs.filter(song => song.status === 'published' || song.status === 'for_sale').reduce((acc, song) => acc + song.price, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas para reservas */}
      {activeTab === 'reservations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reservas</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{reservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Total</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${reservations.reduce((acc, res) => acc + (res.offerPrice || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Por Expirar</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {reservations.filter(res => {
                    const expires = new Date(res.expiresAt);
                    const now = new Date();
                    const diffHours = (expires.getTime() - now.getTime()) / (1000 * 60 * 60);
                    return diffHours <= 24 && diffHours > 0;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {(error || actionError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error || actionError}
              </p>
            </div>
            <button
              onClick={() => {
                clearError();
                setActionError('');
              }}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Filtros - Solo para la pestaña de canciones */}
      {activeTab === 'songs' && (
        <SongsFilters 
          onFiltersChange={applyFilters}
          currentFilters={filters}
        />
      )}

      {/* Contenido principal */}
      {activeTab === 'songs' ? (
        <SongsList
          songs={songs}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      ) : (
        <ReservationsList
          reservations={reservations}
          songs={songs}
          isLoading={reservationsLoading}
          onAcceptSale={handleAcceptSale}
          onRejectSale={handleRejectSale}
        />
      )}

      {/* Información del usuario actual */}
      {user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            👨‍🎤 Modo Artista Activo
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Estás viendo las canciones de: <strong>{user.name || user.email}</strong> ({user.role})
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Puedes cambiar el estado de tus canciones y gestionarlas desde esta vista.
          </p>
        </div>
      )}
    </div>
  );
};
