'use client';

import { useState } from 'react';
import { Song } from '@/lib/api-client';

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
      case 'pending':
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
      case 'pending':
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
                  <option value="pending">Pendiente</option>
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
  title: string;
  onPurchase?: (songId: string) => Promise<boolean>;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => Promise<boolean>;
  onUpdateStatus?: (songId: string, status: Song['status']) => Promise<boolean>;
  showActions?: boolean;
  showPurchaseButton?: boolean;
  emptyMessage?: string;
  loading?: boolean;
}

export function SongsList({ 
  songs, 
  title, 
  onPurchase, 
  onEdit,
  onDelete,
  onUpdateStatus,
  showActions = false,
  showPurchaseButton = false,
  emptyMessage = 'No hay canciones disponibles',
  loading = false
}: SongsListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin canciones</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">{songs.length} canciones</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onPurchase={onPurchase}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            showActions={showActions}
            showPurchaseButton={showPurchaseButton}
          />
        ))}
      </div>
    </div>
  );
}
