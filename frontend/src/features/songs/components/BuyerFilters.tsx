'use client';

import { useState } from 'react';
import { SongGenre } from '../types';

interface BuyerFiltersProps {
  onFiltersChange: (filters: {
    genre?: string;
    maxPrice?: number;
    search?: string;
  }) => void;
  currentFilters: {
    genre?: string;
    maxPrice?: number;
    search?: string;
  };
}

const GENRES: { value: SongGenre; label: string }[] = [
  { value: 'rock', label: 'Rock' },
  { value: 'pop', label: 'Pop' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'classical', label: 'Clásica' },
  { value: 'electronic', label: 'Electrónica' },
  { value: 'hip-hop', label: 'Hip-Hop' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'country', label: 'Country' },
  { value: 'blues', label: 'Blues' },
  { value: 'folk', label: 'Folk' }
];

export const BuyerFilters = ({ onFiltersChange, currentFilters }: BuyerFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    const newFilters = {
      ...localFilters,
      [key]: value || undefined
    };
    
    // Limpiar valores vacíos
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k as keyof typeof newFilters] === '' || newFilters[k as keyof typeof newFilters] === 0) {
        delete newFilters[k as keyof typeof newFilters];
      }
    });
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => 
    localFilters[key as keyof typeof localFilters] !== undefined && 
    localFilters[key as keyof typeof localFilters] !== ''
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Filtros de búsqueda
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Limpiar filtros
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {isExpanded ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Búsqueda - Siempre visible */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por canción, artista o género..."
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filtros expandibles */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Género
              </label>
              <select
                value={localFilters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos los géneros</option>
                {GENRES.map(genre => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio máximo
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Sin límite"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {localFilters.genre && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Género: {GENRES.find(g => g.value === localFilters.genre)?.label}
              <button 
                onClick={() => handleFilterChange('genre', undefined)}
                className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                ×
              </button>
            </span>
          )}
          {localFilters.maxPrice && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Precio: ≤ ${localFilters.maxPrice}
              <button 
                onClick={() => handleFilterChange('maxPrice', undefined)}
                className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400"
              >
                ×
              </button>
            </span>
          )}
          {localFilters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              Búsqueda: "{localFilters.search}"
              <button 
                onClick={() => handleFilterChange('search', undefined)}
                className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
