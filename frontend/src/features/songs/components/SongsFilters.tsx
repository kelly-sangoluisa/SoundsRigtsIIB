'use client';

import { useState } from 'react';
import { SongFilters, SongGenre, SongStatus } from '../types';

interface SongsFiltersProps {
  onFiltersChange: (filters: SongFilters) => void;
  currentFilters: SongFilters;
}

const genres = [
  'Todos',
  'Rock',
  'Pop',
  'Jazz',
  'Blues',
  'Electronic',
  'Folk',
  'Hip Hop',
  'Classical',
  'Reggae',
  'Country',
  'Experimental'
];

const statuses = [
  { value: '', label: 'Todos los estados' },
  { value: 'published', label: 'Publicadas' },
  { value: 'draft', label: 'Borradores' },
  { value: 'archived', label: 'Archivadas' }
];

export const SongsFilters = ({ onFiltersChange, currentFilters }: SongsFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<SongFilters>(currentFilters);

  const handleSearchChange = (search: string) => {
    const newFilters = { ...localFilters, search: search || undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleGenreChange = (genre: string) => {
    const newFilters = { 
      ...localFilters, 
      genre: genre === 'Todos' ? undefined : genre as SongGenre
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStatusChange = (status: string) => {
    const newFilters = { 
      ...localFilters, 
      status: status === 'Todos' ? undefined : status as SongStatus
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SongFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = localFilters.search || localFilters.genre || localFilters.status;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar canciones
          </label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por título o género..."
            value={localFilters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filtro por género */}
        <div className="w-full lg:w-48">
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Género
          </label>
          <select
            id="genre"
            value={localFilters.genre || 'Todos'}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <div className="w-full lg:w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado
          </label>
          <select
            id="status"
            value={localFilters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors whitespace-nowrap"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
