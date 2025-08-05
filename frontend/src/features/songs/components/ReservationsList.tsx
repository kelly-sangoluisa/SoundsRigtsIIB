'use client';

import { useState } from 'react';
import { ReservationInfo, Song } from '../types';
import { formatDuration } from '@/shared/utils/mockSongsAPI';

interface ReservationsListProps {
  reservations: ReservationInfo[];
  songs: Song[];
  isLoading: boolean;
  onAcceptSale: (reservationId: string) => Promise<void>;
  onRejectSale: (reservationId: string) => Promise<void>;
}

export const ReservationsList = ({ 
  reservations, 
  songs, 
  isLoading, 
  onAcceptSale, 
  onRejectSale 
}: ReservationsListProps) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, 'accepting' | 'rejecting' | null>>({});

  const getSongById = (songId: string): Song | undefined => {
    return songs.find(song => song.id === songId);
  };

  const handleAcceptSale = async (reservationId: string) => {
    setLoadingStates(prev => ({ ...prev, [reservationId]: 'accepting' }));
    try {
      await onAcceptSale(reservationId);
    } catch (error) {
      console.error('Error al aceptar venta:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [reservationId]: null }));
    }
  };

  const handleRejectSale = async (reservationId: string) => {
    if (!confirm('¿Estás seguro de que quieres rechazar esta venta?')) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [reservationId]: 'rejecting' }));
    try {
      await onRejectSale(reservationId);
    } catch (error) {
      console.error('Error al rechazar venta:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [reservationId]: null }));
    }
  };

  const formatTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expirada';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) return `${diffDays}d ${diffHours}h restantes`;
    return `${diffHours}h restantes`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📬</div>
          <p className="text-lg font-medium">No tienes reservas pendientes</p>
          <p className="mt-1">Las solicitudes de compra aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => {
        const song = getSongById(reservation.songId);
        const isLoading = loadingStates[reservation.id];
        const timeRemaining = formatTimeRemaining(reservation.expiresAt);
        const isExpired = timeRemaining === 'Expirada';

        if (!song) return null;

        return (
          <div 
            key={reservation.id} 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow border-l-4 ${
              isExpired ? 'border-red-500' : 'border-orange-500'
            } p-6`}
          >
            <div className="flex items-start space-x-4">
              {/* Información de la canción */}
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-xl font-bold">
                  🎵
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Cabecera */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {song.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {song.genre} • {formatDuration(song.duration)}
                    </p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    isExpired 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                  }`}>
                    {timeRemaining}
                  </span>
                </div>

                {/* Información del comprador */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Comprador
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {reservation.buyerName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {reservation.buyerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Oferta
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${reservation.offerPrice?.toFixed(2) || song.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Precio original: ${song.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Mensaje del comprador */}
                  {reservation.message && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mensaje
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{reservation.message}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                {!isExpired && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAcceptSale(reservation.id)}
                      disabled={!!isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading === 'accepting' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Aceptando...
                        </>
                      ) : (
                        <>
                          ✅ Aceptar Venta
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleRejectSale(reservation.id)}
                      disabled={!!isLoading}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                    >
                      {isLoading === 'rejecting' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Rechazando...
                        </>
                      ) : (
                        <>
                          ❌ Rechazar
                        </>
                      )}
                    </button>
                  </div>
                )}

                {isExpired && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ⚠️ Esta reserva ha expirado. La canción volverá automáticamente a estar en venta.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
