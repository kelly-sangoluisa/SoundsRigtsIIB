'use client';

import { useState } from 'react';
import { Song } from '../types';
import { formatDuration, getStatusColor, getStatusLabel } from '@/shared/utils/mockSongsAPI';

interface SongsListProps {
  songs: Song[];
  isLoading: boolean;
  onEdit: (song: Song) => void;
  onDelete: (songId: string) => Promise<void>;
  onRefresh: () => void;
}

export const SongsList = ({ songs, isLoading, onEdit, onDelete, onRefresh }: SongsListProps) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleDelete = async (songId: string, songName: string, status: Song['status']) => {
    // Verificar si la canción puede ser eliminada
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
                      onClick={() => onEdit(song)}
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
                      onClick={() => handleDelete(song.id, song.name, song.status)}
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
