'use client';

import { useState } from 'react';
import { Song } from '@/features/songs/types';

interface SongCardProps {
  song: Song;
  onPurchase?: (songId: string) => Promise<boolean>;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => Promise<boolean>;
  onUpdateStatus?: (songId: string, status: Song['status']) => Promise<boolean>;
  showActions?: boolean;
  showPurchaseButton?: boolean;
}

export function SongCard({ 
  song, 
  onPurchase, 
  onEdit, 
  onDelete, 
  onUpdateStatus, 
  showActions = false, 
  showPurchaseButton = false 
}: SongCardProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!onPurchase) return;
    
    setLoading(true);
    try {
      const success = await onPurchase(song.id.toString());
      if (success) {
        alert('¡Licencia comprada exitosamente!');
      }
    } catch (error) {
      alert('Error al comprar la licencia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (song.status === 'sold') {
      alert('No se puede eliminar una canción vendida');
      return;
    }
    
    if (!confirm(`¿Estás seguro de que quieres eliminar "${song.name}"?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const success = await onDelete(song.id.toString());
      if (success) {
        alert('Canción eliminada exitosamente');
      }
    } catch (error) {
      alert('Error al eliminar la canción');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Song['status']) => {
    if (!onUpdateStatus) return;
    
    setLoading(true);
    try {
      const success = await onUpdateStatus(song.id.toString(), newStatus);
      if (success) {
        alert('Estado actualizado exitosamente');
      }
    } catch (error) {
      alert('Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Song['status']) => {
    switch (status) {
      case 'for_sale':
        return 'bg-green-100 text-green-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Song['status']) => {
    switch (status) {
      case 'for_sale':
        return 'En venta';
      case 'under_review':
        return 'Pendiente';
      case 'sold':
        return 'Vendida';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{song.name}</h3>
          <p className="text-gray-600">{song.artist}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(song.status)}`}>
          {getStatusText(song.status)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Género:</span>
          <span className="text-gray-900">{song.genre}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Duración:</span>
          <span className="text-gray-900">{formatDuration(song.duration)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Precio:</span>
          <span className="text-gray-900 font-semibold">${song.price}</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-2">
        {showPurchaseButton && song.status === 'for_sale' && (
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Comprando...' : 'Comprar Licencia'}
          </button>
        )}

        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(song)}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Editar
            </button>
            
            {song.status !== 'sold' && (
              <>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors"
                >
                  Eliminar
                </button>
                
                <select
                  value={song.status}
                  onChange={(e) => handleStatusChange(e.target.value as Song['status'])}
                  disabled={loading}
                  className="flex-1 bg-white border border-gray-300 rounded-md py-2 px-3 text-sm disabled:opacity-50"
                >
                  <option value="for_sale">En venta</option>
                  <option value="under_review">Pendiente</option>
                </select>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface SongsListProps {
  songs: Song[];
  isLoading: boolean;
  onDelete: (songId: string) => Promise<boolean>;
  onEdit?: (song: Song) => void;
  onRefresh: () => void;
}

export function SongsList({ songs, isLoading, onDelete, onEdit, onRefresh }: SongsListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleDelete = async (songId: string, songName: string, status: Song['status']) => {
    if (status === 'sold') {
      alert('No puedes eliminar una canción que ya fue vendida');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar la canción "${songName}"?`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [songId]: true }));
    try {
      await onDelete(songId);
      onRefresh(); // Refrescar la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar canción:', error);
      alert('Error al eliminar la canción. Inténtalo de nuevo.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [songId]: false }));
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Song['status']) => {
    switch (status) {
      case 'for_sale':
        return 'bg-green-100 text-green-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Song['status']) => {
    switch (status) {
      case 'for_sale':
        return 'En venta';
      case 'under_review':
        return 'Pendiente';
      case 'sold':
        return 'Vendida';
      default:
        return 'Desconocido';
    }
  };

  const canEditOrDelete = (status: Song['status']): boolean => {
    return status !== 'sold';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No tienes canciones aún</p>
          <p className="mt-1">¡Crea tu primera canción para empezar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Canción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Género
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {songs.map((song) => (
              <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        🎵
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {song.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {song.artist}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white capitalize">
                    {song.genre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDuration(song.duration)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    ${song.price.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(song.status)}`}>
                    {getStatusLabel(song.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {/* Botón Editar */}
                    <button
                      onClick={() => onEdit?.(song)}
                      disabled={!canEditOrDelete(song.status) || loadingStates[song.id]}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md transition-colors ${
                        canEditOrDelete(song.status)
                          ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                          : 'text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      }`}
                      title={canEditOrDelete(song.status) ? 'Editar canción' : 'No se puede editar una canción vendida'}
                    >
                      ✏️ Editar
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => handleDelete(song.id.toString(), song.name, song.status)}
                      disabled={!canEditOrDelete(song.status) || loadingStates[song.id]}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md transition-colors ${
                        canEditOrDelete(song.status)
                          ? 'text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                          : 'text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      }`}
                      title={canEditOrDelete(song.status) ? 'Eliminar canción' : 'No se puede eliminar una canción vendida'}
                    >
                      {loadingStates[song.id] ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                      ) : (
                        '🗑️'
                      )}
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
