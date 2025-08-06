import React from 'react';

export interface SongCardData {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number; // en segundos
  status: 'published' | 'draft' | 'pending' | 'available' | 'sold';
  price: number;
  coverImage?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  licenseType?: 'basic' | 'standard' | 'premium';
}

interface SongCardProps {
  song: SongCardData;
  mode: 'artist' | 'buyer';
  onPlay?: (songId: string) => void;
  onEdit?: (songId: string) => void;
  onDelete?: (songId: string) => void;
  onPurchase?: (songId: string) => void;
  onViewDetails?: (songId: string) => void;
  className?: string;
  compact?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  mode,
  onPlay,
  onEdit,
  onDelete,
  onPurchase,
  onViewDetails,
  className = '',
  compact = false
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: { text: 'Publicada', color: 'bg-green-100 text-green-800' },
      draft: { text: 'Borrador', color: 'bg-gray-100 text-gray-800' },
      pending: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      available: { text: 'Disponible', color: 'bg-blue-100 text-blue-800' },
      sold: { text: 'Vendida', color: 'bg-purple-100 text-purple-800' }
    };

    const badge = badges[status as keyof typeof badges] || badges.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const canPurchase = mode === 'buyer' && (song.status === 'available' || song.status === 'published');
  const canEdit = mode === 'artist' && song.status !== 'sold';

  if (compact) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Cover placeholder */}
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">🎵</span>
              </div>
              
              {/* Info básica */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {song.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {song.artist} • {song.genre}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {formatDuration(song.duration)}
                  </span>
                  {getStatusBadge(song.status)}
                </div>
              </div>
            </div>

            {/* Precio y acciones */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-900">
                €{song.price.toFixed(2)}
              </span>
              
              {/* Botones de acción */}
              <div className="flex space-x-1">
                {onPlay && (
                  <button
                    onClick={() => onPlay(song.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Reproducir"
                  >
                    ▶️
                  </button>
                )}
                
                {canPurchase && onPurchase && (
                  <button
                    onClick={() => onPurchase(song.id)}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                    title="Comprar"
                  >
                    🛒
                  </button>
                )}
                
                {canEdit && onEdit && (
                  <button
                    onClick={() => onEdit(song.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Editar"
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      {/* Cover image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {song.coverImage ? (
          <img 
            src={song.coverImage} 
            alt={`Cover de ${song.title}`}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <span className="text-4xl">🎵</span>
          </div>
        )}
        
        {/* Overlay con botón de play */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          {onPlay && (
            <button
              onClick={() => onPlay(song.id)}
              className="opacity-0 hover:opacity-100 bg-white bg-opacity-90 rounded-full p-3 transform scale-75 hover:scale-100 transition-all duration-200"
            >
              <span className="text-2xl">▶️</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {song.title}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              por {song.artist}
            </p>
          </div>
          <div className="ml-3">
            {getStatusBadge(song.status)}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {song.genre}
          </span>
          <span>{formatDuration(song.duration)}</span>
        </div>

        {/* Description */}
        {song.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {song.description}
          </p>
        )}

        {/* Tags */}
        {song.tags && song.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {song.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                #{tag}
              </span>
            ))}
            {song.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{song.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              €{song.price.toFixed(2)}
            </span>
            {song.licenseType && (
              <span className="text-xs text-gray-500 capitalize">
                {song.licenseType}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(song.id)}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
              >
                Ver detalles
              </button>
            )}

            {canPurchase && onPurchase && (
              <button
                onClick={() => onPurchase(song.id)}
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
              >
                Comprar
              </button>
            )}

            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(song.id)}
                className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition-colors duration-200"
              >
                Editar
              </button>
            )}

            {canEdit && onDelete && song.status === 'draft' && (
              <button
                onClick={() => onDelete(song.id)}
                className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors duration-200"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
