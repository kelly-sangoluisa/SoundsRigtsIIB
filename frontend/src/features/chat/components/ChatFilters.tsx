'use client';

import { useState } from 'react';
import { ChatFilters } from '../types';

interface ChatFiltersComponentProps {
  onFiltersChange: (filters: ChatFilters) => void;
  currentFilters: ChatFilters;
}

export const ChatFiltersComponent = ({ onFiltersChange, currentFilters }: ChatFiltersComponentProps) => {
  const [search, setSearch] = useState(currentFilters.search || '');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange({ ...currentFilters, search: value || undefined });
  };

  const handleStatusChange = (status: 'active' | 'inactive' | 'all') => {
    onFiltersChange({ ...currentFilters, status });
  };

  const handleSortChange = (sortBy: 'recent' | 'oldest' | 'activity') => {
    onFiltersChange({ ...currentFilters, sortBy });
  };

  const clearFilters = () => {
    setSearch('');
    onFiltersChange({
      status: 'active',
      sortBy: 'activity'
    });
  };

  const hasActiveFilters = currentFilters.search || currentFilters.status !== 'active';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <label htmlFor="chat-search" className="sr-only">
            Buscar chats
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="chat-search"
              type="text"
              placeholder="Buscar por canción, artista o participante..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Estado */}
        <div className="sm:w-48">
          <label htmlFor="chat-status" className="sr-only">
            Estado del chat
          </label>
          <select
            id="chat-status"
            value={currentFilters.status || 'active'}
            onChange={(e) => handleStatusChange(e.target.value as 'active' | 'inactive' | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="active">Chats Activos</option>
            <option value="inactive">Chats Inactivos</option>
            <option value="all">Todos los Chats</option>
          </select>
        </div>

        {/* Ordenar */}
        <div className="sm:w-48">
          <label htmlFor="chat-sort" className="sr-only">
            Ordenar chats
          </label>
          <select
            id="chat-sort"
            value={currentFilters.sortBy || 'activity'}
            onChange={(e) => handleSortChange(e.target.value as 'recent' | 'oldest' | 'activity')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="activity">Más Actividad</option>
            <option value="recent">Más Recientes</option>
            <option value="oldest">Más Antiguos</option>
          </select>
        </div>
      </div>

      {/* Filtros activos y limpiar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2">
            {currentFilters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                Búsqueda: "{currentFilters.search}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-1.5 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {currentFilters.status !== 'active' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                Estado: {currentFilters.status === 'all' ? 'Todos' : 'Inactivos'}
              </span>
            )}
          </div>
          
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};
